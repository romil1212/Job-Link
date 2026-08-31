import { Queue } from "bullmq";
import IORedis from "ioredis";

// Centralized Redis connection
const connection = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
});

connection.on("error", (err) => {
    console.error("[Redis Error]", err);
});

// The submission queue
export const submissionQueue = new Queue("SubmissionQueue", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});
