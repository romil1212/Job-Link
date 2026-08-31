import axios from 'axios';
import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import Problem from './src/models/problem.model.js';
import { generateAccessToken } from './src/utils/token.js';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:3001/api';

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testApi() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Get user
    const user = await User.findOne({ username: 'e2etester' });
    const token = generateAccessToken({ id: user._id });
    const headers = { Authorization: `Bearer ${token}` };
    
    // Get problem
    const problem = await Problem.findOne({ slug: 'two-sum-e2e' });
    
    const code = "function add(a, b) {\n    return a + b;\n}";
    
    console.log("--- Testing RUN ---");
    const runRes = await axios.post(`${API_URL}/submissions/run`, {
        problemId: problem._id,
        language: 'javascript',
        sourceCode: code
    }, { headers });
    
    let runSubmissionId = runRes.data.submissionId;
    console.log("Run queued:", runSubmissionId);
    
    let runStatus = "QUEUED";
    let runData = null;
    while (runStatus === "QUEUED" || runStatus === "RUNNING") {
        await wait(1000);
        const res = await axios.get(`${API_URL}/submissions/${runSubmissionId}`, { headers });
        let sub = res.data.submission;
        runStatus = sub.status;
        runData = sub;
        if (sub.status === "COMPLETED" || sub.status === "FAILED") {
            console.log(`Run Final Verdict: ${sub.verdict}`);
            console.log(`Run Test Results: ${JSON.stringify(sub.testResults, null, 2)}`);
            break;
        }
    }
    
    console.log("\n--- Testing SUBMIT ---");
    const submitRes = await axios.post(`${API_URL}/submissions`, {
        problemId: problem._id,
        language: 'javascript',
        sourceCode: code
    }, { headers });
    
    let submitSubmissionId = submitRes.data.submissionId;
    console.log("Submit queued:", submitSubmissionId);
    
    let submitStatus = "QUEUED";
    let submitData = null;
    while (submitStatus === "QUEUED" || submitStatus === "RUNNING") {
        await wait(1000);
        const res = await axios.get(`${API_URL}/submissions/${submitSubmissionId}`, { headers });
        submitStatus = res.data.submission.status;
        submitData = res.data.submission;
        console.log("Submit status:", submitStatus);
    }
    console.log("Submit Final Verdict:", submitData.verdict);
    console.log("Submit Error:", submitData.errorMessage);
    
    process.exit(0);
}

testApi().catch(console.error);
