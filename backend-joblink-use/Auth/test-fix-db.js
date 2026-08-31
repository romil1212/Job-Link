import mongoose from "mongoose";
import Problem from "./src/models/problem.model.js";
import dotenv from "dotenv";

dotenv.config();

async function fixDb() {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/joblink");

    const p1 = await Problem.findOne({ title: "Two Sum" });
    
    if (p1) {
        await Problem.findOneAndUpdate(
            { title: "Two Sum E2E" },
            { $set: { starterCode: p1.starterCode } }
        );
        console.log("Copied starterCode from 'Two Sum' to 'Two Sum E2E'.");
    } else {
        console.log("Could not find 'Two Sum' to copy starter code from.");
    }

    mongoose.disconnect();
}

fixDb();
