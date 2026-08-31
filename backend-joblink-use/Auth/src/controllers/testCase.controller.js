import testCaseService from "../services/testCase.service.js";
import problemService from "../services/problem.service.js";

export const createTestCase = async (req, res) => {
    // Problem ID can come from URL params or body
    const problemId = req.params.problemId || req.body.problem;
    const testCaseData = { ...req.body, problem: problemId };
    
    const testCase = await testCaseService.createTestCase(testCaseData, req.user._id);
    
    res.status(201).json({
        success: true,
        message: "Test case created successfully",
        testCase
    });
};

export const getAdminTestCases = async (req, res) => {
    const { problemId } = req.params;
    const testCases = await testCaseService.getTestCasesByProblem(problemId);
    
    res.status(200).json({
        success: true,
        testCases
    });
};

export const getPublicSampleTestCases = async (req, res) => {
    // Note: The prompt says /api/problems/:slug/sample-testcases
    const { slug } = req.params;
    
    // getPublicProblemBySlug throws if not found
    const problem = await problemService.getPublicProblemBySlug(slug);
    
    const testCases = await testCaseService.getPublicTestCases(problem._id);
    
    res.status(200).json({
        success: true,
        testCases
    });
};

export const getTestCaseById = async (req, res) => {
    const { id } = req.params;
    const testCase = await testCaseService.getTestCaseById(id);
    
    res.status(200).json({
        success: true,
        testCase
    });
};

export const updateTestCase = async (req, res) => {
    const { id } = req.params;
    const testCase = await testCaseService.updateTestCase(id, req.body, req.user._id);
    
    res.status(200).json({
        success: true,
        message: "Test case updated successfully",
        testCase
    });
};

export const deleteTestCase = async (req, res) => {
    const { id } = req.params;
    const response = await testCaseService.deleteTestCase(id);
    
    res.status(200).json({
        success: true,
        message: response.message
    });
};
