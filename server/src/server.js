import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";
import Razorpay from "razorpay";
import "./utils/queue/emailQueue.js";
import "./utils/queue/donationQueue.js";
import "./utils/queue/subscriptionQueue.js";
import Redis from "ioredis";
import { createServer } from "http";
import { initWs } from "./ws.js";

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    
    process.exit(1);
});

dotenv.config();

export const redis = new Redis();
const PORT = process.env.PORT || 4000;

connectDatabase();

export const CLIENT_URL = process.env.NODE_ENV === "production" ? "https://voolata.com" : "http://localhost:5173";
export const SERVER_URL = process.env.NODE_ENV === "production" ? "https://api.voolata.com" : "http://localhost:7070";

const httpServer = createServer(app);

initWs(httpServer);

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server Working 4.0!"
    })
});

const server = httpServer.listen( PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});