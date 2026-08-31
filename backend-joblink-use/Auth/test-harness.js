import { executeCode } from "./src/worker/executeCode.js";

async function runTests() {
    console.log("Starting tests...");

    const testCases = [
        {
            name: "TEST 1: Input 2 3",
            sourceCode: `function twoSum(a, b) {\n    return a + b;\n}`,
            input: "2 3",
            expectedVerdict: "SUCCESS",
            expectedOutput: "5"
        },
        {
            name: "TEST 2: Input 10 20",
            sourceCode: `function twoSum(a, b) {\n    return a + b;\n}`,
            input: "10 20",
            expectedVerdict: "SUCCESS",
            expectedOutput: "30"
        },
        {
            name: "TEST 3: Input [2,7,11,15]\\n9",
            sourceCode: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
            input: "[2,7,11,15]\n9",
            expectedVerdict: "SUCCESS",
            expectedOutput: "[0,1]"
        },
        {
            name: "TEST 4: Wrong answer (2 3 -> -1)",
            sourceCode: `function twoSum(a, b) {\n    return a - b;\n}`,
            input: "2 3",
            expectedVerdict: "SUCCESS",
            expectedOutput: "-1"
        },
        {
            name: "TEST 5: Runtime error",
            sourceCode: `function twoSum(a, b) {\n    throw new Error("test error");\n}`,
            input: "2 3",
            expectedVerdict: "RUNTIME_ERROR",
            expectedOutput: null
        },
        {
            name: "TEST 6: Windows CRLF input",
            sourceCode: `function twoSum(a, b) {\n    return a + b;\n}`,
            input: "10\r\n20",
            expectedVerdict: "SUCCESS",
            expectedOutput: "30"
        },
        {
            name: "TEST 7: Literal \\\\n input",
            sourceCode: `function twoSum(a, b) {\n    return a + b;\n}`,
            input: "10\\n20",
            expectedVerdict: "SUCCESS",
            expectedOutput: "30"
        }
    ];

    let passed = 0;
    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        console.log("\\n==================================");
        console.log("Running " + tc.name + "...");
        const result = await executeCode({
            language: "javascript",
            sourceCode: tc.sourceCode,
            input: tc.input,
            timeLimit: 3000,
            memoryLimit: 256
        });

        console.log("Expected Status: " + tc.expectedVerdict + " | Actual Status: " + result.status);
        if (result.status === tc.expectedVerdict) {
            if (tc.expectedVerdict === "SUCCESS") {
                console.log("Expected Output: " + tc.expectedOutput + " | Actual Output: " + result.stdout);
                if (result.stdout === tc.expectedOutput) {
                    console.log("✅ PASSED");
                    passed++;
                } else {
                    console.log("❌ FAILED (Output mismatch)");
                }
            } else {
                console.log("✅ PASSED (Error Output/Stderr: " + (result.stderr || result.error) + ")");
                passed++;
            }
        } else {
            console.log("❌ FAILED (Status mismatch)");
        }
    }

    console.log("\\n" + passed + "/" + testCases.length + " manual tests passed.");
}

runTests();
