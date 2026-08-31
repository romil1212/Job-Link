import { body } from "express-validator";

const resetPasswordValidator = [
    body("token")
        .trim()
        .notEmpty()
        .withMessage("Reset token is required."),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8, max: 30 })
        .withMessage("Password must be between 8 and 30 characters.")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        )
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),

    body("confirmPassword")
        .trim()
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match.");
            }

            return true;
        })
];

export default resetPasswordValidator;