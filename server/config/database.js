import mongoose from "mongoose";

export default function connectDatabase() {
    mongoose
        .connect(process.env.MONGO_URI)
        .then((data) => {
            console.log(`Mongodb connected ${data.connection.host}`);
        })
}