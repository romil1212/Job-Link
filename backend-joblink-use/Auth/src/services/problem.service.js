import mongoose from "mongoose";
import Problem from "../models/problem.model.js";
import TestCase from "../models/testCase.model.js";
import AppError from "../utils/AppError.js";

// Helper function to create URL-safe lowercase slug
export const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // remove non-word chars
        .replace(/[\s_-]+/g, "-") // replace spaces and underscores with a single hyphen
        .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens
};

class ProblemService {
    /**
     * Create a new problem (Admin only)
     */
    async createProblem(problemData, adminId) {
        const {
            title,
            slug: customSlug,
            description,
            difficulty,
            tags,
            category,
            constraints,
            examples,
            hints,
            starterCode,
            supportedLanguages,
            timeLimit,
            memoryLimit,
            isPublished
        } = problemData;

        // Generate slug from title if not provided or format custom slug
        const slug = customSlug ? generateSlug(customSlug) : generateSlug(title);

        if (!slug) {
            throw new AppError("Invalid title or slug provided.", 400);
        }

        // Check if slug already exists
        const existingProblem = await Problem.findOne({ slug });
        if (existingProblem) {
            throw new AppError(`A problem with slug '${slug}' already exists.`, 409);
        }

        try {
            const problem = await Problem.create({
                title: title.trim(),
                slug,
                description,
                difficulty: difficulty.toLowerCase(),
                tags: tags ? tags.map((t) => t.trim().toLowerCase()) : [],
                category: category.trim(),
                constraints: constraints || [],
                examples: examples || [],
                hints: hints || [],
                starterCode: starterCode || [],
                supportedLanguages: supportedLanguages || ["javascript", "python", "cpp", "java"],
                timeLimit: timeLimit !== undefined ? timeLimit : 2000,
                memoryLimit: memoryLimit !== undefined ? memoryLimit : 256,
                isPublished: isPublished !== undefined ? isPublished : true,
                createdBy: adminId
            });

            return problem;
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError(`A problem with slug '${slug}' already exists.`, 409);
            }
            throw error;
        }
    }

    /**
     * Get all problems for Admin (includes draft/unpublished and full metadata)
     */
    async getAdminProblems(query = {}) {
        const {
            search,
            difficulty,
            category,
            tag,
            isPublished,
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc"
        } = query;

        const filter = {};

        if (difficulty) {
            filter.difficulty = difficulty.toLowerCase();
        }

        if (category) {
            filter.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
        }

        if (tag) {
            filter.tags = tag.toLowerCase().trim();
        }

        if (isPublished !== undefined) {
            filter.isPublished = isPublished === "true" || isPublished === true;
        }

        if (search) {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { title: searchRegex },
                { category: searchRegex },
                { tags: searchRegex }
            ];
        }

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
        const skip = (pageNumber - 1) * limitNumber;

        const sortOrder = order === "asc" ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const [problems, total] = await Promise.all([
            Problem.find(filter)
                .populate("createdBy", "username email fullName")
                .populate("updatedBy", "username email fullName")
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            Problem.countDocuments(filter)
        ]);

        return {
            problems,
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            limit: limitNumber
        };
    }

    /**
     * Get problem by ID for Admin
     */
    async getAdminProblemById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid problem ID format.", 400);
        }

        const problem = await Problem.findById(id)
            .populate("createdBy", "username email fullName")
            .populate("updatedBy", "username email fullName");

        if (!problem) {
            throw new AppError("Problem not found.", 404);
        }

        return problem;
    }

    /**
     * Update problem (Admin only)
     */
    async updateProblem(id, updateData, adminId) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid problem ID format.", 400);
        }

        const problem = await Problem.findById(id);
        if (!problem) {
            throw new AppError("Problem not found.", 404);
        }

        // If slug is being updated, verify uniqueness
        if (updateData.slug) {
            const newSlug = generateSlug(updateData.slug);
            if (newSlug !== problem.slug) {
                const slugExists = await Problem.findOne({ slug: newSlug });
                if (slugExists) {
                    throw new AppError(`A problem with slug '${newSlug}' already exists.`, 409);
                }
                problem.slug = newSlug;
            }
        } else if (updateData.title && !updateData.slug && !problem.slug) {
            problem.slug = generateSlug(updateData.title);
        }

        if (updateData.title !== undefined) problem.title = updateData.title.trim();
        if (updateData.description !== undefined) problem.description = updateData.description;
        if (updateData.difficulty !== undefined) problem.difficulty = updateData.difficulty.toLowerCase();
        if (updateData.category !== undefined) problem.category = updateData.category.trim();
        if (updateData.tags !== undefined) problem.tags = updateData.tags.map((t) => t.trim().toLowerCase());
        if (updateData.constraints !== undefined) problem.constraints = updateData.constraints;
        if (updateData.examples !== undefined) problem.examples = updateData.examples;
        if (updateData.hints !== undefined) problem.hints = updateData.hints;
        if (updateData.starterCode !== undefined) problem.starterCode = updateData.starterCode;
        if (updateData.supportedLanguages !== undefined) problem.supportedLanguages = updateData.supportedLanguages;
        if (updateData.timeLimit !== undefined) problem.timeLimit = updateData.timeLimit;
        if (updateData.memoryLimit !== undefined) problem.memoryLimit = updateData.memoryLimit;
        if (updateData.isPublished !== undefined) problem.isPublished = updateData.isPublished;

        problem.updatedBy = adminId;

        try {
            await problem.save();
            return problem;
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError("Duplicate slug or key detected.", 409);
            }
            throw error;
        }
    }

    /**
     * Delete a problem (Admin only)
     */
    async deleteProblem(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid problem ID format.", 400);
        }

        const problem = await Problem.findByIdAndDelete(id);
        if (!problem) {
            throw new AppError("Problem not found.", 404);
        }

        // Cascade delete associated test cases
        await TestCase.deleteMany({ problem: id });

        return { message: "Problem deleted successfully." };
    }

    /**
     * Get published problems catalog for public users
     */
    async getPublicProblems(query = {}) {
        const {
            search,
            difficulty,
            category,
            tag,
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc"
        } = query;

        const filter = { isPublished: true };

        if (difficulty) {
            filter.difficulty = difficulty.toLowerCase();
        }

        if (category) {
            filter.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
        }

        if (tag) {
            filter.tags = tag.toLowerCase().trim();
        }

        if (search) {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { title: searchRegex },
                { category: searchRegex },
                { tags: searchRegex }
            ];
        }

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));
        const skip = (pageNumber - 1) * limitNumber;

        const sortOrder = order === "asc" ? 1 : -1;
        const allowedSortFields = ["createdAt", "difficulty", "title"];
        const actualSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
        const sortOptions = { [actualSortBy]: sortOrder };

        // Exclude internal admin fields
        const projection = {
            title: 1,
            slug: 1,
            difficulty: 1,
            tags: 1,
            category: 1,
            createdAt: 1
        };

        const [problems, total] = await Promise.all([
            Problem.find(filter, projection)
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            Problem.countDocuments(filter)
        ]);

        return {
            problems,
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            limit: limitNumber
        };
    }

    /**
     * Get problem details by slug for public users
     */
    async getPublicProblemBySlug(slug) {
        if (!slug) {
            throw new AppError("Problem slug is required.", 400);
        }

        const problem = await Problem.findOne(
            { slug: slug.toLowerCase(), isPublished: true },
            {
                title: 1,
                slug: 1,
                description: 1,
                difficulty: 1,
                tags: 1,
                category: 1,
                constraints: 1,
                examples: 1,
                hints: 1,
                starterCode: 1,
                supportedLanguages: 1,
                timeLimit: 1,
                memoryLimit: 1,
                createdAt: 1
            }
        ).lean();

        if (!problem) {
            throw new AppError("Problem not found.", 404);
        }

        return problem;
    }
}

export default new ProblemService();
