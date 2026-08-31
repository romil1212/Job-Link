function parseArgs(line) {
    let result = [];
    let current = "";
    let depth = 0;
    let inString = false;
    
    for (let i = 0; i < line.length; i++) {
        let c = line[i];
        
        if (c === '"' && line[i-1] !== '\\\\') {
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
        } else if (c.match(/\\s/) && depth === 0) {
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

const inputs = [
    "[2,7,11,15]\\n9",
    "2 3",
    "10 20",
    '"hello world" 42',
    "[1, 2, 3]\\n[4, 5, 6]",
    "  [1, 2, 3]   4   ",
    `{"a": 1, "b": 2} 5`
];

for (let inputStr of inputs) {
    const normalizedInput = inputStr.replace(/\\n/g, '\n');
    const lines = normalizedInput
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
        
    let args = [];
    for (let line of lines) {
        args.push(...parseArgs(line));
    }
    console.log("Input:", JSON.stringify(inputStr), "=> Args:", args);
}
