import submissionService from "../services/submission.service.js";

export const runCode = async (req, res) => {
    // "Run" only uses public test cases and sets isRun: true
    const submissionData = { ...req.body, isRun: true };
    const submission = await submissionService.createSubmission(submissionData, req.user._id);

    res.status(202).json({
        success: true,
        message: "Code execution queued",
        submissionId: submission._id,
        status: submission.status
    });
};

export const submitCode = async (req, res) => {
    // "Submit" evaluates against all test cases
    const submissionData = { ...req.body, isRun: false };
    const submission = await submissionService.createSubmission(submissionData, req.user._id);

    res.status(202).json({
        success: true,
        message: "Submission queued",
        submissionId: submission._id,
        status: submission.status
    });
};

export const getSubmissionStatus = async (req, res) => {
    const { id } = req.params;
    const submission = await submissionService.getSubmissionById(id, req.user._id);

    res.status(200).json({
        success: true,
        submission
    });
};

export const getMySubmissions = async (req, res) => {
    const { problemId } = req.query;
    const submissions = await submissionService.getUserSubmissions(req.user._id, problemId);

    res.status(200).json({
        success: true,
        submissions
    });
};
