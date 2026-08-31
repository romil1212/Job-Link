import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Submission from './src/models/submission.model.js';
import User from './src/models/user.model.js';
import Problem from './src/models/problem.model.js';
import { Queue } from 'bullmq';

dotenv.config();

const submissionQueue = new Queue("SubmissionQueue", {
    connection: { host: "127.0.0.1", port: 6379 }
});

async function run() {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/joblink");
    console.log("Connected to MongoDB.");

    const user = await User.findOne({});
    let problem = await Problem.findOne({ slug: "two-sum-e2e" });
    
    // Create a new RUN submission
    const submission = await Submission.create({
        user: user._id,
        problem: problem._id,
        language: "javascript",
        sourceCode: `
function twoSum(a, b) {
    console.log("Adding numbers...");
    return a + b;
}
        `,
        status: "QUEUED",
        isRun: true,
        timeLimit: 5000,
        memoryLimit: 256
    });

    console.log(`Queued submission: ${submission._id}`);

    await submissionQueue.add("executeCode", {
        submissionId: submission._id,
        problemId: problem._id,
        language: "javascript",
        sourceCode: submission.sourceCode,
        isRun: true,
        timeLimit: submission.timeLimit,
        memoryLimit: submission.memoryLimit
    });

    // Poll
    while (true) {
        const check = await Submission.findById(submission._id);
        if (check.status === "COMPLETED" || check.status === "FAILED") {
            console.log(`Finished with status: ${check.status}, verdict: ${check.verdict}`);
            console.log("TEST RESULTS ARRAY:");
            console.log(JSON.stringify(check.testResults, null, 2));
            break;
        }
        await new Promise(r => setTimeout(r, 1000));
    }

    mongoose.disconnect();
}

run().catch(console.error);
