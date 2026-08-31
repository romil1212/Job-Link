import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/user.model.js";
import config from "../src/config/config.js";

const createAdmin = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);

        console.log("Database connected");

        const email = "yagnikvittlani@gmail.com";
        const password = "Admin@12345";
        const username = "joblink_admin";

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            email
        });

        if (existingAdmin) {
            console.log("Admin already exists");

            await mongoose.disconnect();
            return;
        }

        const admin = await User.create({
            fullName: "JobLink Admin",
            username,
            email,
            password,
            verified: true,
            role: "admin",
            isActive: true
        });

        console.log("================================");
        console.log("Admin created successfully");
        console.log("Email:", admin.email);
        console.log("Username:", admin.username);
        console.log("Role:", admin.role);
        console.log("================================");

        await mongoose.disconnect();

    } catch (error) {
        console.error("Failed to create admin:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

createAdmin();