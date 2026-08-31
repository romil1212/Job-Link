import mongoose from "mongoose";
import dotenv from "dotenv";
import { beforeAll, afterAll, vi } from "vitest";

dotenv.config();

// Globally mock the email service to prevent network timeouts and real emails
vi.mock("../src/services/email.service.js", () => ({
    sendEmail: vi.fn().mockResolvedValue({
        messageId: "mock-message-id",
        accepted: ["test@example.com"],
        rejected: []
    })
}));

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGO_URI);

    console.log("Test database connected");
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    console.log("Test database disconnected");
});