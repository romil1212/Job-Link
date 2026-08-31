import mongoose from "mongoose";
import Submission from "../models/submission.model.js";
import Problem from "../models/problem.model.js";
import AppError from "../utils/AppError.js";
import { submissionQueue } from "../queue/submissionQueue.js";

class SubmissionService {
    /**
     * Create a submission and queue it for execution
     */
    async createSubmission(submissionData, userId) {
        const { problemId, language, sourceCode, isRun } = submissionData;

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            throw new AppError("Invalid problem ID format.", 400);
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            throw new AppError("Problem not found.", 404);
        }

        // Validate language
        if (!problem.supportedLanguages.includes(language.toLowerCase())) {
            throw new AppError(`Language '${language}' is not supported for this problem.`, 400);
        }

        // Create the submission record in DB
        const submission = await Submission.create({
            user: userId,
            problem: problemId,
            language: language.toLowerCase(),
            sourceCode,
            isRun: isRun || false,
            status: "QUEUED",
            verdict: "PENDING"
        });

        // Add to Redis Queue
        await submissionQueue.add("executeCode", {
            submissionId: submission._id,
            problemId: problem._id,
            language: submission.language,
            sourceCode: submission.sourceCode,
            isRun: submission.isRun,
            timeLimit: problem.timeLimit,
            memoryLimit: problem.memoryLimit
        });

        return submission;
    }

    /**
     * Get a submission by ID
     */
    async getSubmissionById(id, userId) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid submission ID format.", 400);
        }

        const submission = await Submission.findById(id).lean();

        if (!submission) {
            throw new AppError("Submission not found.", 404);
        }

        // Check ownership (only the creator can view their submission, or an admin could but for now restrict to creator)
        if (submission.user.toString() !== userId.toString()) {
            throw new AppError("Unauthorized to view this submission.", 403);
        }

        return submission;
    }

    /**
     * Get all submissions for a user (optionally filtered by problem)
     */
    async getUserSubmissions(userId, problemId = null) {
        const filter = { user: userId, isRun: false }; // Usually don't list 'run' attempts in history
        
        if (problemId) {
            if (!mongoose.Types.ObjectId.isValid(problemId)) {
                throw new AppError("Invalid problem ID format.", 400);
            }
            filter.problem = problemId;
        }

        const submissions = await Submission.find(filter)
            .sort({ createdAt: -1 })
            .populate("problem", "title slug difficulty")
            .lean();

        return submissions;
    }
}

export default new SubmissionService();
