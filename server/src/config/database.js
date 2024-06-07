import mongoose from "mongoose";

export default function connectDatabase() {
    mongoose
        .connect(process.env.MONGO_URL)
        .then((data) => {
            console.log(`Mongodb connected ${data.connection.host}`);
        })
}