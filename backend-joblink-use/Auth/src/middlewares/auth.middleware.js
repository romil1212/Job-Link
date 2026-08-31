import AppError from "../utils/AppError.js";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import { verifyAccessToken } from "../utils/token.js";


// ======================================================
// AUTHENTICATION MIDDLEWARE
// ======================================================

export async function authenticate(req, res, next) {

    // ==================================================
    // 1. GET ACCESS TOKEN
    // ==================================================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError(
            "Authorization header not found",
            401
        );
    }


    // ==================================================
    // 2. CHECK BEARER FORMAT
    // ==================================================

    const [scheme, token] =
        authHeader.split(" ");


    if (
        scheme !== "Bearer" ||
        !token
    ) {
        throw new AppError(
            "Invalid authorization format",
            401
        );
    }


    // ==================================================
    // 3. VERIFY ACCESS TOKEN
    // ==================================================

    const decoded =
        verifyAccessToken(token);


    // ==================================================
    // 4. FIND USER
    // ==================================================

    const user =
        await userModel.findById(decoded.id);


    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }


    // ==================================================
    // 5. CHECK ACCOUNT STATUS
    // ==================================================

    if (!user.isActive) {
        throw new AppError(
            "Account is inactive",
            403
        );
    }


    // ==================================================
    // 6. CHECK SESSION
    // ==================================================

    if (decoded.sessionId) {

        const session =
            await sessionModel.findOne({
                _id: decoded.sessionId,
                user: decoded.id,
                revokedAt: null
            });


        if (!session) {
            throw new AppError(
                "Session has been revoked",
                401
            );
        }
    }


    // ==================================================
    // 7. ATTACH USER TO REQUEST
    // ==================================================

    req.user = user;


    // ==================================================
    // 8. CONTINUE TO NEXT MIDDLEWARE
    // ==================================================

    next();
}