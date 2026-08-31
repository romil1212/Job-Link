import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Submission from './src/models/submission.model.js';

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const s = await Submission.findById('6a8d059e9a7b7657f8be4f56');
    console.log(JSON.stringify(s, null, 2));
    process.exit(0);
});
