import { body } from "express-validator";

const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .isLength({ max: 100 })
        .withMessage("Email must not exceed 100 characters.")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8, max: 30 })
        .withMessage("Password must be between 8 and 30 characters.")
];

export default loginValidator;