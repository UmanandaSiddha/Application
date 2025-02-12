import { jobOptions, redisConnection, subscriptionQueueName } from "../../config/queue.js";
import { Job, Queue, Worker } from "bullmq";
import logger from "../../config/logger.js";
import { redis } from "../../index.js";
import subscriptionwebhook from "../webhook/subscription.webhook.js";

export const subscriptionQueue = new Queue(subscriptionQueueName, {
    connection : redisConnection,
    defaultJobOptions: jobOptions
});

interface SubscriptionData {
    [key: string]: any;
}

export const addSubscriptionToQueue = async (data: SubscriptionData): Promise<void> => {
    const result: number = await redis.xlen("bull:subscription-queue:events");
    if (result > 0) {
        await redis.del("bull:subscription-queue:events");
    }

    const id: string | null = await redis.get("bull:subscription-queue:id");
    if (id !== null && Number(id) > 99) {
        await redis.set("bull:subscription-queue:id", "0");
    }

    await subscriptionQueue.add("Subscription Queue", data); 
};

const worker = new Worker<SubscriptionData>(subscriptionQueueName, async (job: Job<SubscriptionData>) => {
    await subscriptionwebhook(job.data);
}, { connection: redisConnection });

worker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
    logger.info(`Job ${job.id} has completed!`);
});

worker.on("failed", async (job: Job<SubscriptionData> | undefined, err: Error, prev?: string) => {
    if (!job) {
        console.log(`A job has failed but job details are missing.`);
        logger.error(`A job has failed but job details are missing.`);
        return;
    }
    
    console.log(`Job ${job.id} has failed with ${err.message}`);
    logger.error(`Job ${job.id} has failed with ${err.message}`);
});