import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import userModel from "../../src/models/user.model.js";

describe("GET /api/auth/logout", () => {

    // ==================================================
    // SUCCESSFUL LOGOUT
    // ==================================================

    it("should logout successfully with valid refresh token", async () => {

        const uniqueId = Date.now();

        const uniqueEmail =
            `logout${uniqueId}@example.com`;

        const uniqueUsername =
            `logoutuser${uniqueId}`;


        // ==============================================
        // CREATE VERIFIED USER
        // ==============================================

        await userModel.create({
            fullName: "Logout Test User",
            username: uniqueUsername,
            email: uniqueEmail,
            password: "Test@12345",
            verified: true
        });


        // ==============================================
        // LOGIN
        // ==============================================

        const loginResponse =
            await request(app)
                .post("/api/auth/login")
                .send({
                    email: uniqueEmail,
                    password: "Test@12345"
                });


        expect(loginResponse.statusCode)
            .toBe(200);


        // ==============================================
        // GET REFRESH TOKEN COOKIE
        // ==============================================

        expect(loginResponse.headers["set-cookie"])
            .toBeDefined();


        const cookies =
            loginResponse.headers["set-cookie"];


        const refreshCookie =
            cookies.find(cookie =>
                cookie.startsWith("refreshToken=")
            );


        expect(refreshCookie)
            .toBeDefined();


        // ==============================================
        // LOGOUT
        // ==============================================

        const logoutResponse =
            await request(app)
                .get("/api/auth/logout")
                .set("Cookie", refreshCookie);


        // ==============================================
        // CHECK STATUS
        // ==============================================

        expect(logoutResponse.statusCode)
            .toBe(200);


        // ==============================================
        // CHECK MESSAGE
        // ==============================================

        expect(logoutResponse.body)
            .toHaveProperty(
                "message",
                "logged out successfully"
            );


        // ==============================================
        // CHECK COOKIE WAS CLEARED
        // ==============================================

        expect(logoutResponse.headers["set-cookie"])
            .toBeDefined();


        const logoutCookies =
            logoutResponse.headers["set-cookie"];


        const clearedRefreshCookie =
            logoutCookies.find(cookie =>
                cookie.startsWith("refreshToken=")
            );


        expect(clearedRefreshCookie)
            .toBeDefined();


        expect(clearedRefreshCookie)
            .toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    });


    // ==================================================
    // MISSING REFRESH TOKEN
    // ==================================================

    it("should return 400 when refresh token is missing", async () => {

        const response =
            await request(app)
                .get("/api/auth/logout");


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "refresh token not found"
            );
    });


    // ==================================================
    // INVALID REFRESH TOKEN
    // ==================================================

    it("should return 400 when refresh token is invalid", async () => {

        const response =
            await request(app)
                .get("/api/auth/logout")
                .set(
                    "Cookie",
                    "refreshToken=invalid-refresh-token"
                );


        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toHaveProperty(
                "message",
                "invalid refresh token"
            );
    });

});