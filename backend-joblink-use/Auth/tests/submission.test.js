import request from "supertest";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import Problem from "../src/models/problem.model.js";
import Submission from "../src/models/submission.model.js";
import { generateAccessToken } from "../src/utils/token.js";
import mongoose from "mongoose";

// Mock the queue so tests don't actually try to connect to Redis
vi.mock("../src/queue/submissionQueue.js", () => ({
    submissionQueue: {
        add: vi.fn().mockResolvedValue({ id: "mockJobId" })
    }
}));

describe("Submission API", () => {
    let user;
    let token;
    let problem;

    beforeEach(async () => {
        // Create user
        user = await User.create({
            fullName: "Sub Tester",
            username: "subtester",
            email: "subtester@example.com",
            password: "password123",
            verified: true,
            role: "user"
        });
        token = generateAccessToken({ id: user._id });

        // Create problem
        problem = await Problem.create({
            title: "Test Submission Problem",
            slug: "test-sub-problem",
            description: "Just a test problem",
            difficulty: "easy",
            category: "Array",
            supportedLanguages: ["javascript", "python"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdBy: user._id
        });
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Problem.deleteMany({});
        await Submission.deleteMany({});
        vi.clearAllMocks();
    });

    it("should reject unauthenticated submission request", async () => {
        const res = await request(app)
            .post("/api/submissions/run")
            .send({
                problemId: problem._id,
                language: "javascript",
                sourceCode: "console.log('hi');"
            });
        expect(res.status).toBe(401);
    });

    it("should reject submission without problemId", async () => {
        const res = await request(app)
            .post("/api/submissions")
            .set("Authorization", `Bearer ${token}`)
            .send({
                language: "javascript",
                sourceCode: "console.log('hi');"
            });
        expect(res.status).toBe(400);
    });

    it("should reject submission with an unsupported language", async () => {
        const res = await request(app)
            .post("/api/submissions")
            .set("Authorization", `Bearer ${token}`)
            .send({
                problemId: problem._id,
                language: "java", // problem only supports js and py
                sourceCode: "class Solution {}"
            });
        expect(res.status).toBe(400);
        expect(res.body.message).toContain("not supported");
    });

    it("should reject submission exceeding 100KB source code", async () => {
        const hugeCode = "a".repeat(102401); // 1 byte over 100KB
        const res = await request(app)
            .post("/api/submissions")
            .set("Authorization", `Bearer ${token}`)
            .send({
                problemId: problem._id,
                language: "javascript",
                sourceCode: hugeCode
            });
        expect(res.status).toBe(413);
        expect(res.body.message || res.text).toContain("request entity too large");
    });

    it("should successfully queue a Run code request", async () => {
        const res = await request(app)
            .post("/api/submissions/run")
            .set("Authorization", `Bearer ${token}`)
            .send({
                problemId: problem._id,
                language: "javascript",
                sourceCode: "console.log('hello run');"
            });
        
        expect(res.status).toBe(202);
        expect(res.body.success).toBe(true);
        expect(res.body.submissionId).toBeDefined();

        const submission = await Submission.findById(res.body.submissionId);
        expect(submission.isRun).toBe(true);
        expect(submission.status).toBe("QUEUED");
    });

    it("should successfully queue a Submit code request", async () => {
        const res = await request(app)
            .post("/api/submissions")
            .set("Authorization", `Bearer ${token}`)
            .send({
                problemId: problem._id,
                language: "javascript",
                sourceCode: "console.log('hello submit');"
            });
        
        expect(res.status).toBe(202);
        expect(res.body.success).toBe(true);
        expect(res.body.submissionId).toBeDefined();

        const submission = await Submission.findById(res.body.submissionId);
        expect(submission.isRun).toBe(false);
        expect(submission.status).toBe("QUEUED");
    });

    it("should not allow a user to view another user's submission status", async () => {
        const anotherUser = await User.create({
            fullName: "Hacker User",
            username: "hacker",
            email: "hacker@example.com",
            password: "password123",
            verified: true,
            role: "user"
        });
        const hackerToken = generateAccessToken({ id: anotherUser._id });

        const submission = await Submission.create({
            user: user._id,
            problem: problem._id,
            language: "javascript",
            sourceCode: "console.log('secret');",
            isRun: false
        });

        const res = await request(app)
            .get(`/api/submissions/${submission._id}`)
            .set("Authorization", `Bearer ${hackerToken}`);
        
        expect(res.status).toBe(403);
        expect(res.body.message).toContain("Unauthorized");
    });
});
