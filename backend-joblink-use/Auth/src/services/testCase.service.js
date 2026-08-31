import mongoose from "mongoose";
import TestCase from "../models/testCase.model.js";
import Problem from "../models/problem.model.js";
import AppError from "../utils/AppError.js";

class TestCaseService {
    /**
     * Create a new test case (Admin only)
     */
    async createTestCase(testCaseData, adminId) {
        const {
            problem,
            input,
            expectedOutput,
            isHidden,
            order,
            explanation
        } = testCaseData;

        // Verify that the referenced Problem exists
        if (!mongoose.Types.ObjectId.isValid(problem)) {
            throw new AppError("Invalid problem ID format.", 400);
        }

        const existingProblem = await Problem.findById(problem);
        if (!existingProblem) {
            throw new AppError("Problem not found.", 404);
        }

        const newTestCase = await TestCase.create({
            problem,
            input,
            expectedOutput,
            isHidden: isHidden !== undefined ? isHidden : false,
            order: order !== undefined ? order : 0,
            explanation: explanation || "",
            createdBy: adminId
        });

        return newTestCase;
    }

    /**
     * Get all test cases for a specific problem (Admin only)
     */
    async getTestCasesByProblem(problemId) {
        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            throw new AppError("Invalid problem ID format.", 400);
        }

        const existingProblem = await Problem.findById(problemId);
        if (!existingProblem) {
            throw new AppError("Problem not found.", 404);
        }

        const testCases = await TestCase.find({ problem: problemId })
            .populate("createdBy", "username email fullName")
            .populate("updatedBy", "username email fullName")
            .sort({ order: 1, createdAt: 1 })
            .lean();

        return testCases;
    }

    /**
     * Get public sample test cases for a specific problem (Public API)
     * NEVER exposes hidden test cases or admin metadata.
     */
    async getPublicTestCases(problemId) {
        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            throw new AppError("Invalid problem ID format.", 400);
        }

        const existingProblem = await Problem.findById(problemId);
        if (!existingProblem) {
            throw new AppError("Problem not found.", 404);
        }

        const projection = {
            input: 1,
            expectedOutput: 1,
            explanation: 1,
            order: 1
        };

        const testCases = await TestCase.find(
            { problem: problemId, isHidden: false },
            projection
        )
            .sort({ order: 1, _id: 1 })
            .lean();

        return testCases;
    }

    /**
     * Get a specific test case by ID (Admin only)
     */
    async getTestCaseById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid test case ID format.", 400);
        }

        const testCase = await TestCase.findById(id)
            .populate("createdBy", "username email fullName")
            .populate("updatedBy", "username email fullName");

        if (!testCase) {
            throw new AppError("Test case not found.", 404);
        }

        return testCase;
    }

    /**
     * Update a test case (Admin only)
     */
    async updateTestCase(id, updateData, adminId) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid test case ID format.", 400);
        }

        const testCase = await TestCase.findById(id);
        if (!testCase) {
            throw new AppError("Test case not found.", 404);
        }

        if (updateData.input !== undefined) testCase.input = updateData.input;
        if (updateData.expectedOutput !== undefined) testCase.expectedOutput = updateData.expectedOutput;
        if (updateData.isHidden !== undefined) testCase.isHidden = updateData.isHidden;
        if (updateData.order !== undefined) testCase.order = updateData.order;
        if (updateData.explanation !== undefined) testCase.explanation = updateData.explanation;

        testCase.updatedBy = adminId;

        await testCase.save();
        return testCase;
    }

    /**
     * Delete a test case (Admin only)
     */
    async deleteTestCase(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid test case ID format.", 400);
        }

        const testCase = await TestCase.findByIdAndDelete(id);
        if (!testCase) {
            throw new AppError("Test case not found.", 404);
        }

        return { message: "Test case deleted successfully." };
    }
}

export default new TestCaseService();
