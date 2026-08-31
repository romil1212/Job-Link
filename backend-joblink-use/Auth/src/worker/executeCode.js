import { spawn, exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

const TIMEOUT_OFFSET = 500; // Add 500ms to wall-clock timeout to allow process to exit gracefully before SIGKILL

/**
 * Executes a single test case inside a strictly isolated Docker sandbox.
 */
export async function executeCode({ language, sourceCode, input, timeLimit, memoryLimit }) {
    return new Promise(async (resolve, reject) => {
        // Create a unique temporary directory for this execution
        const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "joblink-exec-"));
        
        let filename = "";
        let runCommand = "";

        switch (language) {
            case "javascript":
                filename = "solution.js";
                runCommand = "node runner.js";
                break;
            case "python":
                filename = "solution.py";
                runCommand = "python3 solution.py";
                break;
            case "java":
                filename = "Solution.java";
                runCommand = "javac Solution.java && java Solution";
                break;
            case "cpp":
                filename = "solution.cpp";
                runCommand = "g++ -O2 solution.cpp -o solution && ./solution";
                break;
            default:
                await fs.rm(workspaceDir, { recursive: true, force: true });
                return resolve({ status: "SYSTEM_ERROR", error: "Unsupported language" });
        }

        const sourcePath = path.join(workspaceDir, filename);
        await fs.writeFile(sourcePath, sourceCode);

        if (language === "javascript") {
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
    
    console.error("DEBUG ARGS:", JSON.stringify(args));
    
    const result = func(...args);
    console.log(result === undefined ? "undefined" : JSON.stringify(result));
}
`;
            await fs.writeFile(path.join(workspaceDir, "runner.js"), runnerCode);
        }

        // Calculate limits
        const memLimitMB = memoryLimit || 256;
        const timeLimitMs = timeLimit || 2000;

        const containerName = `joblink-exec-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

        // Docker args for isolation
        const dockerArgs = [
            "run",
            "--rm",                      // Remove container after execution
            "--name", containerName,     // Unique name for explicit cleanup
            "-i",                        // Interactive (keep STDIN open)
            `--memory=${memLimitMB}m`,   // Memory limit
            `--memory-swap=${memLimitMB}m`, // Disable swap
            "--cpus=1.0",                // 1 CPU core
            "--pids-limit=64",           // Prevent fork bombs
            "--network=none",            // No internet access
            "--read-only",               // Read-only filesystem
            "--security-opt=no-new-privileges", // No new privileges
            "--cap-drop=ALL",            // Drop all root capabilities
            "-v", `${workspaceDir}:/workspace`, // Mount workspace
            "-w", "/workspace",          // Set working dir
            "node:20-alpine",            // Using a generic image (should ideally be a custom multi-lang image, but node alpine works for JS. For all languages, we assume a custom 'joblink-runner' image exists. We will use 'joblink-runner' in production. For now, let's assume 'joblink-runner' exists and has node, python, openjdk, gcc)
        ];

        // For this implementation, we will use a hypothetical 'joblink-runner:latest' image
        // which contains Node, Python, Java, and G++. 
        // If not present, we will fallback to alpine and install them, but in production it's pre-built.
        // To be safe for the architecture plan, we just specify 'joblink-runner:latest'.
        // Actually, to make it runnable without a custom image right away, let's use a standard alpine and install inline for cpp/java/python if needed, 
        // OR just assume 'joblink-runner' is built by the user. Let's use 'joblink-runner'.

        dockerArgs[dockerArgs.length - 1] = "joblink-runner"; // Replace image
        
        dockerArgs.push("sh", "-c", runCommand);

        let stdout = "";
        let stderr = "";
        let startTime = Date.now();

        const child = spawn("docker", dockerArgs);

        const cleanupContainer = async () => {
            try {
                await execAsync(`docker rm -f ${containerName}`);
            } catch (err) {
                // Ignore, container might already be gone
            }
        };

        // Setup Timeout
        const timeoutTimer = setTimeout(() => {
            cleanupContainer().then(() => {
                child.kill('SIGKILL');
            });
        }, timeLimitMs + TIMEOUT_OFFSET);

        // Write input to stdin
        if (input) {
            child.stdin.write(input);
        }
        child.stdin.end();

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("close", async (code) => {
            clearTimeout(timeoutTimer);
            await cleanupContainer();
            const runtime = Date.now() - startTime;

            // Cleanup workspace
            try {
                await fs.rm(workspaceDir, { recursive: true, force: true });
            } catch (cleanupErr) {
                console.error(`Failed to cleanup workspace ${workspaceDir}:`, cleanupErr.message);
            }
            if (code === 137 || runtime > timeLimitMs) {
                // 137 is usually OOM or SIGKILL
                // We disambiguate by checking runtime
                if (runtime >= timeLimitMs) {
                    return resolve({ status: "TIME_LIMIT_EXCEEDED", runtime, stdout, stderr });
                } else {
                    return resolve({ status: "MEMORY_LIMIT_EXCEEDED", runtime, stdout, stderr });
                }
            }

            if (code !== 0) {
                // If it's Java/C++ and failed compilation, we classify as COMPILATION_ERROR 
                // but since it's a single sh command, it's hard to distinguish strictly without parsing stderr.
                // For now, any non-zero exit is RUNTIME_ERROR (or CE).
                const isCompileError = stderr.toLowerCase().includes("error: ") || stderr.toLowerCase().includes("exception");
                const status = (language === "java" || language === "cpp") && isCompileError && runtime < timeLimitMs ? "COMPILATION_ERROR" : "RUNTIME_ERROR";
                return resolve({ status, runtime, stdout, stderr, error: stderr });
            }

            resolve({
                status: "SUCCESS",
                runtime,
                stdout: stdout.trim(),
                stderr: stderr.trim()
            });
        });

        child.on("error", async (err) => {
            clearTimeout(timeoutTimer);
            await cleanupContainer();
            try {
                await fs.rm(workspaceDir, { recursive: true, force: true });
            } catch (cleanupErr) {
                console.error(`Failed to cleanup workspace ${workspaceDir}:`, cleanupErr.message);
            }
            resolve({ status: "SYSTEM_ERROR", error: err.message });
        });
    });
}
