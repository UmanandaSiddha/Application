import { Server } from "socket.io";
import { redis } from "./server.js";

let io;

export function initWs(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", async (socket) => {
        const userId = socket.handshake.query.userId;
        const socketId = socket.id;

        if (!userId) {
            console.log("No userId provided, disconnecting socket.");
            socket.disconnect();
            return;
        }

        console.log(`User connected: userId=${userId}, socketId=${socketId}`);

        await redis.hset("userSockets", userId, socketId);

        socket.on("disconnect", async () => {
            console.log(`User disconnected: userId=${userId}`);
            await redis.hdel("userSockets", userId);
        });
    });
}

export { io };