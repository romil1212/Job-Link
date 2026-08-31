import mongoose from "mongoose";
import Problem from "./src/models/problem.model.js";
import dotenv from "dotenv";

dotenv.config();

async function checkDb() {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/joblink");

    const p1 = await Problem.findOne({ title: "Two Sum" });
    const p2 = await Problem.findOne({ title: "Two Sum E2E" });

    console.log("Two Sum (original) starterCode langs:", p1 ? p1.starterCode.map(sc => sc.language) : "Not found");
    console.log("Two Sum E2E starterCode langs:", p2 ? p2.starterCode.map(sc => sc.language) : "Not found");

    mongoose.disconnect();
}

checkDb();
