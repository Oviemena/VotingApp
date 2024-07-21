import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import { Redis } from "ioredis";
import "dotenv/config";

const app = express();
app.use(cors());

const redisConnectionString = process.env.REDIS_CONNECTION_STRING || "your_default_redis_connection_string";
const redis = new Redis(redisConnectionString);
const subRedis = new Redis(redisConnectionString);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(addUserToSocketDataIfAuthenticated);

async function addUserToSocketDataIfAuthenticated(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth.token;
  console.log("Token is:", token);
  if (token) {
    try {
      const { userId } = token;
      const userData = await redis.hgetall(`user:${userId}`);
      console.log("userData is:", userData);
      if (Object.keys(userData).length > 0) {
        socket.data = { ...socket.data, ...token };
        console.log("Authenticated user data:", socket.data);
        next();
      } else {
        next(new Error("Authentication error"));
      }
    } catch (err) {
      next(new Error("Authentication error"));
    }
  } else {
    next(new Error("Authentication error"));
  }
}

subRedis.on("message", (channel, message) => {
  io.to(channel).emit("room-update", message);
});

subRedis.on("error", (err) => {
  console.error("Redis subscription error", err);
});

io.on("connection", async (socket) => {
  const { id, userId, username } = socket.data;

  if (!id) {
    socket.disconnect();
    return;
  }

  console.log(`${username} is connected`);

  socket.on("join-room", async (room: string) => {
    console.log(`${username} is attempting to join room: ${room}`);
    const userExists = await redis.exists(`user:${userId}`);
    console.log("userExists is:", userExists);
    if (!userExists && !id) {
      console.log("User no longer exists, cannot join room");
      socket.disconnect();
      return;
    }

    console.log(`${username} joined room: ${room}`);
    await socket.join(room);
    await redis.sadd(`rooms:${socket.id}`, room);
    await redis.hincrby("room-connections", room, 1);

    const subscribedRooms = await redis.smembers("subscribed-rooms");
    if (!subscribedRooms.includes(room)) {
      subRedis.subscribe(room, async (err) => {
        if (err) {
          console.error("Failed to subscribe:", err);
        } else {
          await redis.sadd("subscribed-rooms", room);
          console.log(`${username} subscribed to room: ${room}`);
        }
      });
    }
  });

  socket.on("disconnect", async () => {
    const joinedRooms = await redis.smembers(`rooms:${socket.id}`);
    await redis.del(`rooms:${socket.id}`);

    for (const room of joinedRooms) {
      const remainingConnections = await redis.hincrby("room-connections", room, -1);
      if (remainingConnections <= 0) {
        await redis.hdel("room-connections", room);
        subRedis.unsubscribe(room, async (err) => {
          if (err) {
            console.error("Failed to unsubscribe", err);
          } else {
            await redis.srem("subscribed-rooms", room);
            console.log(`${username} unsubscribed from room: ${room}`);
          }
        });
      }
    }
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
