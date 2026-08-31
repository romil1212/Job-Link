import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import TestCase from './src/models/testCase.model.js';
import Problem from './src/models/problem.model.js';

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const p = await Problem.findOne({ title: 'Two Sum E2E' });
    const tcs = await TestCase.find({ problem: p._id }).sort({ order: 1 });
    console.log("Found test cases: " + tcs.length);
    tcs.forEach(tc => {
        console.log("---");
        console.log("Hidden: " + tc.isHidden);
        console.log("Input: " + JSON.stringify(tc.input));
        console.log("Expected Output: " + JSON.stringify(tc.expectedOutput));
    });
    process.exit(0);
});
