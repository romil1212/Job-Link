import fs from "fs/promises";
import path from "path";
import os from "os";
import { runInDocker } from "./dockerHelper.js";

export default {
    async execute({ sourceCode, input, timeLimit, memoryLimit }) {
        const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "joblink-exec-"));
        
        const filename = "solution.cpp";
        const sourcePath = path.join(workspaceDir, filename);
        await fs.writeFile(sourcePath, sourceCode);

        const runCommand = "g++ -O2 solution.cpp -o solution && ./solution";

        return await runInDocker({
            workspaceDir,
            runCommand,
            input,
            timeLimit,
            memoryLimit,
            language: "cpp"
        });
    }
};
