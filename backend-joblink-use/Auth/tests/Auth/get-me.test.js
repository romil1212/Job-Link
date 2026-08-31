import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import userModel from "../../src/models/user.model.js";

describe("GET /api/auth/get-me", () => {

    it("should return current user with valid access token", async () => {

        const uniqueId = Date.now();

        const userData = {
            fullName: "Get Me Test User",
            username: `getmeuser${uniqueId}`,
            email: `getme${uniqueId}@example.com`,
            password: "Test@12345"
        };

        const user = await userModel.create({
            ...userData,
            verified: true
        });

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: userData.email,
                password: userData.password
            });

        expect(loginResponse.status).toBe(200);

        const accessToken =
            loginResponse.body.accessToken;

        expect(accessToken).toBeDefined();

        const response = await request(app)
            .get("/api/auth/get-me")
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            );

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe("user fetched successfully");

        expect(response.body.user)
            .toBeDefined();

        expect(response.body.user.email)
            .toBe(userData.email);

        expect(response.body.user.username)
            .toBe(userData.username);

        expect(response.body.user.fullName)
            .toBe(userData.fullName);

        expect(response.body.user.verified)
            .toBe(true);
    });


    // ------------------------------------------
    // Missing access token
    // ------------------------------------------

    it("should return 401 when access token is missing", async () => {

        const response = await request(app)
            .get("/api/auth/get-me");

        expect(response.status).toBe(401);

        expect(response.body)
            .toHaveProperty(
                "message",
                "token not found"
            );
    });

});