import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "./email.service.js";
import { getOtpEmailTemplate } from "../helpers/otpEmailTemplate.js";
import AppError from "../utils/AppError.js";

class AuthService {
    async registerUser(userData) {
        const {
            fullName,
            username,
            email,
            password
        } = userData;

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            throw new AppError("Email already exists.", 409);
        }
        
    }
}

export default new AuthService();