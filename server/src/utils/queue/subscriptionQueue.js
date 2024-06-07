import { jobOptions, redisConnection, subscriptionQueueName } from "../../config/queue.js";
import { Queue, Worker } from "bullmq";
import { redis } from "../../server.js";
import logger from "../../config/logger.js";
import subscriptionwebhook from "../webhook/subscriptionWebhook.js";

export const subscriptionQueue = new Queue(subscriptionQueueName, {
    connection : redisConnection,
    defaultJobOptions: jobOptions
});

export const addSubscriptionToQueue = async (data) => {
    const result = await redis.xlen("bull:subscription-queue:events");
    if (result > 0) {
        await redis.del("bull:subscription-queue:events");
    }

    const id = await redis.get("bull:subscription-queue:id");
    if (Number(id) > 99) {
        await redis.set("bull:subscription-queue:id", "0");
    }

    await subscriptionQueue.add("Subscription Queue", data); 
};

const worker = new Worker(subscriptionQueueName, async (job) => {
    await subscriptionwebhook(job.data);
}, { connection: redisConnection });

worker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
    logger.info(`Job ${job.id} has completed!`);
    console.log("Completeing", new Date(Date.now()).toLocaleString());
});

worker.on('failed', async (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
    logger.error(`${job.id} has failed with ${err.message}`);
});