import AppError from "../utils/AppError.js";


// ======================================================
// ROLE-BASED AUTHORIZATION
// ======================================================

export const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        // User must already be authenticated
        if (!req.user) {
            throw new AppError(
                "Authentication required",
                401
            );
        }


        // Check user's role
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError(
                "You are not authorized to access this resource",
                403
            );
        }


        // Role is allowed
        next();
    };
};