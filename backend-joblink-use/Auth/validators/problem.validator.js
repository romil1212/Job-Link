import { body } from "express-validator";

export const createProblemValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required.")
        .isLength({ max: 200 })
        .withMessage("Title must not exceed 200 characters."),

    body("slug")
        .optional()
        .trim()
        .matches(/^[a-z0-9-]+$/)
        .withMessage("Slug must only contain lowercase alphanumeric characters and hyphens."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required."),

    body("difficulty")
        .trim()
        .notEmpty()
        .withMessage("Difficulty is required.")
        .toLowerCase()
        .isIn(["easy", "medium", "hard"])
        .withMessage("Difficulty must be easy, medium, or hard."),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required."),

    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array of strings."),

    body("tags.*")
        .optional()
        .isString()
        .trim()
        .withMessage("Each tag must be a string."),

    body("constraints")
        .optional()
        .isArray()
        .withMessage("Constraints must be an array of strings."),

    body("constraints.*")
        .optional()
        .isString()
        .trim()
        .withMessage("Each constraint must be a string."),

    body("examples")
        .optional()
        .isArray()
        .withMessage("Examples must be an array."),

    body("examples.*.input")
        .optional()
        .notEmpty()
        .withMessage("Example input is required."),

    body("examples.*.output")
        .optional()
        .notEmpty()
        .withMessage("Example output is required."),

    body("hints")
        .optional()
        .isArray()
        .withMessage("Hints must be an array of strings."),

    body("starterCode")
        .optional()
        .isArray()
        .withMessage("Starter code must be an array."),

    body("starterCode.*.language")
        .optional()
        .notEmpty()
        .withMessage("Starter code language is required."),

    body("starterCode.*.code")
        .optional()
        .notEmpty()
        .withMessage("Starter code is required."),

    body("timeLimit")
        .optional()
        .isInt({ min: 100, max: 10000 })
        .withMessage("Time limit must be an integer between 100ms and 10000ms."),

    body("memoryLimit")
        .optional()
        .isInt({ min: 16, max: 1024 })
        .withMessage("Memory limit must be an integer between 16MB and 1024MB."),

    body("isPublished")
        .optional()
        .isBoolean()
        .withMessage("isPublished must be a boolean.")
];

export const updateProblemValidator = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty.")
        .isLength({ max: 200 })
        .withMessage("Title must not exceed 200 characters."),

    body("slug")
        .optional()
        .trim()
        .matches(/^[a-z0-9-]+$/)
        .withMessage("Slug must only contain lowercase alphanumeric characters and hyphens."),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty."),

    body("difficulty")
        .optional()
        .trim()
        .toLowerCase()
        .isIn(["easy", "medium", "hard"])
        .withMessage("Difficulty must be easy, medium, or hard."),

    body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be empty."),

    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array of strings."),

    body("constraints")
        .optional()
        .isArray()
        .withMessage("Constraints must be an array of strings."),

    body("examples")
        .optional()
        .isArray()
        .withMessage("Examples must be an array."),

    body("hints")
        .optional()
        .isArray()
        .withMessage("Hints must be an array of strings."),

    body("starterCode")
        .optional()
        .isArray()
        .withMessage("Starter code must be an array."),

    body("timeLimit")
        .optional()
        .isInt({ min: 100, max: 10000 })
        .withMessage("Time limit must be an integer between 100ms and 10000ms."),

    body("memoryLimit")
        .optional()
        .isInt({ min: 16, max: 1024 })
        .withMessage("Memory limit must be an integer between 16MB and 1024MB."),

    body("isPublished")
        .optional()
        .isBoolean()
        .withMessage("isPublished must be a boolean.")
];
