import { Queue, Worker } from "bullmq";
import { emailQueueName, jobOptions, redisConnection } from "../../config/queue.js";
import sendEmail from "../services/sendEmail.js";
import { redis } from "../../server.js";
import logger from "../../config/logger.js";

export const emailQueue = new Queue(emailQueueName, {
    connection : redisConnection,
    defaultJobOptions: jobOptions
});

export const addEmailToQueue = async (data) => {
    const result = await redis.xlen("bull:email-queue:events");
    if (result > 0) {
        await redis.del("bull:email-queue:events");
    }

    const id = await redis.get("bull:email-queue:id");
    if (Number(id) > 99) {
        await redis.set("bull:email-queue:id", "0");
    }

    const { email, subject, message } = data;
    await emailQueue.add("Email Queueing", {
        email,
        subject,
        message,
    }); 
};

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
    logger.info(`Job ${job.id} has completed!`);
});

worker.on('failed', async (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
    logger.error(`${job.id} has failed with ${err.message}`);
});



