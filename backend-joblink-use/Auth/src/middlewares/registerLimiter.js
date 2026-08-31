import rateLimit from "express-rate-limit";

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many registration attempts. Please try again later."
    }
});

export default registerLimiter;