export type Plan = {
    _id: string;
    name: string;
    amount: number;
    cards: number;
    description: string;
    planType: string,
    visible: boolean;
    period: string;
    interval: number;
    razorPlanId: string;
}

export type Subscription = {
    _id: string;
    planId: {
        _id: string;
        name: string;
        amount: number;
    }
    razorSubscriptionId: string;
    start: Date;
    end: Date;
    nextBilling: Date;
    totalCount: number;
    paidCount: number;
    remainingCount: number;
    shortUrl: string;
    status: string;
    user: string | null;
    currentStart: Date;
    currentEnd: Date;
    subscriptionType: string;
    paymentMethod: {
        methodType: string;
        cardInfo: {
            cardType: string;
            issuer: string;
            last4: string;
            name: string;
            network: string;
        } | null;
        bankInfo: string | null;
        walletInfo: string | null;
        upiInfo: string | null;
    },
    donator: string | null;
}

export type Transaction = {
    _id: string;
    amount: number;
    start: Date;
    end: Date;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    user: string | null;
    error: {
        error_code: string | null;
        error_description: string | null;
        error_source: string | null;
        error_step: string | null;
        error_reason: string | null;
    }
    transactionFor: string;
    transactionType: string;
    currency: string;
    paymentMethod: {
        methodType: string;
        cardInfo: {
            cardType: string;
            issuer: string;
            last4: string;
            name: string;
            network: string;
        } | null;
        bankInfo: string | null;
        walletInfo: string | null;
        upiInfo: string | null;
    },
    donator: string | null;
}