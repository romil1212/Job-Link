import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            index: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            index: true
        },

        otpHash: {
            type: String,
            required: [true, "OTP hash is required"]
        },

        attempts: {
            type: Number,
            default: 0,
            min: 0
        },

        maxAttempts: {
            type: Number,
            default: 5
        },

        expiresAt: {
            type: Date,
            required: [true, "OTP expiration time is required"],
        }
    },
    {
        timestamps: true
    }
);


// Automatically remove OTP after expiration
otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);


// Prevent more than 5 attempts
otpSchema.methods.hasExceededAttempts = function () {
    return this.attempts >= this.maxAttempts;
};


const OTP = mongoose.model("OTP", otpSchema);

export default OTP;