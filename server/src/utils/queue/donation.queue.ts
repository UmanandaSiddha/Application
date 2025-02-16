import { donationQueueName, jobOptions, redisConnection } from "../../config/queue.js";
import { Job, Queue, Worker } from "bullmq";
import logger from "../../config/logger.js";
import { redis } from "../../index.js";
import donationWebhook from "../webhook/donation.webhook.js";

export const donationQueue = new Queue(donationQueueName, {
    connection : redisConnection,
    defaultJobOptions: jobOptions
});

interface DonationData {
    [key: string]: any;
}

export const addDonationToQueue = async (data: DonationData): Promise<void> => {
    const result: number = await redis.xlen("bull:donation-queue:events");
    if (result > 0) {
        await redis.del("bull:donation-queue:events");
    }

    const id: string | null = await redis.get("bull:donation-queue:id");
    if (id !== null && Number(id) > 99) {
        await redis.set("bull:donation-queue:id", "0");
    }

    await donationQueue.add("Donation Queue", data);
};

const worker = new Worker<DonationData>(donationQueueName, async (job: Job<DonationData>) => {
    await donationWebhook(job.data);
}, { connection: redisConnection });

worker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
    logger.info(`Job ${job.id} has completed!`);
});

worker.on("failed", async (job: Job<DonationData> | undefined, err: Error, prev?: string) => {
    if (!job) {
        console.log(`A job has failed but job details are missing.`);
        logger.error(`A job has failed but job details are missing.`);
        return;
    }
    
    console.log(`Job ${job.id} has failed with ${err.message}`);
    logger.error(`Job ${job.id} has failed with ${err.message}`);
});