import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            index: true
        },

        refreshTokenHash: {
            type: String,
            required: [true, "Refresh token hash is required"]
        },

        userAgent: {
            type: String,
            default: "Unknown",
            trim: true
        },
        revokedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;