import { execSync } from 'child_process';
import axios from 'axios';
import fs from 'fs/promises';

const API_URL = 'http://localhost:3001/api';

const authHeader = {
    headers: { 'Authorization': `Bearer TEST_TOKEN` }
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getAdminToken() {
    const res = await axios.post(`${API_URL}/auth/test-login-admin`);
    return res.data.accessToken;
}

async function runScenario(name, language, sourceCode, expectedStatus) {
    console.log(`\n===========================================`);
    console.log(`Running Scenario: ${name}`);
    
    try {
        const token = await getAdminToken();
        authHeader.headers['Authorization'] = `Bearer ${token}`;

        const res = await axios.post(`${API_URL}/submissions/submit`, {
            problemId: 'two-sum-e2e',
            language,
            sourceCode
        }, authHeader);

        const subId = res.data.submission._id;
        
        let status = 'QUEUED';
        let finalData = null;

        process.stdout.write("Polling ");
        while (status === 'QUEUED' || status === 'PROCESSING' || status === 'RUNNING') {
            process.stdout.write(".");
            await wait(1000);
            const statRes = await axios.get(`${API_URL}/submissions/${subId}`, authHeader);
            finalData = statRes.data.submission;
            status = finalData.status;
        }

        console.log(`\nFinished with verdict: ${finalData.verdict}`);
        
        if (finalData.verdict !== expectedStatus) {
            console.log(`❌ FAILED. Expected ${expectedStatus}, got ${finalData.verdict}`);
        } else {
            console.log(`✅ PASSED.`);
        }
    } catch (e) {
        console.log(`❌ API Error:`, e.response?.data || e.message);
    }

    // Verify Docker cleanup
    const ps = execSync('docker ps --format "{{.Names}}"').toString();
    const isClean = !ps.includes('joblink-exec-');
    if (isClean) {
        console.log(`✅ Docker cleanup verified. No stale containers.`);
    } else {
        console.log(`❌ DOCKER CLEANUP FAILED! Stale containers found:\n${ps}`);
    }
}

async function main() {
    // 1. Correct
    await runScenario("Correct JS", "javascript", 
`const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
console.log(parseInt(input[0]) + parseInt(input[1]));`,
    "ACCEPTED");

    // 2. Wrong Answer
    await runScenario("Wrong Answer JS", "javascript",
`console.log("wrong");`,
    "WRONG_ANSWER");

    // 3. Runtime Error
    await runScenario("Runtime Error JS", "javascript",
`throw new Error("Crash");`,
    "RUNTIME_ERROR");

    // 4. Timeout
    await runScenario("Timeout JS", "javascript",
`while(true) {}`,
    "TIME_LIMIT_EXCEEDED");

    // 5. Compilation Error (Java)
    await runScenario("Compilation Error Java", "java",
`public class Solution { public static void main(String[] args) { error } }`,
    "COMPILATION_ERROR");
}

main().catch(console.error);
