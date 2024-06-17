import mongoose from "mongoose";

export default function connectDatabase() {
    mongoose
        .connect("mongodb+srv://umanandasiddha243:7JG0k5f2wITp78oF@cluster0.fheoz2x.mongodb.net/vcards")
        .then((data) => {
            console.log(`Mongodb connected ${data.connection.host}`);
        })
}