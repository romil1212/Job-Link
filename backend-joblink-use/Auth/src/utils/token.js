import jwt from "jsonwebtoken";
import config from "../config/config.js";


// Generate access token
export function generateAccessToken(payload) {
    return jwt.sign(
        payload,
        config.JWT_ACCESS_SECRET,
        {
            expiresIn: config.JWT_ACCESS_EXPIRES
        }
    );
}


// Generate refresh token
export function generateRefreshToken(payload) {
    return jwt.sign(
        payload,
        config.JWT_REFRESH_SECRET,
        {
            expiresIn: config.JWT_REFRESH_EXPIRES
        }
    );
}


// Verify access token
export function verifyAccessToken(token) {
    return jwt.verify(
        token,
        config.JWT_ACCESS_SECRET
    );
}


// Verify refresh token
export function verifyRefreshToken(token) {
    return jwt.verify(
        token,
        config.JWT_REFRESH_SECRET
    );
}