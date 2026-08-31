import { body, param } from "express-validator";

export const createTestCaseValidator = [
    param("problemId")
        .notEmpty()
        .withMessage("Problem ID is required")
        .isMongoId()
        .withMessage("Invalid Problem ID format"),
    body("input")
        .notEmpty()
        .withMessage("Input is required")
        .isString()
        .withMessage("Input must be a string"),
    body("expectedOutput")
        .notEmpty()
        .withMessage("Expected output is required")
        .isString()
        .withMessage("Expected output must be a string"),
    body("isHidden")
        .optional()
        .isBoolean()
        .withMessage("isHidden must be a boolean"),
    body("order")
        .optional()
        .isInt()
        .withMessage("Order must be an integer"),
    body("explanation")
        .optional()
        .isString()
        .withMessage("Explanation must be a string")
];

export const updateTestCaseValidator = [
    body("input")
        .optional()
        .notEmpty()
        .withMessage("Input cannot be empty if provided")
        .isString()
        .withMessage("Input must be a string"),
    body("expectedOutput")
        .optional()
        .notEmpty()
        .withMessage("Expected output cannot be empty if provided")
        .isString()
        .withMessage("Expected output must be a string"),
    body("isHidden")
        .optional()
        .isBoolean()
        .withMessage("isHidden must be a boolean"),
    body("order")
        .optional()
        .isInt()
        .withMessage("Order must be an integer"),
    body("explanation")
        .optional()
        .isString()
        .withMessage("Explanation must be a string")
];
