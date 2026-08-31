
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
