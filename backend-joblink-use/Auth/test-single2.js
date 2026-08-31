import { executeCode } from "./src/worker/executeCode.js";

async function run() {
    const result = await executeCode({
        language: "javascript",
        sourceCode: `function add(a, b) {\n    return a + b;\n}`,
        input: "2\n3\n",
        timeLimit: 3000,
        memoryLimit: 256
    });
    console.log(result);
}

run();
