import { spawn, exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);
const TIMEOUT_OFFSET = 500; 

export async function runInDocker({ workspaceDir, runCommand, input, timeLimit, memoryLimit, language }) {
    return new Promise(async (resolve) => {
        const memLimitMB = memoryLimit || 256;
        const timeLimitMs = timeLimit || 2000;
        const containerName = `joblink-exec-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

        const dockerArgs = [
            "run", "--rm", "--name", containerName, "-i",
            `--memory=${memLimitMB}m`, `--memory-swap=${memLimitMB}m`,
            "--cpus=1.0", "--pids-limit=64", "--network=none",
            "--read-only", "--security-opt=no-new-privileges",
            "--cap-drop=ALL", "-v", `${workspaceDir}:/workspace`,
            "-w", "/workspace", "joblink-runner:latest",
            "sh", "-c", runCommand
        ];

        let stdout = "";
        let stderr = "";
        let startTime = Date.now();

        const child = spawn("docker", dockerArgs);

        const cleanupContainer = async () => {
            try {
                await execAsync(`docker rm -f ${containerName}`);
            } catch (err) {}
        };

        const timeoutTimer = setTimeout(() => {
            cleanupContainer().then(() => child.kill('SIGKILL'));
        }, timeLimitMs + TIMEOUT_OFFSET);

        if (input) {
            child.stdin.write(input);
        }
        child.stdin.end();

        child.stdout.on("data", (data) => stdout += data.toString());
        child.stderr.on("data", (data) => stderr += data.toString());

        child.on("close", async (code) => {
            clearTimeout(timeoutTimer);
            await cleanupContainer();
            const runtime = Date.now() - startTime;

            try {
                await fs.rm(workspaceDir, { recursive: true, force: true });
            } catch (err) {}

            if (code === 137 || runtime > timeLimitMs) {
                if (runtime >= timeLimitMs) {
                    return resolve({ status: "TIME_LIMIT_EXCEEDED", runtime, stdout, stderr });
                } else {
                    return resolve({ status: "MEMORY_LIMIT_EXCEEDED", runtime, stdout, stderr });
                }
            }

            if (code !== 0) {
                const isCompileError = stderr.toLowerCase().includes("error: ") || stderr.toLowerCase().includes("exception");
                const status = (language === "java" || language === "cpp" || language === "c") && isCompileError && runtime < timeLimitMs ? "COMPILATION_ERROR" : "RUNTIME_ERROR";
                return resolve({ status, runtime, stdout, stderr, error: stderr });
            }

            resolve({ status: "SUCCESS", runtime, stdout: stdout.trim(), stderr: stderr.trim() });
        });

        child.on("error", async (err) => {
            clearTimeout(timeoutTimer);
            await cleanupContainer();
            try { await fs.rm(workspaceDir, { recursive: true, force: true }); } catch (e) {}
            resolve({ status: "SYSTEM_ERROR", error: err.message });
        });
    });
}
