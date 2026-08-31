import { Worker } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { executeCode } from "./../runners/index.js";
import Submission from "../models/submission.model.js";
import TestCase from "../models/testCase.model.js";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/joblink")
    .then(() => console.log("Worker connected to MongoDB"))
    .catch(err => console.error("Worker MongoDB connection error:", err));

const connection = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
});

/**
 * Normalizes output by trimming whitespace and unifying line endings
 */
function normalizeOutput(str) {
    if (!str) return "";
    return str.toString()
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map(line => line.trimEnd())
        .join("\n")
        .trim();
}

const worker = new Worker("SubmissionQueue", async (job) => {
    const { submissionId, problemId, language, sourceCode, isRun, timeLimit, memoryLimit } = job.data;
    
    console.log(`[Worker] Processing submission ${submissionId}`);

    try {
        await Submission.findByIdAndUpdate(submissionId, { status: "RUNNING" });

        // Fetch test cases
        const filter = { problem: problemId };
        if (isRun) {
            filter.isHidden = false; // "Run" only uses public test cases
        }
        
        const testCases = await TestCase.find(filter).sort({ order: 1 });
        
        if (testCases.length === 0) {
            await Submission.findByIdAndUpdate(submissionId, {
                status: "COMPLETED",
                verdict: "SYSTEM_ERROR",
                errorMessage: "No test cases found for this problem."
            });
            return;
        }

        console.log(`[Worker] Submission ${submissionId} has ${testCases.length} test cases.`);

        let passed = 0;
        let finalVerdict = "ACCEPTED";
        let maxRuntime = 0;
        let maxMemory = 0; // Tracking memory exactly requires parsing docker stats, for now we leave as null or 0
        let testResults = [];
        let errorMessage = null;

        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            console.log(`[Worker] Running test case ${i+1}/${testCases.length} for ${submissionId}`);
            
            const result = await executeCode({
                language,
                sourceCode,
                input: tc.input,
                timeLimit,
                memoryLimit
            });

            console.log(`[Worker] Result for test case ${i+1}: ${result.status}, stdout: ${result.stdout.substring(0, 50)}`);

            maxRuntime = Math.max(maxRuntime, result.runtime || 0);

            let testPassed = false;
            let actualOutput = "";
            let expectedOutput = normalizeOutput(tc.expectedOutput);

            if (result.status !== "SUCCESS") {
                finalVerdict = result.status; // TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, etc.
                errorMessage = result.error || null;
                actualOutput = result.stderr ? normalizeOutput(result.stderr) : "";
            } else {
                // Compare output
                actualOutput = normalizeOutput(result.stdout);

                if (actualOutput === expectedOutput) {
                    testPassed = true;
                    passed++;
                } else {
                    finalVerdict = "WRONG_ANSWER";
                    errorMessage = `Input: ${tc.input}\nExpected: ${expectedOutput}\nActual: ${actualOutput}`;
                }
            }

            // Record result for this test case
            if (!tc.isHidden) {
                testResults.push({
                    testCase: i + 1,
                    isPublic: true,
                    input: tc.input,
                    output: actualOutput,
                    expectedOutput: expectedOutput,
                    passed: testPassed
                });
            } else {
                testResults.push({
                    testCase: i + 1,
                    isPublic: false,
                    passed: testPassed
                });
            }

            if (!testPassed) {
                break; // Stop evaluating further test cases on failure
            }
        }

        console.log(`[Worker] Finished all test cases for ${submissionId}, updating DB to ${finalVerdict}...`);

        // Update final submission record
        await Submission.findByIdAndUpdate(submissionId, {
            status: "COMPLETED",
            verdict: finalVerdict,
            runtime: maxRuntime,
            testCasesPassed: passed,
            totalTestCases: testCases.length,
            errorMessage,
            testResults
        });

        console.log(`[Worker] Completed submission ${submissionId} with verdict ${finalVerdict}`);

    } catch (error) {
        console.error(`[Worker] Error processing submission ${submissionId}:`, error);
        await Submission.findByIdAndUpdate(submissionId, {
            status: "FAILED",
            verdict: "SYSTEM_ERROR",
            errorMessage: error.message
        });
    }
}, { connection, concurrency: parseInt(process.env.WORKER_CONCURRENCY) || 2 });

worker.on("ready", () => {
    console.log("Worker is ready and listening to SubmissionQueue...");
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
});
