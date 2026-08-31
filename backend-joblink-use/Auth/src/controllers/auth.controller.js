import crypto from "crypto";

import config from "../config/config.js";

import sessionModel from "../models/session.model.js";
import userModel from "../models/user.model.js";
import OTPModel from "../models/otp.model.js";

import { sendEmail } from "../services/email.service.js";

import { generateOtp } from "../utils/generateOtp.js";
import { getOtpEmailTemplate } from "../helpers/otpEmailTemplate.js";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
} from "../utils/token.js";

import AppError from "../utils/AppError.js";


// ======================================================
// CONSTANTS
// ======================================================

const OTP_EXPIRES_IN_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;


// ======================================================
// HELPERS
// ======================================================

// Hash values such as OTP and refresh tokens
const hashValue = (value) => {
    return crypto
        .createHash("sha256")
        .update(String(value))
        .digest("hex");
};


// Check required fields
const requireFields = (body, fields) => {
    for (const field of fields) {
        if (
            body[field] === undefined ||
            body[field] === null ||
            String(body[field]).trim() === ""
        ) {
            throw new AppError(`${field} is required`, 400);
        }
    }
};


// Normalize email
const normalizeEmail = (email) => {
    return String(email).trim().toLowerCase();
};


// Cookie options
const refreshCookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};


// ======================================================
// REGISTER
// ======================================================

export async function register(req, res) {
    requireFields(req.body, [
        "fullName",
        "username",
        "email",
        "password"
    ]);

    const {
        fullName,
        username,
        password
    } = req.body;

    const email = normalizeEmail(req.body.email);

    // Check existing user
    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username: username.trim() },
            { email }
        ]
    });

    if (isAlreadyRegistered) {
        throw new AppError(
            "username or email already exists",
            400
        );
    }


    // IMPORTANT:
    // Do NOT manually hash the password here.
    //
    // User model's pre("save") middleware handles bcrypt hashing.
    const user = await userModel.create({
        fullName: fullName.trim(),
        username: username.trim(),
        email,
        password
    });


    // Generate OTP
    const otp = generateOtp();

    // Hash OTP before storing
    const otpHash = hashValue(otp);

    // OTP expiration
    const expiresAt = new Date(
        Date.now() + OTP_EXPIRES_IN_MS
    );

    // Delete any previous OTP for this email
    await OTPModel.deleteMany({ email });


    // Create OTP
    await OTPModel.create({
        email,
        user: user._id,
        otpHash,
        attempts: 0,
        maxAttempts: OTP_MAX_ATTEMPTS,
        expiresAt
    });


    // Email HTML
    const html = getOtpEmailTemplate(otp);


    try {
        await sendEmail(
            email,
            "OTP verification",
            `Your OTP code is ${otp}`,
            html
        );
    } catch (error) {

        // Rollback user and OTP if email fails
        await OTPModel.deleteMany({
            user: user._id
        });

        await userModel.findByIdAndDelete(
            user._id
        );

        throw new AppError(
            "Failed to send OTP email",
            500
        );
    }


    return res.status(201).json({
        message: "user registered successfully",

        user: {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    });
}


// ======================================================
// LOGIN
// ======================================================

export async function login(req, res) {
    requireFields(req.body, [
        "email",
        "password"
    ]);

    const email = normalizeEmail(req.body.email);
    const { password } = req.body;


    // Password has select:false in User model,
    // therefore explicitly select it.
    const user = await userModel
        .findOne({ email })
        .select("+password");


    if (!user) {
        throw new AppError(
            "invalid email or password",
            400
        );
    }


    if (!user.isActive) {
        throw new AppError(
            "account is inactive",
            403
        );
    }


    if (!user.verified) {
        throw new AppError(
            "email not verified",
            400
        );
    }


    // Google/GitHub-only accounts may not have
    // a normal password.
    if (!user.password) {
        throw new AppError(
            "invalid email or password",
            400
        );
    }


    // bcrypt comparison
    const isPasswordValid =
        await user.comparePassword(password);


    if (!isPasswordValid) {
        throw new AppError(
            "invalid email or password",
            400
        );
    }


    // ==================================================
    // CREATE REFRESH TOKEN
    // ==================================================

    const refreshToken = generateRefreshToken({
        id: user._id
    });


    // Hash refresh token before storing
    const refreshTokenHash =
        hashValue(refreshToken);


    // ==================================================
    // CREATE SESSION
    // ==================================================

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,

        userAgent:
            req.headers["user-agent"] || "unknown"
    });


    // ==================================================
    // CREATE ACCESS TOKEN
    // ==================================================

    const accessToken = generateAccessToken({
        id: user._id,
        sessionId: session._id,
        role: user.role
    });


    // ==================================================
    // STORE REFRESH TOKEN IN HTTP-ONLY COOKIE
    // ==================================================

    res.cookie(
        "refreshToken",
        refreshToken,
        refreshCookieOptions
    );


    return res.status(200).json({
        message: "logged in successfully",

        user: {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role
        },

        accessToken
    });
}


// ======================================================
// GET CURRENT USER
// ======================================================

export async function getMe(req, res) {
    const token =
        req.headers.authorization?.split(" ")[1];


    if (!token) {
        throw new AppError(
            "token not found",
            401
        );
    }


    const decoded =
        verifyAccessToken(token);


    const user =
        await userModel.findById(decoded.id);


    if (!user) {
        throw new AppError(
            "user not found",
            404
        );
    }


    if (!user.isActive) {
        throw new AppError(
            "account is inactive",
            403
        );
    }


    // If the access token contains a session,
    // make sure that session has not been revoked.
    if (decoded.sessionId) {

        const session =
            await sessionModel.findOne({
                _id: decoded.sessionId,
                user: decoded.id,
                revokedAt: null
            });


        if (!session) {
            throw new AppError(
                "session has been revoked",
                401
            );
        }
    }


    return res.status(200).json({
        message: "user fetched successfully",

        user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
            verified: user.verified,
            avatar: user.avatar
        }
    });
}


// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

export async function refreshToken(req, res) {
    const refreshToken =
        req.cookies.refreshToken;


    if (!refreshToken) {
        throw new AppError(
            "refresh token not found",
            401
        );
    }


    // Verify using JWT_REFRESH_SECRET
    const decoded =
        verifyRefreshToken(refreshToken);


    const refreshTokenHash =
        hashValue(refreshToken);


    // Find active session
    const session =
        await sessionModel.findOne({
            user: decoded.id,
            refreshTokenHash,
            revokedAt: null
        });


    if (!session) {
        throw new AppError(
            "invalid refresh token",
            401
        );
    }


    // ==================================================
    // CREATE NEW ACCESS TOKEN
    // ==================================================

    const accessToken =
        generateAccessToken({
            id: decoded.id,
            sessionId: session._id
        });


    // ==================================================
    // ROTATE REFRESH TOKEN
    // ==================================================

    const newRefreshToken =
        generateRefreshToken({
            id: decoded.id
        });


    const newRefreshTokenHash =
        hashValue(newRefreshToken);


    session.refreshTokenHash =
        newRefreshTokenHash;


    await session.save();


    // Replace old cookie
    res.cookie(
        "refreshToken",
        newRefreshToken,
        refreshCookieOptions
    );


    return res.status(200).json({
        message:
            "access token refreshed successfully",

        accessToken
    });
}


// ======================================================
// LOGOUT CURRENT DEVICE
// ======================================================

export async function logout(req, res) {
    const refreshToken =
        req.cookies.refreshToken;


    if (!refreshToken) {
        throw new AppError(
            "refresh token not found",
            400
        );
    }


    const refreshTokenHash =
        hashValue(refreshToken);


    const session =
        await sessionModel.findOne({
            refreshTokenHash,
            revokedAt: null
        });


    if (!session) {
        throw new AppError(
            "invalid refresh token",
            400
        );
    }


    // Revoke current session
    session.revokedAt = new Date();

    await session.save();


    res.clearCookie(
        "refreshToken",
        {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict"
        }
    );


    return res.status(200).json({
        message: "logged out successfully"
    });
}


// ======================================================
// LOGOUT ALL DEVICES
// ======================================================

export async function logoutAll(req, res) {
    const refreshToken =
        req.cookies.refreshToken;


    if (!refreshToken) {
        throw new AppError(
            "refresh token not found",
            400
        );
    }


    const decoded =
        verifyRefreshToken(refreshToken);


    // Revoke every session belonging to user
    await sessionModel.updateMany(
        {
            user: decoded.id,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: new Date()
            }
        }
    );


    res.clearCookie(
        "refreshToken",
        {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict"
        }
    );


    return res.status(200).json({
        message:
            "logged out from all devices successfully"
    });
}


// ======================================================
// VERIFY EMAIL / OTP
// ======================================================

export async function verifyEmail(req, res) {
    requireFields(req.body, [
        "otp",
        "email"
    ]);


    const otp =
        String(req.body.otp).trim();

    const email =
        normalizeEmail(req.body.email);


    // Find active OTP for email
    const otpDoc =
        await OTPModel.findOne({ email });


    if (!otpDoc) {
        throw new AppError(
            "OTP not found or expired",
            400
        );
    }


    // ==================================================
    // CHECK EXPIRATION
    // ==================================================

    if (
        !otpDoc.expiresAt ||
        new Date() > otpDoc.expiresAt
    ) {

        await OTPModel.deleteOne({
            _id: otpDoc._id
        });

        throw new AppError(
            "OTP expired",
            400
        );
    }


    // ==================================================
    // CHECK MAX ATTEMPTS
    // ==================================================

    if (
        otpDoc.attempts >=
        otpDoc.maxAttempts
    ) {

        await OTPModel.deleteOne({
            _id: otpDoc._id
        });

        throw new AppError(
            "maximum OTP attempts exceeded",
            400
        );
    }


    // ==================================================
    // COMPARE OTP
    // ==================================================

    const otpHash =
        hashValue(otp);


    if (otpHash !== otpDoc.otpHash) {

        otpDoc.attempts += 1;

        const attemptsLeft =
            Math.max(
                otpDoc.maxAttempts -
                otpDoc.attempts,
                0
            );


        // Delete after maximum attempts
        if (
            otpDoc.attempts >=
            otpDoc.maxAttempts
        ) {

            await OTPModel.deleteOne({
                _id: otpDoc._id
            });

            throw new AppError(
                "maximum OTP attempts exceeded",
                400
            );
        }


        await otpDoc.save();


        throw new AppError(
            `invalid OTP. ${attemptsLeft} attempts remaining`,
            400
        );
    }


    // ==================================================
    // VERIFY USER
    // ==================================================

    const user =
        await userModel.findByIdAndUpdate(
            otpDoc.user,
            {
                verified: true
            },
            {
                returnDocument: "after"
            }
        );

console.log("VERIFY USER ID:", otpDoc.user);
console.log("UPDATED USER:", user);
    if (!user) {
        throw new AppError(
            "user not found",
            404
        );
    }


    // Delete OTP after successful verification
    await OTPModel.deleteOne({
        _id: otpDoc._id
    });


    // ==================================================
    // VERIFICATION SUCCESS EMAIL
    // ==================================================

    const html = `
        <div style="
            font-family:Arial;
            background:#f4f6f8;
            padding:20px;
        ">

            <div style="
                max-width:420px;
                margin:auto;
                background:white;
                padding:30px;
                border-radius:12px;
                text-align:center;
            ">

                <h2 style="color:#22c55e;">
                    Welcome ${user.username}
                </h2>

                <p style="color:#6b7280;">
                    Your account has been successfully verified.
                </p>

                <p style="color:#6b7280;">
                    You can now login and start using the app.
                </p>

            </div>

        </div>
    `;


    // Verification email failure should NOT
    // invalidate successful verification.
    try {

        await sendEmail(
            user.email,
            "Registration Successful",
            "Your account is verified",
            html
        );

    } catch (error) {

        console.error(
            "Verification success email failed",
            {
                to: user.email,
                userId: user._id,
                message: error.message
            }
        );
    }


    return res.status(200).json({
        message:
            "email verified successfully",

        user: {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    });
}


// ======================================================
// FORGOT PASSWORD
// ======================================================

export async function forgotPassword(req, res) {
    requireFields(req.body, [
        "email"
    ]);


    const email =
        normalizeEmail(req.body.email);


    const user =
        await userModel.findOne({ email });


    if (!user) {
        throw new AppError(
            "user not found",
            400
        );
    }


    // Generate reset token
    const resetToken =
        crypto.randomBytes(32).toString("hex");


    user.resetPasswordToken =
        resetToken;

    user.resetPasswordExpires =
        new Date(
            Date.now() + 10 * 60 * 1000
        );


    await user.save();


    // Use configured frontend URL
    const resetUrl =
        `${config.CLIENT_URL}/reset-password/${resetToken}`;


    const html = `
        <div style="
            font-family:Arial;
            background:#f4f6f8;
            padding:20px;
        ">

            <div style="
                max-width:420px;
                margin:auto;
                background:white;
                padding:25px;
                border-radius:10px;
                text-align:center;
            ">

                <h2 style="color:#4f46e5;">
                    Reset Your Password
                </h2>

                <p style="color:#6b7280;">
                    We received a request to reset your password.
                </p>

                <a
                    href="${resetUrl}"
                    style="
                        display:inline-block;
                        margin:20px 0;
                        padding:12px 20px;
                        background:#4f46e5;
                        color:white;
                        border-radius:8px;
                        text-decoration:none;
                        font-weight:bold;
                    "
                >
                    Reset Password
                </a>

                <p style="
                    font-size:12px;
                    color:#6b7280;
                ">
                    ${resetUrl}
                </p>

                <p style="
                    color:#ef4444;
                    font-size:12px;
                ">
                    Link expires in 10 minutes
                </p>

            </div>

        </div>
    `;


    await sendEmail(
        email,
        "Reset Your Password",
        "Click the link to reset your password",
        html
    );


    return res.status(200).json({
        message:
            "reset link sent to email"
    });
}


// ======================================================
// RESET PASSWORD
// ======================================================

// ======================================================
// GOOGLE LOGIN CALLBACK
// ======================================================

export async function googleCallback(req, res) {

    const googleUser = req.user;

    if (!googleUser) {
        throw new AppError(
            "Google authentication failed",
            401
        );
    }


    const {
        googleId,
        email,
        fullName,
        profilePicture
    } = googleUser;


    // ==================================================
    // FIND USER BY EMAIL
    // ==================================================

    let user = await userModel.findOne({
        email
    });


    // ==================================================
    // CREATE NEW GOOGLE USER
    // ==================================================

    if (!user) {

        // Username must be unique
        const baseUsername =
            email.split("@")[0];

        let username = baseUsername;

        let counter = 1;

        while (
            await userModel.findOne({ username })
        ) {
            username =
                `${baseUsername}${counter}`;

            counter++;
        }


        user = await userModel.create({

            fullName,

            username,

            email,

            googleId,

            avatar: profilePicture,

            // Google already verified the email
            verified: true

        });

    }


    // ==================================================
    // EXISTING USER
    // ==================================================

    else {

        // If this user doesn't have Google ID,
        // connect Google account to existing account.
        if (!user.googleId) {
            user.googleId = googleId;
        }


        // Save Google profile picture
        if (
            profilePicture &&
            !user.avatar
        ) {
            user.avatar = profilePicture;
        }


        // Google verified the email
        if (!user.verified) {
            user.verified = true;
        }


        await user.save();
    }


    // ==================================================
    // CHECK ACCOUNT STATUS
    // ==================================================

    if (!user.isActive) {
        throw new AppError(
            "account is inactive",
            403
        );
    }


    // ==================================================
    // CREATE REFRESH TOKEN
    // ==================================================

    const refreshToken =
        generateRefreshToken({
            id: user._id
        });


    // ==================================================
    // HASH REFRESH TOKEN
    // ==================================================

    const refreshTokenHash =
        hashValue(refreshToken);


    // ==================================================
    // CREATE SESSION
    // ==================================================

    const session =
        await sessionModel.create({

            user: user._id,

            refreshTokenHash,

            userAgent:
                req.headers["user-agent"] ||
                "unknown"
        });


    // ==================================================
    // CREATE ACCESS TOKEN
    // ==================================================

    const accessToken =
        generateAccessToken({

            id: user._id,

            sessionId: session._id,
            role: user.role

        });


    // ==================================================
    // STORE REFRESH TOKEN
    // ==================================================

    res.cookie(
        "refreshToken",
        refreshToken,
        refreshCookieOptions
    );


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.redirect(
        `${config.CLIENT_URL}/google-success?accessToken=${accessToken}`
    );
}
export function googleFailure(req, res) {
    return res.status(401).json({
        success: false,
        message: "Google authentication failed"
    });
}

export function githubFailure(req, res) {
    return res.status(401).json({
        success: false,
        message: "GitHub authentication failed"
    });
}

export async function githubCallback(req, res) {

    const githubUser = req.user;

    // ==================================================
    // CHECK GITHUB USER
    // ==================================================

    if (!githubUser) {
        throw new AppError(
            "GitHub authentication failed",
            401
        );
    }


    const {
        githubId,
        email,
        fullName,
        username,
        profilePicture
    } = githubUser;


    // ==================================================
    // FIND USER BY EMAIL
    // ==================================================

    let user = await userModel.findOne({
        email
    });


    // ==================================================
    // CREATE NEW GITHUB USER
    // ==================================================

    if (!user) {

        // GitHub username can be used initially
        // but it must be unique.
        const baseUsername =
            username ||
            email.split("@")[0];

        let finalUsername =
            baseUsername;

        let counter = 1;


        // Check username collision
        while (
            await userModel.findOne({
                username: finalUsername
            })
        ) {

            finalUsername =
                `${baseUsername}${counter}`;

            counter++;
        }


        // Create user
        user = await userModel.create({

            fullName:
                fullName || finalUsername,

            username:
                finalUsername,

            email,

            githubId,

            avatar:
                profilePicture,

            // GitHub email is already verified
            verified: true

        });

    }


    // ==================================================
    // EXISTING USER
    // ==================================================

    else {

        // Connect GitHub account to existing account
        if (!user.githubId) {

            user.githubId =
                githubId;
        }


        // Save GitHub profile picture
        if (
            profilePicture &&
            !user.avatar
        ) {

            user.avatar =
                profilePicture;
        }


        // GitHub verified the email
        if (!user.verified) {

            user.verified =
                true;
        }


        await user.save();
    }


    // ==================================================
    // CHECK ACCOUNT STATUS
    // ==================================================

    if (!user.isActive) {

        throw new AppError(
            "account is inactive",
            403
        );
    }


    // ==================================================
    // CREATE REFRESH TOKEN
    // ==================================================

    const refreshToken =
        generateRefreshToken({
            id: user._id
        });


    // ==================================================
    // HASH REFRESH TOKEN
    // ==================================================

    const refreshTokenHash =
        hashValue(refreshToken);


    // ==================================================
    // CREATE SESSION
    // ==================================================

    const session =
        await sessionModel.create({

            user:
                user._id,

            refreshTokenHash,

            userAgent:
                req.headers["user-agent"] ||
                "unknown"
        });


    // ==================================================
    // CREATE ACCESS TOKEN
    // ==================================================

    const accessToken =
        generateAccessToken({

            id: user._id,

            sessionId: session._id,
            role: user.role

        });


    // ==================================================
    // STORE REFRESH TOKEN
    // ==================================================

    res.cookie(
        "refreshToken",
        refreshToken,
        refreshCookieOptions
    );


    // ==================================================
    // REDIRECT TO FRONTEND
    // ==================================================

    return res.redirect(
        `${config.CLIENT_URL}/github-success?accessToken=${accessToken}`
    );
}
export async function resetPassword(req, res) {
    requireFields(req.body, [
        "password"
    ]);


    const { token } =
        req.params;

    const { password } =
        req.body;


    if (!token) {
        throw new AppError(
            "reset token is required",
            400
        );
    }


    const user =
        await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {
                $gt: new Date()
            }
        });


    if (!user) {
        throw new AppError(
            "invalid or expired token",
            400
        );
    }


    // IMPORTANT:
    // Do NOT manually hash password.
    // User model's pre-save hook will bcrypt hash it.
    user.password = password;

    user.verified = true;

    user.resetPasswordToken = null;

    user.resetPasswordExpires = null;


    await user.save();


    // ==================================================
    // OPTIONAL SECURITY:
    // INVALIDATE ALL EXISTING SESSIONS
    // ==================================================

    await sessionModel.updateMany(
        {
            user: user._id,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: new Date()
            }
        }
    );


    // ==================================================
    // PASSWORD SUCCESS EMAIL
    // ==================================================

    const html = `
        <div style="
            font-family:Arial;
            background:#f4f6f8;
            padding:20px;
        ">

            <div style="
                max-width:420px;
                margin:auto;
                background:white;
                padding:25px;
                border-radius:10px;
                text-align:center;
            ">

                <h2 style="color:#4f46e5;">
                    Password Updated
                </h2>

                <p style="color:#6b7280;">
                    Your password has been successfully changed.
                </p>

                <p style="
                    color:#ef4444;
                    font-size:12px;
                ">
                    If this was not you, secure your account immediately.
                </p>

            </div>

        </div>
    `;


    await sendEmail(
        user.email,
        "Password Reset Successful",
        "Password changed successfully",
        html
    );


    return res.status(200).json({
        message:
            "password reset successful"
    });
}

