import problemService from "../services/problem.service.js";

/**
 * ======================================================
 * ADMIN PROBLEM CONTROLLER
 * ======================================================
 */

export async function createProblem(req, res) {
    const adminId = req.user._id;
    const problem = await problemService.createProblem(req.body, adminId);

    return res.status(201).json({
        success: true,
        message: "Problem created successfully.",
        problem
    });
}

export async function getAllAdminProblems(req, res) {
    const result = await problemService.getAdminProblems(req.query);

    return res.status(200).json({
        success: true,
        ...result
    });
}

export async function getAdminProblemById(req, res) {
    const { id } = req.params;
    const problem = await problemService.getAdminProblemById(id);

    return res.status(200).json({
        success: true,
        problem
    });
}

export async function updateProblem(req, res) {
    const { id } = req.params;
    const adminId = req.user._id;
    const problem = await problemService.updateProblem(id, req.body, adminId);

    return res.status(200).json({
        success: true,
        message: "Problem updated successfully.",
        problem
    });
}

export async function deleteProblem(req, res) {
    const { id } = req.params;
    const result = await problemService.deleteProblem(id);

    return res.status(200).json({
        success: true,
        message: result.message
    });
}

/**
 * ======================================================
 * PUBLIC PROBLEM CONTROLLER
 * ======================================================
 */

export async function getPublicProblems(req, res) {
    const result = await problemService.getPublicProblems(req.query);

    return res.status(200).json({
        success: true,
        ...result
    });
}

export async function getPublicProblemBySlug(req, res) {
    const { slug } = req.params;
    const problem = await problemService.getPublicProblemBySlug(slug);

    return res.status(200).json({
        success: true,
        problem
    });
}
