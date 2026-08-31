import { body } from "express-validator";

const verifyOtpValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .isLength({ max: 100 })
        .withMessage("Email must not exceed 100 characters.")
        .normalizeEmail(),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be exactly 6 digits.")
        .matches(/^\d{6}$/)
        .withMessage("OTP must contain only 6 digits.")
];

export default verifyOtpValidator;