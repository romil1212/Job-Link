import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Application Test", () => {
    it("should return 404 for an unknown route", async () => {
        const response = await request(app)
            .get("/test-route-that-does-not-exist");

        expect(response.status).toBe(404);
    });
});