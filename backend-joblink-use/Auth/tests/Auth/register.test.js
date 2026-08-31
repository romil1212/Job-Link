import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("POST /api/auth/register", () => {

    it("should register a new user", async () => {

        const timestamp = Date.now();

        const uniqueEmail =
            `test${timestamp}@example.com`;

        const uniqueUsername =
            `testuser${timestamp}`;

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                fullName: "Test User",
                username: uniqueUsername,
                email: uniqueEmail,
                password: "Test@12345"
            });

        console.log(response.body);

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe("user registered successfully");

        expect(response.body.user)
            .toBeDefined();

        expect(response.body.user.email)
            .toBe(uniqueEmail);

        expect(response.body.user.username)
            .toBe(uniqueUsername);

        expect(response.body.user.verified)
            .toBe(false);
    });


    it("should return 400 when email is missing", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                fullName: "Test User",
                username: `testuser${Date.now()}`,
                password: "Test@12345"
            });

        expect(response.status)
            .toBe(400);

        expect(response.body)
            .toHaveProperty(
                "message",
                "email is required"
            );
    });

});