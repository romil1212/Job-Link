import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import userModel from "../../src/models/user.model.js";


describe("GET /api/auth/refresh-token", () => {

    // ==================================================
    // SUCCESSFUL REFRESH
    // ==================================================

    it("should refresh access token with valid refresh token", async () => {

        const uniqueEmail =
            `refresh${Date.now()}@example.com`;

        const uniqueUsername =
            `refreshuser${Date.now()}`;


        // ==============================================
        // CREATE VERIFIED USER
        // ==============================================

        await userModel.create({
            fullName: "Refresh Test User",
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


        expect(loginResponse.body.accessToken)
            .toBeDefined();


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
        // REFRESH ACCESS TOKEN
        // ==============================================

        const refreshResponse =
            await request(app)
                .get("/api/auth/refresh-token")
                .set("Cookie", refreshCookie);


        console.log(refreshResponse.body);


        // ==============================================
        // CHECK STATUS
        // ==============================================

        expect(refreshResponse.statusCode)
            .toBe(200);


        // ==============================================
        // CHECK MESSAGE
        // ==============================================

        expect(refreshResponse.body.message)
            .toBe(
                "access token refreshed successfully"
            );


        // ==============================================
        // CHECK NEW ACCESS TOKEN
        // ==============================================

        expect(refreshResponse.body.accessToken)
            .toBeDefined();


        expect(
            typeof refreshResponse.body.accessToken
        ).toBe("string");


        // ==============================================
        // CHECK NEW REFRESH TOKEN COOKIE
        // ==============================================

        expect(
            refreshResponse.headers["set-cookie"]
        ).toBeDefined();


        const newCookies =
            refreshResponse.headers["set-cookie"];


        const newRefreshCookie =
            newCookies.find(cookie =>
                cookie.startsWith("refreshToken=")
            );


        expect(newRefreshCookie)
            .toBeDefined();
    });


    // ==================================================
    // MISSING REFRESH TOKEN
    // ==================================================

    it("should return 401 when refresh token is missing", async () => {

        const response =
            await request(app)
                .get("/api/auth/refresh-token");


        expect(response.statusCode)
            .toBe(401);


        expect(response.body)
            .toHaveProperty(
                "message",
                "refresh token not found"
            );
    });


    // ==================================================
    // INVALID REFRESH TOKEN
    // ==================================================

    it("should return 401 when refresh token is invalid", async () => {

        const response =
            await request(app)
                .get("/api/auth/refresh-token")
                .set(
                    "Cookie",
                    "refreshToken=invalid-refresh-token"
                );


        expect(response.statusCode)
            .toBe(401);
    });

});