import { describe, it, expect } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import crypto from "crypto";

import app from "../../src/app.js";
import userModel from "../../src/models/user.model.js";
import OTPModel from "../../src/models/otp.model.js";


// ==================================================
// SAME HASHING LOGIC USED BY CONTROLLER
// ==================================================

const hashValue = (value) => {
    return crypto
        .createHash("sha256")
        .update(String(value))
        .digest("hex");
};


describe("POST /api/auth/verify-email", () => {

    // ==================================================
    // SUCCESSFUL EMAIL VERIFICATION
    // ==================================================

    it("should verify email with valid OTP", async () => {

        const timestamp = Date.now();

        const email =
            `verify${timestamp}@example.com`;

        const username =
            `verifyuser${timestamp}`;


        // ==============================================
        // CREATE UNVERIFIED USER
        // ==============================================

        const user =
            await userModel.create({
                fullName: "Verify Test User",
                username,
                email,
                password: "Test@12345",
                verified: false
            });


        // ==============================================
        // CREATE OTP
        // ==============================================

        const otp = "123456";

        await OTPModel.create({
            email,
            user: user._id,
            otpHash: hashValue(otp),
            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            ),
            attempts: 0,
            maxAttempts: 5
        });


        // ==============================================
        // VERIFY EMAIL
        // ==============================================

        const response =
            await request(app)
                .post("/api/auth/verify-email")
                .send({
                    email,
                    otp
                });


        // ==============================================
        // STATUS
        // ==============================================

        expect(response.statusCode)
            .toBe(200);


        // ==============================================
        // MESSAGE
        // ==============================================

        expect(response.body.message)
            .toBe(
                "email verified successfully"
            );


        // ==============================================
        // USER RESPONSE
        // ==============================================

        expect(response.body.user)
            .toBeDefined();

        expect(response.body.user.email)
            .toBe(email);

        expect(response.body.user.username)
            .toBe(username);

        expect(response.body.user.verified)
            .toBe(true);


        // ==============================================
        // CHECK DATABASE
        // ==============================================

        const updatedUser =
            await userModel.findById(user._id);

        expect(updatedUser)
            .toBeDefined();

        expect(updatedUser.verified)
            .toBe(true);


        // ==============================================
        // OTP SHOULD BE DELETED
        // ==============================================

        const otpDoc =
            await OTPModel.findOne({
                email
            });

        expect(otpDoc)
            .toBeNull();
    });


    // ==================================================
    // MISSING EMAIL
    // ==================================================

    it("should return 400 when email is missing", async () => {

        const response =
            await request(app)
                .post("/api/auth/verify-email")
                .send({
                    otp: "123456"
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "email is required"
            );
    });


    // ==================================================
    // MISSING OTP
    // ==================================================

    it("should return 400 when OTP is missing", async () => {

        const response =
            await request(app)
                .post("/api/auth/verify-email")
                .send({
                    email: "test@example.com"
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "otp is required"
            );
    });


    // ==================================================
    // OTP NOT FOUND
    // ==================================================

    it("should return 400 when OTP does not exist", async () => {

        const timestamp = Date.now();

        const email =
            `notfound${timestamp}@example.com`;


        const response =
            await request(app)
                .post("/api/auth/verify-email")
                .send({
                    email,
                    otp: "123456"
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "OTP not found or expired"
            );
    });


    // ==================================================
    // EXPIRED OTP
    // ==================================================

    it("should return 400 when OTP is expired", async () => {

        const timestamp = Date.now();

        const email =
            `expired${timestamp}@example.com`;

        const username =
            `expireduser${timestamp}`;


        const user =
            await userModel.create({
                fullName: "Expired OTP User",
                username,
                email,
                password: "Test@12345",
                verified: false
            });


        const otp = "123456";


        await OTPModel.create({
            email,
            user: user._id,
            otpHash: hashValue(otp),
            expiresAt: new Date(
                Date.now() - 60 * 1000
            ),
            attempts: 0,
            maxAttempts: 5
        });


        const response =
            await request(app)
                .post("/api/auth/verify-email")
                .send({
                    email,
                    otp
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "OTP expired"
            );


        // OTP should be deleted

        const otpDoc =
            await OTPModel.findOne({
                email
            });

        expect(otpDoc)
            .toBeNull();
    });


    // ==================================================
    // INVALID OTP
    // ==================================================

    it("should return 400 when OTP is invalid", async () => {

        const timestamp = Date.now();

        const email =
            `invalid${timestamp}@example.com`;

        const username =
            `invaliduser${timestamp}`;


        const user =
            await userModel.create({
                fullName: "Invalid OTP User",
                username,
                email,
                password: "Test@12345",
                verified: false
            });


        const correctOtp = "123456";


        await OTPModel.create({
            email,
            user: user._id,
            otpHash: hashValue(correctOtp),
            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            ),
            attempts: 0,
            maxAttempts: 5
        });


        const response =
            await request(app)
                .post("/api/auth/verify-email")
                .send({
                    email,
                    otp: "999999"
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body.message)
            .toBe(
                "invalid OTP. 4 attempts remaining"
            );


        // ==============================================
        // CHECK ATTEMPT COUNT
        // ==============================================

        const otpDoc =
            await OTPModel.findOne({
                email
            });


        expect(otpDoc)
            .toBeDefined();

        expect(otpDoc.attempts)
            .toBe(1);
    });


    // ==================================================
    // MAXIMUM OTP ATTEMPTS
    // ==================================================

    it("should return 400 when maximum OTP attempts are exceeded", async () => {

        const timestamp = Date.now();

        const email =
            `maxattempts${timestamp}@example.com`;

        const username =
            `maxattemptsuser${timestamp}`;


        const user =
            await userModel.create({
                fullName: "Max Attempts User",
                username,
                email,
                password: "Test@12345",
                verified: false
            });


        const correctOtp = "123456";


        await OTPModel.create({
            email,
            user: user._id,
            otpHash: hashValue(correctOtp),
            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            ),
            attempts: 4,
            maxAttempts: 5
        });


        const response =
            await request(app)
                .post("/api/auth/verify-email")
                .send({
                    email,
                    otp: "999999"
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "maximum OTP attempts exceeded"
            );


        // ==============================================
        // OTP SHOULD BE DELETED
        // ==============================================

        const otpDoc =
            await OTPModel.findOne({
                email
            });


        expect(otpDoc)
            .toBeNull();
    });


    // ==================================================
    // ALREADY MAXIMUM ATTEMPTS
    // ==================================================

    it("should return 400 when OTP already reached maximum attempts", async () => {

        const timestamp = Date.now();

        const email =
            `alreadymax${timestamp}@example.com`;

        const username =
            `alreadymaxuser${timestamp}`;


        const user =
            await userModel.create({
                fullName: "Already Max User",
                username,
                email,
                password: "Test@12345",
                verified: false
            });


        await OTPModel.create({
            email,
            user: user._id,
            otpHash: hashValue("123456"),
            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            ),
            attempts: 5,
            maxAttempts: 5
        });


        const response =
            await request(app)
                .post("/api/auth/verify-email")
                .send({
                    email,
                    otp: "123456"
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "maximum OTP attempts exceeded"
            );


        // OTP should be deleted

        const otpDoc =
            await OTPModel.findOne({
                email
            });


        expect(otpDoc)
            .toBeNull();
    });


    // ==================================================
    // USER NOT FOUND
    // ==================================================

    it("should return 404 when OTP exists but user does not exist", async () => {

        const timestamp = Date.now();

        const email =
            `nouser${timestamp}@example.com`;


        const fakeUserId =
            new mongoose.Types.ObjectId();


        await OTPModel.create({
            email,
            user: fakeUserId,
            otpHash: hashValue("123456"),
            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            ),
            attempts: 0,
            maxAttempts: 5
        });


        const response =
            await request(app)
                .post("/api/auth/verify-email")
                .send({
                    email,
                    otp: "123456"
                });


        expect(response.statusCode)
            .toBe(404);


        expect(response.body)
            .toHaveProperty(
                "message",
                "user not found"
            );
    });

});