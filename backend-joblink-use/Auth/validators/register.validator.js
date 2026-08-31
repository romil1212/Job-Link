import { body } from "express-validator";

const registerValidator = [
    
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required.")
        .isLength({ min: 3, max: 50 })
        .withMessage("Full name must be between 3 and 50 characters."),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters.")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can contain only letters, numbers, and underscores."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8, max: 30 })
        .withMessage("Password must be between 8 and 30 characters.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match.");
            }

            return true;
        }),

];

export default registerValidator;