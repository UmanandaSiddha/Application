import { Server } from "socket.io";

export function initWs(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", async (socket) => {
        // Auth checks should happen here
        const host = socket.handshake.headers.host;
        console.log(`host is ${host}`);
        // Split the host by '.' and take the first part as replId
        const replId = host?.split('.')[0];
    
        if (!replId) {
            socket.disconnect();
            return;
        }

        console.log("socket_id", socket.id);

        const userId = socket.handshake.query.userId;
        console.log("User connected with ID:", userId);


        initHandlers(socket, replId);
    });
}

function initHandlers(socket, replId) {

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
}