export const dynamic = 'force-dynamic'


import { redis } from "@/lib/redis"
import { genId } from "@/lib/utils"

interface CreateUserAttrs {
    username: string
    password: string
    email: string
}

export const getUserByUsername = async (username: string) => {
    const decimalId = await redis.zscore('usernames', username)
    if (!decimalId) return { error: "User does not exists!" }
    const id = decimalId.toString(16)
    const user = await redis.hgetall(`user:${id}`)
    return deserialize(id, user as { [keys: string]: string })
}

export const getUserById = async (id: string) => {
    const user = await redis.hgetall(`user:${id}`)
    if (!user || Object.keys(user).length === 0) {
        return null // Handle the case where user is not found
    }
    return deserialize(id, user as { [keys: string]: string })
}
export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId()
    const UserExists = await redis.sismember('usernames:unique', attrs.username)
    const EmailExists = await redis.sismember('emails:unique', attrs.email)
    if (UserExists) return { error: "Username is taken!" }
    if (EmailExists) return { error: "Email is taken!" }
    await redis.hset(`user:${id}`, serialize(attrs))
    await redis.sadd('usernames:unique', attrs.username)
    await redis.sadd('emails:unique', attrs.email)
    await redis.zadd('usernames', { 'score': parseInt(id, 16), 'member': attrs.username },)
    await redis.zadd('emails', { 'score': parseInt(id, 16), 'member': attrs.email },)

    return { id }
}

const serialize = (user: CreateUserAttrs) => {
    return {
        username: user.username,
        password: user.password,
        email: user.email
    }
}

const deserialize = (id: string, user: { [key: string]: string }) => {
    if (!user) {
        console.error("Deserialization error: user is null or undefined")
    }
    return {
        id,
        username: user.username,
        password: user.password,
        email: user.email
    }
}
