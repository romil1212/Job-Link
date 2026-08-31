import { Router } from "express";
import * as testCaseController from "../controllers/testCase.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
    createTestCaseValidator,
    updateTestCaseValidator
} from "../validators/testCase.validator.js";

// Public Router (Mounted on /api/problems)
// e.g., GET /api/problems/:slug/sample-testcases
export const publicTestCaseRouter = Router({ mergeParams: true });

publicTestCaseRouter.get(
    "/:slug/sample-testcases",
    asyncHandler(testCaseController.getPublicSampleTestCases)
);

// Admin Router (Mounted on /api/admin)
// e.g., POST /api/admin/problems/:problemId/test-cases
// e.g., GET /api/admin/problems/:problemId/test-cases
export const adminTestCaseRouter = Router({ mergeParams: true });

adminTestCaseRouter.use(authenticate, authorizeRoles("admin"));

// Problem-specific routes
adminTestCaseRouter.post(
    "/problems/:problemId/test-cases",
    createTestCaseValidator,
    validate,
    asyncHandler(testCaseController.createTestCase)
);

adminTestCaseRouter.get(
    "/problems/:problemId/test-cases",
    asyncHandler(testCaseController.getAdminTestCases)
);

// General test-case routes (by ID)
// e.g., /api/admin/test-cases/:id
export const adminTestCaseIdRouter = Router();
adminTestCaseIdRouter.use(authenticate, authorizeRoles("admin"));

adminTestCaseIdRouter.get(
    "/:id",
    asyncHandler(testCaseController.getTestCaseById)
);

adminTestCaseIdRouter.put(
    "/:id",
    updateTestCaseValidator,
    validate,
    asyncHandler(testCaseController.updateTestCase)
);

adminTestCaseIdRouter.delete(
    "/:id",
    asyncHandler(testCaseController.deleteTestCase)
);
