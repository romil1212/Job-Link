import { runInDocker } from "./dockerHelper.js";
import javascriptRunner from "./javascript.runner.js";
import pythonRunner from "./python.runner.js";
import javaRunner from "./java.runner.js";
import cppRunner from "./cpp.runner.js";
import cRunner from "./c.runner.js";

const runners = {
    javascript: javascriptRunner,
    python: pythonRunner,
    java: javaRunner,
    cpp: cppRunner,
    c: cRunner
};

export async function executeCode({ language, sourceCode, input, timeLimit, memoryLimit }) {
    const runner = runners[language];
    if (!runner) {
        return { status: "SYSTEM_ERROR", error: "Unsupported language" };
    }
    
    return runner.execute({ sourceCode, input, timeLimit, memoryLimit });
}
