import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(config.MONGO_URI);

        console.log("Database Connected Successfully");

        mongoose.connection.on("disconnected", () => {
            console.warn("Database Disconnected");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("Database Reconnected");
        });

        mongoose.connection.on("error", (error) => {
            console.error("Database Error:", error.message);
        });

    } catch (error) {
        console.error("Database Connection Failed:", error.message);
        throw error;
    }
}

export default connectDB;