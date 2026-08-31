import { Router } from "express";
import * as problemController from "../controllers/problem.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
    createProblemValidator,
    updateProblemValidator
} from "../../validators/problem.validator.js";

// Public Router (/api/problems)
export const publicProblemRouter = Router();

publicProblemRouter.get(
    "/",
    asyncHandler(problemController.getPublicProblems)
);

publicProblemRouter.get(
    "/:slug",
    asyncHandler(problemController.getPublicProblemBySlug)
);

// Admin Router (/api/admin/problems)
export const adminProblemRouter = Router();

// Protect all admin problem routes
adminProblemRouter.use(authenticate, authorizeRoles("admin"));

adminProblemRouter.post(
    "/",
    createProblemValidator,
    validate,
    asyncHandler(problemController.createProblem)
);

adminProblemRouter.get(
    "/",
    asyncHandler(problemController.getAllAdminProblems)
);

adminProblemRouter.get(
    "/:id",
    asyncHandler(problemController.getAdminProblemById)
);

adminProblemRouter.put(
    "/:id",
    updateProblemValidator,
    validate,
    asyncHandler(problemController.updateProblem)
);

adminProblemRouter.delete(
    "/:id",
    asyncHandler(problemController.deleteProblem)
);
