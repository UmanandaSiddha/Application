import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";
import Razorpay from "razorpay";
import Stripe from "stripe";

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err}`);
    console.log(`Shutting down the server due to Uncaught Exception`);

    process.exit(1);
});

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDatabase();

// export const CLIENT_URL="https://app.umanandasiddha.site";
export const CLIENT_URL = "http://localhost:5173";

export const stripe = new Stripe(process.env.STRIPE_KEY || "");

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server Working Test5!"
    })
});

const server = app.listen( PORT, () => {
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