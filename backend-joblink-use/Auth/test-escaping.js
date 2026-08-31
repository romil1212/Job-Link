const runnerCode = `
let normalizedInput = inputStr;
normalizedInput = normalizedInput.replace(/\\\\n/g, '\\n');
const lines = normalizedInput.split('\\n');
`;
console.log(runnerCode);
