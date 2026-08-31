import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true
        },

        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            default: null,
            select: false
        },

        verified: {
            type: Boolean,
            default: false
        },

        refreshToken: {
            type: String,
            default: null
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        },

        googleId: {
            type: String,
            default: null
        },

        githubId: {
            type: String,
            default: null
        },

        avatar: {
            type: String,
            default: null
        },

        resetPasswordToken: {
            type: String,
            default: null
        },

        resetPasswordExpires: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);


// ======================================================
// PASSWORD HASHING
// ======================================================

userSchema.pre("save", async function () {

    if (
        !this.isModified("password") ||
        !this.password
    ) {
        return;
    }

    this.password = await bcrypt.hash(
        this.password,
        10
    );
});

// ======================================================
// PASSWORD COMPARISON
// ======================================================

userSchema.methods.comparePassword = async function (
    plainPassword
) {
    return await bcrypt.compare(
        plainPassword,
        this.password
    );
};


const User = mongoose.model(
    "User",
    userSchema
);

export default User;