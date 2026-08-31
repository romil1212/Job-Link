import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
            index: true
        },
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: [true, "Problem reference is required"],
            index: true
        },
        language: {
            type: String,
            enum: ["javascript", "python", "java", "c", "cpp"],
            required: [true, "Programming language is required"]
        },
        sourceCode: {
            type: String,
            required: [true, "Source code is required"]
        },
        isRun: {
            type: Boolean,
            default: false,
            index: true
        },
        status: {
            type: String,
            enum: ["QUEUED", "RUNNING", "COMPLETED", "FAILED"],
            default: "QUEUED",
            index: true
        },
        verdict: {
            type: String,
            enum: [
                "PENDING", 
                "ACCEPTED", 
                "WRONG_ANSWER", 
                "TIME_LIMIT_EXCEEDED", 
                "MEMORY_LIMIT_EXCEEDED", 
                "COMPILATION_ERROR", 
                "RUNTIME_ERROR", 
                "SYSTEM_ERROR"
            ],
            default: "PENDING",
            index: true
        },
        runtime: {
            type: Number,
            default: null // in milliseconds
        },
        memory: {
            type: Number,
            default: null // in MB
        },
        testCasesPassed: {
            type: Number,
            default: 0
        },
        totalTestCases: {
            type: Number,
            default: 0
        },
        errorMessage: {
            type: String,
            default: null
        },
        testResults: [
            {
                testCase: Number,
                isPublic: Boolean,
                input: String,
                output: String,
                expectedOutput: String,
                passed: Boolean
            }
        ]
    },
    {
        timestamps: true
    }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
