import { Queue, Worker } from "bullmq";
import { emailQueueName, jobOptions, redisConnection } from "../config/queue.js";
import sendEmail from "./sendEmail.js";

export const emailQueue = new Queue(emailQueueName, {
    connection : redisConnection,
    defaultJobOptions: jobOptions
});

// await emailQueue.add("Email Queueing", queueData); we will need this

const worker = new Worker(emailQueueName, async (job) => {
    const { email, subject, message } = job.data;
    await sendEmail({
        email,
        subject,
        message
    });
}, { connection: redisConnection });

worker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', async (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});



