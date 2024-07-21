"use client";
import { useState, useEffect } from 'react';
import fetchSession from './fetchSession';

interface Session {
    id: string;
    userId: string;
    username: string;
    email: string;
}

const useSession = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSessionData = async () => {
            try {
                const sessionData = await fetchSession();
                setSession(sessionData);
            } catch (error) {
                console.error("Failed to fetch session:", error);
            } finally {
                setLoading(false);
            }
        };

        getSessionData();
    }, []);

    return { session, loading };
};

export default useSession;
