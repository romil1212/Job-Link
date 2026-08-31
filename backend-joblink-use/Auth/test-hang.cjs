const fs = require('fs');
const userCode = `function add(a, b) { while(true) {} }`;
const wrappedCode = userCode + '\nmodule.exports = add;';
fs.writeFileSync('wrappedSolution.js', wrappedCode);
const func = require('./wrappedSolution.js');
console.log("Calling func...");
func(2, 3);
console.log("Finished!");
