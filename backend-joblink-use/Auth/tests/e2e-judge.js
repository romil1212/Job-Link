import mongoose from 'mongoose';
import config from '../src/config/config.js';
import axios from 'axios';
import { generateAccessToken } from '../src/utils/token.js';
import User from '../src/models/user.model.js';
import Problem from '../src/models/problem.model.js';
import TestCase from '../src/models/testCase.model.js';

const API_URL = 'http://localhost:3001/api';

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected.");

    // Ensure user exists
    let user = await User.findOne({ username: 'e2etester' });
    if (!user) {
        user = await User.create({
            fullName: 'E2E Tester',
            username: 'e2etester',
            email: 'e2e@example.com',
            password: 'password123',
            verified: true,
            role: 'user'
        });
    }

    const token = generateAccessToken({ id: user._id });
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    // Setup 'Two Sum' problem
    let problem = await Problem.findOne({ slug: 'two-sum-e2e' });
    if (!problem) {
        problem = await Problem.create({
            title: 'Two Sum E2E',
            slug: 'two-sum-e2e',
            description: 'E2E Test Problem',
            difficulty: 'easy',
            category: 'Array',
            supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
            starterCode: [
                { language: "javascript", code: "function add(a, b) {\n    return a + b;\n}" },
                { language: "python", code: "def add(a, b):\n    return a + b" },
                { language: "cpp", code: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Code here\n    return 0;\n}" },
                { language: "java", code: "class Solution {\n    public static void main(String[] args) {\n        // Code here\n    }\n}" }
            ],
            timeLimit: 5000,
            memoryLimit: 256,
            createdBy: user._id
        });
    }

    let tcs = await TestCase.find({ problem: problem._id });
    if (tcs.length === 0) {
        // Add 1 public test case
        await TestCase.create({
            problem: problem._id,
            input: '2\n3\n',
            expectedOutput: '5',
            isHidden: false,
            createdBy: user._id
        });

        // Add 1 hidden test case
        await TestCase.create({
            problem: problem._id,
            input: '10\n20\n',
            expectedOutput: '30',
            isHidden: true,
            createdBy: user._id
        });
    }

    const scenarios = [
        {
            name: "A. Correct JavaScript solution",
            lang: "javascript",
            code: "function add(a, b) { return a + b; }",
            isRun: false,
            expected: "ACCEPTED"
        },
        {
            name: "B. Incorrect JavaScript solution",
            lang: "javascript",
            code: "function add(a, b) { return a * b; }",
            isRun: false,
            expected: "WRONG_ANSWER"
        },
        {
            name: "C. Controlled JavaScript runtime error",
            lang: "javascript",
            code: "function add(a, b) { throw new Error('Boom'); }",
            isRun: false,
            expected: "RUNTIME_ERROR"
        },
        {
            name: "D. Controlled infinite loop (JS)",
            lang: "javascript",
            code: "function add(a, b) { while(true) {} }",
            isRun: false,
            expected: "TIME_LIMIT_EXCEEDED"
        },
        {
            name: "E. Java compilation error",
            lang: "java",
            code: "public class Solution { public static void main(String[] args) { int x = \"string\"; } }",
            isRun: false,
            expected: "COMPILATION_ERROR"
        },
        {
            name: "F. C++ compilation error",
            lang: "cpp",
            code: "#include <iostream>\nint main() { std::cout << undefined_var; return 0; }",
            isRun: false,
            expected: "COMPILATION_ERROR"
        },
        {
            name: "G. Correct Python solution",
            lang: "python",
            code: "import sys\nlines = sys.stdin.read().split()\nprint(int(lines[0]) + int(lines[1]))",
            isRun: false,
            expected: "ACCEPTED"
        },
        {
            name: "H. Correct Java solution",
            lang: "java",
            code: "import java.util.Scanner;\npublic class Solution {\npublic static void main(String[] args) {\nScanner sc = new Scanner(System.in);\nint a = sc.nextInt();\nint b = sc.nextInt();\nSystem.out.println(a + b);\n}\n}",
            isRun: false,
            expected: "ACCEPTED"
        },
        {
            name: "I. Correct C++ solution",
            lang: "cpp",
            code: "#include <iostream>\nusing namespace std;\nint main() {\nint a, b;\ncin >> a >> b;\ncout << (a + b) << endl;\nreturn 0;\n}",
            isRun: false,
            expected: "ACCEPTED"
        },
        {
            name: "J. RUN uses only public test cases",
            lang: "python",
            code: "import sys\nlines = sys.stdin.read().split()\nprint(int(lines[0]) + int(lines[1]))",
            isRun: true,
            expected: "ACCEPTED",
            verifyTestCount: 1 // Only 1 public test case should be executed
        }
    ];

    let allPassed = true;

    for (const sc of scenarios) {
        console.log(`\n===========================================`);
        console.log(`Running Scenario: ${sc.name}`);
        const endpoint = sc.isRun ? '/submissions/run' : '/submissions';
        try {
            const res = await axios.post(`${API_URL}${endpoint}`, {
                problemId: problem._id,
                language: sc.lang,
                sourceCode: sc.code
            }, authHeader);
            
            const subId = res.data.submissionId;
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

            if (finalData.verdict !== sc.expected) {
                console.error(`❌ FAILED. Expected ${sc.expected}, got ${finalData.verdict}`);
                if (finalData.errorMessage) console.error(finalData.errorMessage);
                allPassed = false;
            } else {
                console.log(`✅ PASSED.`);
                if (sc.verifyTestCount) {
                    if (finalData.totalTestCases !== sc.verifyTestCount) {
                        console.error(`❌ FAILED test count. Expected ${sc.verifyTestCount}, got ${finalData.totalTestCases}`);
                        allPassed = false;
                    } else {
                        console.log(`✅ Test count matched: ${sc.verifyTestCount}`);
                    }
                }
            }
            
            // Verify Docker cleanup
            const { execSync } = await import('child_process');
            const ps = execSync('docker ps --format "{{.Names}}"').toString();
            const isClean = !ps.includes('joblink-exec-');
            if (isClean) {
                console.log(`✅ Docker cleanup verified. No stale containers.`);
            } else {
                console.error(`❌ DOCKER CLEANUP FAILED! Stale containers found:\n${ps}`);
                allPassed = false;
            }
        } catch (err) {
            console.error(`❌ API Error for ${sc.name}:`, err.response?.data || err.message);
            allPassed = false;
        }
    }

    if (allPassed) {
        console.log("\n✅ ALL SCENARIOS PASSED!");
    } else {
        console.log("\n❌ SOME SCENARIOS FAILED.");
    }
    
    mongoose.connection.close();
}

run();
