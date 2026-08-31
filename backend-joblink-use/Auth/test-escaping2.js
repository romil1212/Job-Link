const runnerCode = `
    const normalizedInput = inputStr.replace(/\\\\n/g, "\\n");

    const lines = normalizedInput
        .split(/\\r?\\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
`;
console.log(runnerCode);
