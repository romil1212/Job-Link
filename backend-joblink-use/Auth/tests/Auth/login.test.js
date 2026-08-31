import { describe, it, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";

import app from "../../src/app.js";
import User from "../../src/models/user.model.js";

describe("POST /api/auth/login", () => {

    it("should login successfully with valid credentials", async () => {

        const timestamp = Date.now();

        const email =
            `login${timestamp}@example.com`;

        const username =
            `loginuser${timestamp}`;

        const password = "Test@12345";

        // Create verified test user
        await User.create({
            fullName: "Login Test User",
            username,
            email,
            password,
            verified: true
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password
            });

        console.log(response.body);

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.message)
            .toBe("logged in successfully");

        expect(response.body.user)
            .toBeDefined();

        expect(response.body.user.email)
            .toBe(email);

        expect(response.body.user.username)
            .toBe(username);

        expect(response.body.accessToken)
            .toBeDefined();

        expect(typeof response.body.accessToken)
            .toBe("string");
    });


    it("should return 400 for wrong password", async () => {

        const timestamp = Date.now();

        const email =
            `wrongpass${timestamp}@example.com`;

        const username =
            `wrongpassuser${timestamp}`;

        await User.create({
            fullName: "Wrong Password User",
            username,
            email,
            password: "Correct@12345",
            verified: true
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password: "Wrong@12345"
            });

        expect(response.statusCode)
            .toBe(400);

        expect(response.body)
            .toHaveProperty(
                "message",
                "invalid email or password"
            );
    });


    it("should return 400 when user does not exist", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "doesnotexist@example.com",
                password: "Test@12345"
            });

        expect(response.statusCode)
            .toBe(400);

        expect(response.body)
            .toHaveProperty(
                "message",
                "invalid email or password"
            );
    });


    it("should return 400 when email is missing", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                password: "Test@12345"
            });

        expect(response.statusCode)
            .toBe(400);

        expect(response.body)
            .toHaveProperty(
                "message",
                "email is required"
            );
    });


    it("should return 400 when password is missing", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com"
            });

        expect(response.statusCode)
            .toBe(400);

        expect(response.body)
            .toHaveProperty(
                "message",
                "password is required"
            );
    });


    it("should return 400 when email is not verified", async () => {

        const timestamp = Date.now();

        const email =
            `unverified${timestamp}@example.com`;

        const username =
            `unverifieduser${timestamp}`;

        await User.create({
            fullName: "Unverified User",
            username,
            email,
            password: "Test@12345",
            verified: false
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password: "Test@12345"
            });

        expect(response.statusCode)
            .toBe(400);

        expect(response.body)
            .toHaveProperty(
                "message",
                "email not verified"
            );
    });

});