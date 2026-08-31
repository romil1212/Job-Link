import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
    {
        input: {
            type: String,
            required: [true, "Example input is required"],
            trim: true
        },
        output: {
            type: String,
            required: [true, "Example output is required"],
            trim: true
        },
        explanation: {
            type: String,
            default: "",
            trim: true
        }
    },
    { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
    {
        language: {
            type: String,
            required: [true, "Language is required"],
            lowercase: true,
            trim: true
        },
        code: {
            type: String,
            required: [true, "Starter code is required"]
        }
    },
    { _id: false }
);

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Problem title is required"],
            trim: true
        },
        slug: {
            type: String,
            required: [true, "Problem slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: [true, "Problem description is required"]
        },
        difficulty: {
            type: String,
            enum: {
                values: ["easy", "medium", "hard"],
                message: "Difficulty must be easy, medium, or hard"
            },
            required: [true, "Difficulty is required"],
            lowercase: true,
            index: true
        },
        tags: {
            type: [String],
            default: [],
            index: true
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            index: true
        },
        constraints: {
            type: [String],
            default: []
        },
        examples: {
            type: [exampleSchema],
            default: []
        },
        hints: {
            type: [String],
            default: []
        },
        starterCode: {
            type: [starterCodeSchema],
            default: []
        },
        supportedLanguages: {
            type: [String],
            default: ["javascript", "python", "cpp", "java"]
        },
        timeLimit: {
            type: Number,
            default: 2000,
            min: [100, "Time limit must be at least 100ms"],
            max: [10000, "Time limit cannot exceed 10000ms"]
        },
        memoryLimit: {
            type: Number,
            default: 256,
            min: [16, "Memory limit must be at least 16MB"],
            max: [1024, "Memory limit cannot exceed 1024MB"]
        },
        isPublished: {
            type: Boolean,
            default: true,
            index: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
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

// Compound text index for title & category search
problemSchema.index({ title: "text", category: "text", tags: "text" });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
