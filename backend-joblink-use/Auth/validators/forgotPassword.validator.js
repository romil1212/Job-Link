import { body } from "express-validator";

const forgotPasswordValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .isLength({ max: 100 })
        .withMessage("Email must not exceed 100 characters.")
        .normalizeEmail()
];

export default forgotPasswordValidator;