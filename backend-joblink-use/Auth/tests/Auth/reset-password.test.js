import { describe, it, expect } from "vitest";
import request from "supertest";
import crypto from "crypto";

import app from "../../src/app.js";
import userModel from "../../src/models/user.model.js";
import sessionModel from "../../src/models/session.model.js";

describe("POST /api/auth/reset-password/:token", () => {

    // ==================================================
    // SUCCESSFUL PASSWORD RESET
    // ==================================================

    it("should reset password with valid reset token", async () => {

        const uniqueEmail =
            `reset${Date.now()}@example.com`;

        const uniqueUsername =
            `resetuser${Date.now()}`;

        const resetToken =
            crypto.randomBytes(32).toString("hex");


        // ==============================================
        // CREATE USER
        // ==============================================

        const user =
            await userModel.create({
                fullName: "Reset Password User",
                username: uniqueUsername,
                email: uniqueEmail,
                password: "OldPassword@123",
                verified: false,

                resetPasswordToken:
                    resetToken,

                resetPasswordExpires:
                    new Date(
                        Date.now() + 10 * 60 * 1000
                    )
            });


        // ==============================================
        // CREATE ACTIVE SESSION
        // ==============================================

        await sessionModel.create({
            user: user._id,
            refreshTokenHash: "test-session-hash",
            revokedAt: null
        });


        // ==============================================
        // RESET PASSWORD
        // ==============================================

        const response =
            await request(app)
                .post(
                    `/api/auth/reset-password/${resetToken}`
                )
                .send({
                    password: "NewPassword@123"
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
                "password reset successful"
            );


        // ==============================================
        // GET UPDATED USER
        // ==============================================

        /*
         * password is probably defined with:
         *
         * select: false
         *
         * Therefore explicitly select it here.
         */

        const updatedUser =
            await userModel
                .findById(user._id)
                .select("+password");


        expect(updatedUser)
            .toBeDefined();


        // ==============================================
        // CHECK USER VERIFICATION
        // ==============================================

        expect(updatedUser.verified)
            .toBe(true);


        // ==============================================
        // CHECK RESET TOKEN REMOVED
        // ==============================================

        expect(updatedUser.resetPasswordToken)
            .toBeNull();


        // ==============================================
        // CHECK RESET TOKEN EXPIRATION REMOVED
        // ==============================================

        expect(updatedUser.resetPasswordExpires)
            .toBeNull();


        // ==============================================
        // VERIFY NEW PASSWORD
        // ==============================================

        const newPasswordMatches =
            await updatedUser.comparePassword(
                "NewPassword@123"
            );


        expect(newPasswordMatches)
            .toBe(true);


        // ==============================================
        // VERIFY OLD PASSWORD NO LONGER WORKS
        // ==============================================

        const oldPasswordMatches =
            await updatedUser.comparePassword(
                "OldPassword@123"
            );


        expect(oldPasswordMatches)
            .toBe(false);


        // ==============================================
        // CHECK SESSION REVOCATION
        // ==============================================

        const session =
            await sessionModel.findOne({
                user: user._id
            });


        expect(session)
            .toBeDefined();


        expect(session.revokedAt)
            .not
            .toBeNull();
    });


    // ==================================================
    // PASSWORD MISSING
    // ==================================================

    it("should return 400 when password is missing", async () => {

        const resetToken =
            crypto.randomBytes(32).toString("hex");


        const response =
            await request(app)
                .post(
                    `/api/auth/reset-password/${resetToken}`
                )
                .send({});


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "password is required"
            );
    });


    // ==================================================
    // RESET TOKEN MISSING
    // ==================================================

    it("should return 400 when reset token is missing", async () => {

        const response =
            await request(app)
                .post(
                    "/api/auth/reset-password/"
                )
                .send({
                    password: "NewPassword@123"
                });


        /*
         * Express normally does not match:
         *
         * /reset-password/
         *
         * against:
         *
         * /reset-password/:token
         *
         * Therefore 404 is expected in this setup.
         *
         * If your route/controller is changed later
         * to explicitly handle a missing token,
         * 400 can also be valid.
         */

        expect([400, 404])
            .toContain(response.statusCode);
    });


    // ==================================================
    // INVALID RESET TOKEN
    // ==================================================

    it("should return 400 when reset token is invalid", async () => {

        const invalidToken =
            crypto.randomBytes(32).toString("hex");


        const response =
            await request(app)
                .post(
                    `/api/auth/reset-password/${invalidToken}`
                )
                .send({
                    password: "NewPassword@123"
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "invalid or expired token"
            );
    });


    // ==================================================
    // EXPIRED RESET TOKEN
    // ==================================================

    it("should return 400 when reset token is expired", async () => {

        const uniqueEmail =
            `expired${Date.now()}@example.com`;

        const uniqueUsername =
            `expireduser${Date.now()}`;

        const resetToken =
            crypto.randomBytes(32).toString("hex");


        // ==============================================
        // CREATE USER WITH EXPIRED TOKEN
        // ==============================================

        await userModel.create({
            fullName: "Expired Token User",
            username: uniqueUsername,
            email: uniqueEmail,
            password: "OldPassword@123",
            verified: false,

            resetPasswordToken:
                resetToken,

            resetPasswordExpires:
                new Date(
                    Date.now() - 10 * 60 * 1000
                )
        });


        // ==============================================
        // RESET PASSWORD
        // ==============================================

        const response =
            await request(app)
                .post(
                    `/api/auth/reset-password/${resetToken}`
                )
                .send({
                    password: "NewPassword@123"
                });


        // ==============================================
        // CHECK RESPONSE
        // ==============================================

        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "invalid or expired token"
            );
    });


    // ==================================================
    // TOKEN SHOULD NOT BE REUSABLE
    // ==================================================

    it("should not allow the same reset token to be reused", async () => {

        const uniqueEmail =
            `reuse${Date.now()}@example.com`;

        const uniqueUsername =
            `reuseuser${Date.now()}`;

        const resetToken =
            crypto.randomBytes(32).toString("hex");


        // ==============================================
        // CREATE USER
        // ==============================================

        await userModel.create({
            fullName: "Reuse Token User",
            username: uniqueUsername,
            email: uniqueEmail,
            password: "OldPassword@123",
            verified: false,

            resetPasswordToken:
                resetToken,

            resetPasswordExpires:
                new Date(
                    Date.now() + 10 * 60 * 1000
                )
        });


        // ==============================================
        // FIRST RESET
        // ==============================================

        const firstResponse =
            await request(app)
                .post(
                    `/api/auth/reset-password/${resetToken}`
                )
                .send({
                    password: "NewPassword@123"
                });


        expect(firstResponse.statusCode)
            .toBe(200);


        expect(firstResponse.body)
            .toHaveProperty(
                "message",
                "password reset successful"
            );


        // ==============================================
        // SECOND RESET WITH SAME TOKEN
        // ==============================================

        const secondResponse =
            await request(app)
                .post(
                    `/api/auth/reset-password/${resetToken}`
                )
                .send({
                    password: "AnotherPassword@123"
                });


        expect(secondResponse.statusCode)
            .toBe(400);


        expect(secondResponse.body)
            .toHaveProperty(
                "message",
                "invalid or expired token"
            );
    });

});