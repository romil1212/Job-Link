import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import Problem from "../src/models/problem.model.js";
import TestCase from "../src/models/testCase.model.js";
import { generateAccessToken } from "../src/utils/token.js";

// Utility functions for mocking auth tests (mocking email since we don't want timeouts)
// For these tests we just bypass the email by mocking vitest in our setup if needed, or just insert user directly.

describe("Test Case Management API", () => {
    let adminToken, normalUserToken;
    let adminUser, normalUser;
    let testProblem;

    beforeAll(async () => {
        // Connect to test database
        const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/joblink_test";
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGODB_URI);
        }

        // Clean up database
        await User.deleteMany({});
        await Problem.deleteMany({});
        await TestCase.deleteMany({});

        // Create Admin User
        adminUser = await User.create({
            username: "admin_testcase",
            email: "admin_testcase@example.com",
            password: "Password123!",
            fullName: "Admin Test",
            role: "admin",
            verified: true
        });

        // Create Normal User
        normalUser = await User.create({
            username: "user_testcase",
            email: "user_testcase@example.com",
            password: "Password123!",
            fullName: "User Test",
            role: "user",
            verified: true
        });

        adminToken = generateAccessToken({ id: adminUser._id });
        normalUserToken = generateAccessToken({ id: normalUser._id });

        // Create a test problem
        testProblem = await Problem.create({
            title: "Test Case Problem",
            slug: "test-case-problem",
            description: "Test description",
            difficulty: "easy",
            category: "Array",
            createdBy: adminUser._id
        });
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Problem.deleteMany({});
        await TestCase.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear test cases before each test
        await TestCase.deleteMany({});
    });

    // 1. Admin can create a test case
    it("should allow an admin to create a test case", async () => {
        const response = await request(app)
            .post(`/api/admin/problems/${testProblem._id}/test-cases`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                input: "2\n3",
                expectedOutput: "5",
                isHidden: false,
                order: 1,
                explanation: "Basic addition"
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.testCase.input).toBe("2\n3");
        expect(response.body.testCase.expectedOutput).toBe("5");
        expect(response.body.testCase.isHidden).toBe(false);
    });

    // 2. Unauthenticated user cannot create
    it("should reject unauthenticated user from creating a test case", async () => {
        const response = await request(app)
            .post(`/api/admin/problems/${testProblem._id}/test-cases`)
            .send({
                input: "2\n3",
                expectedOutput: "5"
            });

        expect(response.status).toBe(401);
    });

    // 3. Normal user cannot create
    it("should reject normal user from creating a test case", async () => {
        const response = await request(app)
            .post(`/api/admin/problems/${testProblem._id}/test-cases`)
            .set("Authorization", `Bearer ${normalUserToken}`)
            .send({
                input: "2\n3",
                expectedOutput: "5"
            });

        expect(response.status).toBe(403);
    });

    // 4. Admin can list test cases & 14. Admin endpoint includes hidden test cases
    it("should allow admin to list all test cases including hidden ones", async () => {
        await TestCase.create([
            { problem: testProblem._id, input: "1", expectedOutput: "1", isHidden: false, createdBy: adminUser._id },
            { problem: testProblem._id, input: "2", expectedOutput: "2", isHidden: true, createdBy: adminUser._id }
        ]);

        const response = await request(app)
            .get(`/api/admin/problems/${testProblem._id}/test-cases`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.testCases.length).toBe(2);
        const hiddenCase = response.body.testCases.find(tc => tc.isHidden === true);
        expect(hiddenCase).toBeDefined();
    });

    // 5. Admin can retrieve a test case
    it("should allow admin to retrieve a specific test case by ID", async () => {
        const tc = await TestCase.create({
            problem: testProblem._id, input: "1", expectedOutput: "1", isHidden: false, createdBy: adminUser._id
        });

        const response = await request(app)
            .get(`/api/admin/test-cases/${tc._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.testCase._id).toBe(tc._id.toString());
    });

    // 6. Admin can update a test case
    it("should allow admin to update a test case", async () => {
        const tc = await TestCase.create({
            problem: testProblem._id, input: "1", expectedOutput: "1", isHidden: false, createdBy: adminUser._id
        });

        const response = await request(app)
            .put(`/api/admin/test-cases/${tc._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                expectedOutput: "100",
                isHidden: true
            });

        expect(response.status).toBe(200);
        expect(response.body.testCase.expectedOutput).toBe("100");
        expect(response.body.testCase.isHidden).toBe(true);
    });

    // 7. Admin can delete a test case
    it("should allow admin to delete a test case", async () => {
        const tc = await TestCase.create({
            problem: testProblem._id, input: "1", expectedOutput: "1", isHidden: false, createdBy: adminUser._id
        });

        const response = await request(app)
            .delete(`/api/admin/test-cases/${tc._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        const exists = await TestCase.findById(tc._id);
        expect(exists).toBeNull();
    });

    // 8. Invalid problem ID returns 404/400
    it("should return 400 for invalid problem ID format", async () => {
        const response = await request(app)
            .post(`/api/admin/problems/invalid123/test-cases`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ input: "1", expectedOutput: "1" });

        expect(response.status).toBe(400);
    });

    // 9. Nonexistent problem returns 404
    it("should return 404 for nonexistent problem ID", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post(`/api/admin/problems/${fakeId}/test-cases`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ input: "1", expectedOutput: "1" });

        expect(response.status).toBe(404);
    });

    // 10. Missing input returns 400
    it("should return 400 when input is missing", async () => {
        const response = await request(app)
            .post(`/api/admin/problems/${testProblem._id}/test-cases`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ expectedOutput: "1" }); // missing input

        expect(response.status).toBe(400);
        expect(response.body.errors[0].field).toBe("input");
    });

    // 11. Missing expectedOutput returns 400
    it("should return 400 when expectedOutput is missing", async () => {
        const response = await request(app)
            .post(`/api/admin/problems/${testProblem._id}/test-cases`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ input: "1" }); // missing output

        expect(response.status).toBe(400);
        expect(response.body.errors[0].field).toBe("expectedOutput");
    });

    // 12 & 13. Public endpoint returns only public test cases & Hidden cases are excluded
    it("should return only public test cases on the public endpoint and exclude sensitive fields", async () => {
        await TestCase.create([
            { problem: testProblem._id, input: "public_in", expectedOutput: "public_out", isHidden: false, createdBy: adminUser._id },
            { problem: testProblem._id, input: "hidden_in", expectedOutput: "hidden_out", isHidden: true, createdBy: adminUser._id }
        ]);

        const response = await request(app)
            .get(`/api/problems/${testProblem.slug}/sample-testcases`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.testCases.length).toBe(1);
        
        const tc = response.body.testCases[0];
        expect(tc.input).toBe("public_in");
        expect(tc.expectedOutput).toBe("public_out");
        
        // Security checks
        expect(tc.isHidden).toBeUndefined();
        expect(tc.createdBy).toBeUndefined();
        expect(tc.updatedBy).toBeUndefined();
        expect(tc.createdAt).toBeUndefined();
    });

    // 15. Unauthorized users cannot access admin test-case APIs
    it("should prevent unauthorized users from accessing admin test-case APIs", async () => {
        const response = await request(app)
            .get(`/api/admin/problems/${testProblem._id}/test-cases`)
            .set("Authorization", `Bearer ${normalUserToken}`);

        expect(response.status).toBe(403);
    });

    // 16. Invalid test-case ID returns 400
    it("should return 400 for invalid test-case ID", async () => {
        const response = await request(app)
            .get(`/api/admin/test-cases/invalidID`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(400);
    });
});
