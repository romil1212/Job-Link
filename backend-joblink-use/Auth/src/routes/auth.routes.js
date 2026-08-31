import {Router} from 'express';
import * as authcontroller from '../controllers/auth.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
import passport from "../config/passport.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";


const authRouter = Router();



/** 
 * POST /api/auth/register
 */
authRouter.post('/register', asyncHandler(authcontroller.register))

/**
 * POST /api/auth/login
 */
authRouter.post('/login', asyncHandler(authcontroller.login))

/** 
 * GET /api/auth/get-me
 */
authRouter.get('/get-me', asyncHandler(authcontroller.getMe))

/**
 * GET /api/auth/referesh-token
 */
authRouter.get("/refresh-token", asyncHandler(authcontroller.refreshToken))


/**
* GET /api/auth/logout
*/
authRouter.get("/logout", asyncHandler(authcontroller.logout))


/**
 * GET /api/auth/logout-all
 */
authRouter.get("/logout-all", asyncHandler(authcontroller.logoutAll))

/**
 * POST /api/auth/verify-email
 */
authRouter.post("/verify-email", asyncHandler(authcontroller.verifyEmail))

authRouter.post("/forgot-password", asyncHandler(authcontroller.forgotPassword));
authRouter.post("/reset-password/:token", asyncHandler(authcontroller.resetPassword));
// GET /api/auth/google
//
// Starts Google OAuth login
authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
);


// ======================================================
// GOOGLE OAUTH CALLBACK
// ======================================================

// GET /api/auth/google/callback
//
// Google redirects here after authentication
authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/api/auth/google/failure"
    }),
    asyncHandler(authcontroller.googleCallback)
);


// ======================================================
// GOOGLE OAUTH FAILURE
// ======================================================

// GET /api/auth/google/failure
authRouter.get(
    "/google/failure",
    authcontroller.googleFailure
);

/**
 * GET /api/auth/github
 *
 * Start GitHub OAuth login
 */
authRouter.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email"],
        session: false
    })
);


/**
 * GET /api/auth/github/callback
 *
 * GitHub redirects here after authentication
 */
authRouter.get(
    "/github/callback",
    passport.authenticate("github", {
        session: false,
        failureRedirect: "/api/auth/github/failure"
    }),
    asyncHandler(authcontroller.githubCallback)
);


/**
 * GET /api/auth/github/failure
 *
 * GitHub authentication failed
 */
authRouter.get(
    "/github/failure",
    authcontroller.githubFailure
);

// ======================================================
// RBAC TEST ROUTE
// ======================================================

authRouter.get(
    "/admin-test",
    authenticate,
    authorizeRoles("admin"),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Welcome Admin!",
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
);
export default authRouter; 
