import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many OTP requests. Please try again later."
    }
});

export default otpLimiter;