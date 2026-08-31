import { executeCode } from "./src/worker/executeCode.js";
import fs from "fs";
import path from "path";

async function run() {
    const result = await executeCode({
        language: "javascript",
        sourceCode: `function twoSum(a, b) {\n    return a + b;\n}`,
        input: "2 3",
        timeLimit: 1000,
        memoryLimit: 256
    });
    console.log(result);
}

run();
