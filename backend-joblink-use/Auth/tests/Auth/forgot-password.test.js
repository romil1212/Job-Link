import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import userModel from "../../src/models/user.model.js";

describe("POST /api/auth/forgot-password", () => {

    // ==================================================
    // SUCCESSFUL FORGOT PASSWORD
    // ==================================================

    it("should send reset link for existing user", async () => {

        const uniqueEmail =
            `forgot${Date.now()}@example.com`;

        const uniqueUsername =
            `forgotuser${Date.now()}`;


        // ==============================================
        // CREATE USER
        // ==============================================

        await userModel.create({
            fullName: "Forgot Password User",
            username: uniqueUsername,
            email: uniqueEmail,
            password: "Test@12345",
            verified: true
        });


        // ==============================================
        // FORGOT PASSWORD REQUEST
        // ==============================================

        const response =
            await request(app)
                .post("/api/auth/forgot-password")
                .send({
                    email: uniqueEmail
                });


        console.log(response.body);


        // ==============================================
        // CHECK STATUS
        // ==============================================

        expect(response.statusCode)
            .toBe(200);


        // ==============================================
        // CHECK MESSAGE
        // ==============================================

        expect(response.body)
            .toHaveProperty(
                "message",
                "reset link sent to email"
            );


        // ==============================================
        // CHECK RESET TOKEN IN DATABASE
        // ==============================================

        const user =
            await userModel.findOne({
                email: uniqueEmail
            });


        expect(user.resetPasswordToken)
            .toBeDefined();


        expect(
            typeof user.resetPasswordToken
        ).toBe("string");


        expect(
            user.resetPasswordToken.length
        ).toBe(64);


        // ==============================================
        // CHECK RESET TOKEN EXPIRATION
        // ==============================================

        expect(user.resetPasswordExpires)
            .toBeDefined();


        expect(
            user.resetPasswordExpires
        ).toBeInstanceOf(Date);


        expect(
            user.resetPasswordExpires.getTime()
        ).toBeGreaterThan(Date.now());
    });


    // ==================================================
    // MISSING EMAIL
    // ==================================================

    it("should return 400 when email is missing", async () => {

        const response =
            await request(app)
                .post("/api/auth/forgot-password")
                .send({});


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "email is required"
            );
    });


    // ==================================================
    // USER DOES NOT EXIST
    // ==================================================

    it("should return 400 when user does not exist", async () => {

        const uniqueEmail =
            `nonexistent${Date.now()}@example.com`;


        const response =
            await request(app)
                .post("/api/auth/forgot-password")
                .send({
                    email: uniqueEmail
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "user not found"
            );
    });


    // ==================================================
    // EMAIL NORMALIZATION
    // ==================================================

    it("should handle email normalization", async () => {

        const uniqueEmail =
            `normalize${Date.now()}@example.com`;

        const uniqueUsername =
            `normalizeuser${Date.now()}`;


        // ==============================================
        // CREATE USER WITH NORMALIZED EMAIL
        // ==============================================

        await userModel.create({
            fullName: "Normalize Test User",
            username: uniqueUsername,
            email: uniqueEmail,
            password: "Test@12345",
            verified: true
        });


        // ==============================================
        // SEND EMAIL WITH UPPERCASE
        // ==============================================

        const response =
            await request(app)
                .post("/api/auth/forgot-password")
                .send({
                    email: uniqueEmail.toUpperCase()
                });


        // ==============================================
        // CHECK SUCCESS
        // ==============================================

        expect(response.statusCode)
            .toBe(200);


        expect(response.body)
            .toHaveProperty(
                "message",
                "reset link sent to email"
            );
    });

});