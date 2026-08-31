import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import userModel from "../src/models/user.model.js";
import sessionModel from "../src/models/session.model.js";
import Problem from "../src/models/problem.model.js";
import { generateAccessToken, generateRefreshToken } from "../src/utils/token.js";
import crypto from "crypto";

const hashValue = (value) => {
    return crypto.createHash("sha256").update(String(value)).digest("hex");
};

describe("Phase 1: Problem Management Module", () => {
    let adminToken;
    let userToken;
    let adminUser;
    let regularUser;

    beforeAll(async () => {
        // Clean previous test data
        await Problem.deleteMany({});

        const timestamp = Date.now();

        // 1. Create Admin User & Session
        adminUser = await userModel.create({
            fullName: "Problem Admin",
            username: `problem_admin_${timestamp}`,
            email: `admin_${timestamp}@joblink.com`,
            password: "Admin@12345",
            role: "admin",
            verified: true,
            isActive: true
        });

        const adminRefresh = generateRefreshToken({ id: adminUser._id });
        const adminSession = await sessionModel.create({
            user: adminUser._id,
            refreshTokenHash: hashValue(adminRefresh),
            userAgent: "vitest-agent"
        });

        adminToken = generateAccessToken({
            id: adminUser._id,
            sessionId: adminSession._id,
            role: adminUser.role
        });

        // 2. Create Regular User & Session
        regularUser = await userModel.create({
            fullName: "Normal Developer",
            username: `dev_user_${timestamp}`,
            email: `dev_${timestamp}@joblink.com`,
            password: "User@12345",
            role: "user",
            verified: true,
            isActive: true
        });

        const userRefresh = generateRefreshToken({ id: regularUser._id });
        const userSession = await sessionModel.create({
            user: regularUser._id,
            refreshTokenHash: hashValue(userRefresh),
            userAgent: "vitest-agent"
        });

        userToken = generateAccessToken({
            id: regularUser._id,
            sessionId: userSession._id,
            role: regularUser.role
        });
    });

    // =========================================================================
    // 1. Admin Problem Creation
    // =========================================================================
    describe("POST /api/admin/problems", () => {
        it("should allow an admin to create a valid problem", async () => {
            const res = await request(app)
                .post("/api/admin/problems")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    title: "Two Sum",
                    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                    difficulty: "easy",
                    category: "Array",
                    tags: ["array", "hash-table"],
                    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
                    examples: [
                        {
                            input: "nums = [2,7,11,15], target = 9",
                            output: "[0,1]",
                            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
                        }
                    ],
                    starterCode: [
                        {
                            language: "javascript",
                            code: "function twoSum(nums, target) {\n    // Write your code here\n}"
                        }
                    ],
                    timeLimit: 1500,
                    memoryLimit: 128
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.problem).toBeDefined();
            expect(res.body.problem.slug).toBe("two-sum");
            expect(res.body.problem.difficulty).toBe("easy");
            expect(res.body.problem.createdBy.toString()).toBe(adminUser._id.toString());
        });

        it("should reject problem creation with duplicate slug (409 Conflict)", async () => {
            const res = await request(app)
                .post("/api/admin/problems")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    title: "Two Sum",
                    description: "Another duplicate two sum",
                    difficulty: "easy",
                    category: "Array"
                });

            expect(res.status).toBe(409);
            expect(res.body.message).toContain("already exists");
        });

        it("should allow same title with a different explicit slug", async () => {
            const res = await request(app)
                .post("/api/admin/problems")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    title: "Two Sum",
                    slug: "two-sum-ii-input-array-is-sorted",
                    description: "Two Sum variant with sorted array",
                    difficulty: "medium",
                    category: "Array"
                });

            expect(res.status).toBe(201);
            expect(res.body.problem.slug).toBe("two-sum-ii-input-array-is-sorted");
        });

        it("should reject creation when required fields are missing (400)", async () => {
            const res = await request(app)
                .post("/api/admin/problems")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    title: "Incomplete Problem"
                    // missing description, difficulty, category
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errors).toBeDefined();
        });

        it("should reject creation when difficulty is invalid (400)", async () => {
            const res = await request(app)
                .post("/api/admin/problems")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    title: "Impossible Problem",
                    description: "A hard problem",
                    difficulty: "super-hard",
                    category: "Algorithms"
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should forbid normal users from creating problems (403)", async () => {
            const res = await request(app)
                .post("/api/admin/problems")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Hacker Problem",
                    description: "Should not be created",
                    difficulty: "easy",
                    category: "Array"
                });

            expect(res.status).toBe(403);
            expect(res.body.message).toContain("not authorized");
        });

        it("should reject unauthenticated requests (401)", async () => {
            const res = await request(app)
                .post("/api/admin/problems")
                .send({
                    title: "Ghost Problem",
                    description: "No auth header",
                    difficulty: "easy",
                    category: "Array"
                });

            expect(res.status).toBe(401);
        });
    });

    // =========================================================================
    // 2. Admin Problem Update & Delete
    // =========================================================================
    describe("Admin PUT & DELETE /api/admin/problems/:id", () => {
        let testProblem;

        beforeAll(async () => {
            testProblem = await Problem.create({
                title: "Reverse String",
                slug: "reverse-string",
                description: "Reverse an array of characters in-place.",
                difficulty: "easy",
                category: "Two Pointers",
                tags: ["string", "two-pointers"],
                isPublished: false, // Draft initially
                createdBy: adminUser._id
            });
        });

        it("should allow admin to fetch problem by ID with full metadata", async () => {
            const res = await request(app)
                .get(`/api/admin/problems/${testProblem._id}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.problem._id.toString()).toBe(testProblem._id.toString());
            expect(res.body.problem.createdBy.email).toBe(adminUser.email);
        });

        it("should allow admin to update a problem", async () => {
            const res = await request(app)
                .put(`/api/admin/problems/${testProblem._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    difficulty: "medium",
                    isPublished: true
                });

            expect(res.status).toBe(200);
            expect(res.body.problem.difficulty).toBe("medium");
            expect(res.body.problem.isPublished).toBe(true);
            expect(res.body.problem.updatedBy.toString()).toBe(adminUser._id.toString());
        });

        it("should return 404 for updating non-existent problem ID", async () => {
            const fakeId = "507f1f77bcf86cd799439011";
            const res = await request(app)
                .put(`/api/admin/problems/${fakeId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ difficulty: "hard" });

            expect(res.status).toBe(404);
        });

        it("should allow admin to delete a problem", async () => {
            const toDelete = await Problem.create({
                title: "To Be Deleted",
                slug: "to-be-deleted",
                description: "Temporary problem",
                difficulty: "easy",
                category: "Trash",
                createdBy: adminUser._id
            });

            const res = await request(app)
                .delete(`/api/admin/problems/${toDelete._id}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toContain("deleted");

            const check = await Problem.findById(toDelete._id);
            expect(check).toBeNull();
        });
    });

    // =========================================================================
    // 3. Public Problem Catalog & Filtering
    // =========================================================================
    describe("Public GET /api/problems", () => {
        beforeAll(async () => {
            // Seed a few known problems for filtering/pagination
            await Problem.create([
                {
                    title: "Valid Anagram",
                    slug: "valid-anagram",
                    description: "Given two strings s and t, return true if t is an anagram of s.",
                    difficulty: "easy",
                    category: "String",
                    tags: ["string", "hash-table"],
                    isPublished: true,
                    createdBy: adminUser._id
                },
                {
                    title: "Longest Substring Without Repeating Characters",
                    slug: "longest-substring-without-repeating-characters",
                    description: "Find length of longest substring without repeating chars.",
                    difficulty: "medium",
                    category: "Sliding Window",
                    tags: ["string", "sliding-window"],
                    isPublished: true,
                    createdBy: adminUser._id
                },
                {
                    title: "Median of Two Sorted Arrays",
                    slug: "median-of-two-sorted-arrays",
                    description: "Find median of two sorted arrays in O(log(m+n)).",
                    difficulty: "hard",
                    category: "Binary Search",
                    tags: ["array", "binary-search"],
                    isPublished: true,
                    createdBy: adminUser._id
                },
                {
                    title: "Unpublished Secret Challenge",
                    slug: "unpublished-secret-challenge",
                    description: "Not yet ready for public.",
                    difficulty: "hard",
                    category: "Dynamic Programming",
                    tags: ["dp"],
                    isPublished: false, // DRAFT
                    createdBy: adminUser._id
                }
            ]);
        });

        it("should list only published problems without exposing createdBy/internal admin fields", async () => {
            const res = await request(app).get("/api/problems");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.problems)).toBe(true);

            // Unpublished problem must be excluded
            const slugs = res.body.problems.map((p) => p.slug);
            expect(slugs).not.toContain("unpublished-secret-challenge");

            // Safety check: createdBy must not be present in public list
            res.body.problems.forEach((p) => {
                expect(p.createdBy).toBeUndefined();
                expect(p.updatedBy).toBeUndefined();
            });
        });

        it("should filter problems by difficulty", async () => {
            const res = await request(app).get("/api/problems?difficulty=hard");

            expect(res.status).toBe(200);
            res.body.problems.forEach((p) => {
                expect(p.difficulty).toBe("hard");
            });
        });

        it("should filter problems by tag", async () => {
            const res = await request(app).get("/api/problems?tag=sliding-window");

            expect(res.status).toBe(200);
            expect(res.body.problems.length).toBeGreaterThanOrEqual(1);
            expect(res.body.problems[0].slug).toBe("longest-substring-without-repeating-characters");
        });

        it("should search problems by title or category", async () => {
            const res = await request(app).get("/api/problems?search=Anagram");

            expect(res.status).toBe(200);
            expect(res.body.problems.length).toBe(1);
            expect(res.body.problems[0].slug).toBe("valid-anagram");
        });

        it("should support pagination", async () => {
            const res = await request(app).get("/api/problems?page=1&limit=2");

            expect(res.status).toBe(200);
            expect(res.body.problems.length).toBeLessThanOrEqual(2);
            expect(res.body.page).toBe(1);
            expect(res.body.totalPages).toBeDefined();
            expect(res.body.total).toBeDefined();
        });
    });

    // =========================================================================
    // 4. Public Problem Details by Slug
    // =========================================================================
    describe("Public GET /api/problems/:slug", () => {
        it("should return complete public problem details for valid published slug", async () => {
            const res = await request(app).get("/api/problems/two-sum");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.problem).toBeDefined();
            expect(res.body.problem.slug).toBe("two-sum");
            expect(res.body.problem.description).toBeDefined();
            expect(res.body.problem.examples).toBeDefined();
            expect(res.body.problem.starterCode).toBeDefined();
            expect(res.body.problem.constraints).toBeDefined();

            // Safety checks
            expect(res.body.problem.createdBy).toBeUndefined();
            expect(res.body.problem.updatedBy).toBeUndefined();
        });

        it("should return 404 for non-existent slug", async () => {
            const res = await request(app).get("/api/problems/non-existent-slug-12345");

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Problem not found.");
        });

        it("should return 404 for unpublished draft problem slug", async () => {
            const res = await request(app).get("/api/problems/unpublished-secret-challenge");

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Problem not found.");
        });
    });
});
