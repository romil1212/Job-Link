import { Router } from "express";
import * as submissionController from "../controllers/submission.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import validate from "../middlewares/validate.middleware.js";
import rateLimit from "express-rate-limit";

export const submissionRouter = Router();

const submissionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 submissions per windowMs
    message: { success: false, message: "Too many submissions, please try again later." }
});

// Protect all submission routes
submissionRouter.use(authenticate);

const submissionValidator = [
    body("problemId")
        .notEmpty().withMessage("problemId is required")
        .isMongoId().withMessage("Invalid problemId format"),
    body("language")
        .notEmpty().withMessage("language is required")
        .isString(),
    body("sourceCode")
        .notEmpty().withMessage("sourceCode is required")
        .isString()
        .isLength({ max: 102400 }).withMessage("Source code exceeds maximum allowed size of 100KB")
];

submissionRouter.post(
    "/run",
    submissionLimiter,
    submissionValidator,
    validate,
    asyncHandler(submissionController.runCode)
);

submissionRouter.post(
    "/",
    submissionLimiter,
    submissionValidator,
    validate,
    asyncHandler(submissionController.submitCode)
);

submissionRouter.get(
    "/my",
    asyncHandler(submissionController.getMySubmissions)
);

submissionRouter.get(
    "/:id",
    asyncHandler(submissionController.getSubmissionStatus)
);
