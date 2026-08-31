import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
    {
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: [true, "Problem reference is required"],
            index: true
        },
        input: {
            type: String,
            required: [true, "Test case input is required"],
            trim: true
        },
        expectedOutput: {
            type: String,
            required: [true, "Test case expected output is required"],
            trim: true
        },
        isHidden: {
            type: Boolean,
            default: false,
            index: true
        },
        order: {
            type: Number,
            default: 0
        },
        explanation: {
            type: String,
            default: "",
            trim: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Creator reference is required"]
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Compound index for getting test cases for a problem sorted by order
testCaseSchema.index({ problem: 1, order: 1 });

const TestCase = mongoose.model("TestCase", testCaseSchema);

export default TestCase;
