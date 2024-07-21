export const dynamic = 'force-dynamic'
// "use server"

import { redis } from "@/lib/redis";
import { cookies } from 'next/headers';


export interface Session {
    id: string;
    userId: string;
    username: string;
    email: string;
}

export const getSession = async (id: string): Promise<Session | null> => {
    const session = await redis.hgetall(`sessions:${id}`);
    if (!session || Object.keys(session).length === 0) {
        console.log(`No session found for id: ${id}`);
        return null;
    }

    const sessionData = deserialize(id, session as { [key: string]: string });
    console.log('Session retrieved:', sessionData);
    return sessionData;
}

export const saveSession = async (session: Session) => {
    console.log("SavedSession:", session)
    const { userId, username, email, id } = session
    await redis.hset(`sessions:${session.id}`, { id, username, email, userId }
    )
    const maxAge = 60 * 60 * 24 * 7; // 1 week
    const cookie = cookies().set({
        name: 'session-id',
        value: session.id,
        httpOnly: true,
        sameSite: 'lax',
        maxAge,
        path: '/',
        secure: true
    });

    return cookie;
}


export const deleteSession = async (id: string): Promise<void> => {

    cookies().delete('session-id')
    await redis.del(`sessions:${id}`)

}

export const deserialize = (id: string, session: { [key: string]: string }) => {
    return {
        id,
        userId: session.userId,
        username: session.username,
        email: session.email,
    };
}


