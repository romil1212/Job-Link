import fs from "fs/promises";
import path from "path";
import os from "os";
import { runInDocker } from "./dockerHelper.js";

export default {
    async execute({ sourceCode, input, timeLimit, memoryLimit }) {
        const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "joblink-exec-"));
        
        const filename = "solution.py";
        const sourcePath = path.join(workspaceDir, filename);
        await fs.writeFile(sourcePath, sourceCode);

        const hasDef = /def\s+([a-zA-Z_]\w*)\s*\(/.test(sourceCode);
        
        let runCommand = "";

        if (!hasDef) {
            runCommand = "python3 solution.py";
        } else {
            const runnerCode = String.raw`
import sys
import json
import re

def parse_args(line):
    result = []
    current = ""
    depth = 0
    in_string = False
    i = 0
    while i < len(line):
        c = line[i]
        if c == '"' and (i == 0 or line[i-1] != '\\'):
            in_string = not in_string
            current += c
        elif in_string:
            current += c
        elif c in '[{':
            depth += 1
            current += c
        elif c in ']}':
            depth -= 1
            current += c
        elif c.isspace() and depth == 0:
            if current.strip():
                try:
                    result.append(json.loads(current.strip()))
                except:
                    result.append(current.strip())
                current = ""
        else:
            current += c
        i += 1
    if current.strip():
        try:
            result.append(json.loads(current.strip()))
        except:
            result.append(current.strip())
    return result

with open('solution.py', 'r') as f:
    code = f.read()

match = re.search(r'def\s+([a-zA-Z_]\w*)\s*\(', code)
if not match:
    print("Error: Could not find function definition in solution.py", file=sys.stderr)
    sys.exit(1)

func_name = match.group(1)

# Write wrapper
wrapper_code = f"""
import sys
import json
from solution import {func_name}

# copy parse_args
def parse_args(line):
    result = []
    current = ""
    depth = 0
    in_string = False
    i = 0
    while i < len(line):
        c = line[i]
        if c == '"' and (i == 0 or line[i-1] != '\\\\'):
            in_string = not in_string
            current += c
        elif in_string:
            current += c
        elif c in '[{{':
            depth += 1
            current += c
        elif c in ']}}':
            depth -= 1
            current += c
        elif c.isspace() and depth == 0:
            if current.strip():
                try:
                    result.append(json.loads(current.strip()))
                except:
                    result.append(current.strip())
                current = ""
        else:
            current += c
        i += 1
    if current.strip():
        try:
            result.append(json.loads(current.strip()))
        except:
            result.append(current.strip())
    return result

input_str = sys.stdin.read().strip()
if not input_str:
    res = {func_name}()
    print(json.dumps(res).replace(" ", "") if res is not None else "None")
else:
    normalized = input_str.replace('\\\\n', '\\n')
    lines = [L.strip() for L in normalized.splitlines() if L.strip()]
    args = []
    for line in lines:
        args.extend(parse_args(line))
    
    res = {func_name}(*args)
    print(json.dumps(res).replace(" ", "") if res is not None else "None")
"""

with open('wrapped_solution.py', 'w') as f:
    f.write(wrapper_code)
`;
            await fs.writeFile(path.join(workspaceDir, "runner.py"), runnerCode);
            runCommand = "python3 runner.py && python3 wrapped_solution.py";
        }

        return await runInDocker({
            workspaceDir,
            runCommand,
            input,
            timeLimit,
            memoryLimit,
            language: "python"
        });
    }
};
