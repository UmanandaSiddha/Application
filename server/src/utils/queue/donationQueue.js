import { donationQueueName, jobOptions, redisConnection } from "../../config/queue.js";
import { Queue, Worker } from "bullmq";
import { redis } from "../../server.js";
import logger from "../../config/logger.js";
import donationWebhook from "../webhook/donationWebhook.js";

export const donationQueue = new Queue(donationQueueName, {
    connection : redisConnection,
    defaultJobOptions: jobOptions
});

export const addDonationToQueue = async (data) => {
    const result = await redis.xlen("bull:donation-queue:events");
    if (result > 0) {
        await redis.del("bull:donation-queue:events");
    }

    const id = await redis.get("bull:donation-queue:id");
    if (Number(id) > 99) {
        await redis.set("bull:donation-queue:id", "0");
    }

    await donationQueue.add("Donation Queue", data); 
};

const worker = new Worker(donationQueueName, async (job) => {
    await donationWebhook(job.data);
}, { connection: redisConnection });

worker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
    logger.info(`Job ${job.id} has completed!`);
});

worker.on('failed', async (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
    logger.error(`${job.id} has failed with ${err.message}`);
});