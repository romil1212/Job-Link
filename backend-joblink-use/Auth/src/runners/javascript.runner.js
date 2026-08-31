import fs from "fs/promises";
import path from "path";
import os from "os";
import { runInDocker } from "./dockerHelper.js";

export default {
    async execute({ sourceCode, input, timeLimit, memoryLimit }) {
        const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "joblink-exec-"));
        
        const filename = "solution.js";
        const sourcePath = path.join(workspaceDir, filename);
        await fs.writeFile(sourcePath, sourceCode);

        const runnerCode = String.raw`
const fs = require('fs');

const userCode = fs.readFileSync('solution.js', 'utf-8');

const regex = /(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:function|\([^)]*\)\s*=>|[a-zA-Z_$][a-zA-Z0-9_$]*\s*=>))/;
const match = userCode.match(regex);

if (!match) {
    console.error("Could not find a valid function definition in your code.");
    process.exit(1);
}

const funcName = match[1] || match[2];

const wrappedCode = userCode + '\nmodule.exports = ' + funcName + ';';
fs.writeFileSync('wrappedSolution.js', wrappedCode);

const func = require('./wrappedSolution.js');

function parseArgs(line) {
    let result = [];
    let current = "";
    let depth = 0;
    let inString = false;
    
    for (let i = 0; i < line.length; i++) {
        let c = line[i];
        if (c === '"' && line[i-1] !== '\\') {
            inString = !inString;
            current += c;
        } else if (inString) {
            current += c;
        } else if (c === '[' || c === '{') {
            depth++;
            current += c;
        } else if (c === ']' || c === '}') {
            depth--;
            current += c;
        } else if (c.match(/\s/) && depth === 0) {
            if (current.trim().length > 0) {
                try { result.push(JSON.parse(current.trim())); } 
                catch(e) { result.push(current.trim()); }
                current = "";
            }
        } else {
            current += c;
        }
    }
    if (current.trim().length > 0) {
        try { result.push(JSON.parse(current.trim())); } 
        catch(e) { result.push(current.trim()); }
    }
    return result;
}

const inputStr = fs.readFileSync(0, 'utf-8').trim();
if (!inputStr) {
    const result = func();
    console.log(result === undefined ? "undefined" : JSON.stringify(result));
} else {
    const normalizedInput = inputStr.replace(/\\n/g, '\n');
    const lines = normalizedInput
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
        
    let args = [];
    for (let line of lines) {
        args.push(...parseArgs(line));
    }
    
    const result = func(...args);
    console.log(result === undefined ? "undefined" : JSON.stringify(result));
}
`;
        await fs.writeFile(path.join(workspaceDir, "runner.js"), runnerCode);
        const runCommand = "node runner.js";

        return await runInDocker({
            workspaceDir,
            runCommand,
            input,
            timeLimit,
            memoryLimit,
            language: "javascript"
        });
    }
};
