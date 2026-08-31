import fs from "fs/promises";
import path from "path";
import os from "os";
import { runInDocker } from "./dockerHelper.js";

export default {
    async execute({ sourceCode, input, timeLimit, memoryLimit }) {
        const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "joblink-exec-"));
        
        const filename = "Solution.java";
        const sourcePath = path.join(workspaceDir, filename);
        await fs.writeFile(sourcePath, sourceCode);

        const hasMain = /public\s+static\s+void\s+main\s*\(/.test(sourceCode);
        
        let runCommand = "";

        if (hasMain) {
            runCommand = "javac Solution.java && java Solution";
        } else {
            const runnerCode = String.raw`
import java.util.*;
import java.lang.reflect.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        List<String> tokens = new ArrayList<>();
        while(sc.hasNext()) {
            tokens.add(sc.next());
        }
        
        Class<?> clazz = Class.forName("Solution");
        Method targetMethod = null;
        for (Method m : clazz.getDeclaredMethods()) {
            if (Modifier.isPublic(m.getModifiers())) {
                targetMethod = m;
                break;
            }
        }
        
        if (targetMethod == null) {
            System.err.println("No public method found in Solution class.");
            System.exit(1);
        }
        
        Class<?>[] pTypes = targetMethod.getParameterTypes();
        Object[] mArgs = new Object[pTypes.length];
        
        int tokenIdx = 0;
        for (int i = 0; i < pTypes.length; i++) {
            if (tokenIdx >= tokens.size()) break;
            Class<?> pType = pTypes[i];
            String t = tokens.get(tokenIdx++);
            
            if (pType == int.class || pType == Integer.class) {
                mArgs[i] = Integer.parseInt(t);
            } else if (pType == double.class || pType == Double.class) {
                mArgs[i] = Double.parseDouble(t);
            } else if (pType == boolean.class || pType == Boolean.class) {
                mArgs[i] = Boolean.parseBoolean(t);
            } else if (pType == String.class) {
                mArgs[i] = t;
            } else {
                // Simplistic fallback
                mArgs[i] = null;
            }
        }
        
        Object instance = null;
        if (!Modifier.isStatic(targetMethod.getModifiers())) {
            instance = clazz.getDeclaredConstructor().newInstance();
        }
        
        Object res = targetMethod.invoke(instance, mArgs);
        System.out.println(res);
    }
}
`;
            await fs.writeFile(path.join(workspaceDir, "Main.java"), runnerCode);
            runCommand = "javac Solution.java Main.java && java Main";
        }

        return await runInDocker({
            workspaceDir,
            runCommand,
            input,
            timeLimit,
            memoryLimit,
            language: "java"
        });
    }
};
