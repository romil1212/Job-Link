import { executeCode } from './src/worker/executeCode.js';

async function test() {
    console.log("Starting executeCode...");
    try {
        const result = await executeCode({
            language: 'javascript',
            sourceCode: "const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');\nconsole.log(parseInt(input[0]) + parseInt(input[1]));",
            input: '2\n3\n',
            timeLimit: 2000,
            memoryLimit: 256
        });
        console.log("Result:", result);
    } catch (e) {
        console.error("Exception:", e);
    }
}
test();
