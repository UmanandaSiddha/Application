export const subscriptionQueueName = "subscription-queue";
export const donationQueueName = "donation-queue";

export const redisConnection = {
    host: process.env.REDIS_HOST, 
    port: process.env.REDIS_PORT,        
}

export const jobOptions = {
    removeOnComplete: true,
    attempts: 2,
    backoff: {
        type: "exponential",
        delay: 1000
    }
}
