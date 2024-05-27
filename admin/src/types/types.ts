export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    image: string;
    googleId: string;
    isVerified: boolean;
    isBlocked: boolean;
    isDeactivated: boolean;
    donator: boolean;
    accountType: string;
    loginAttempt: {
        count: number;
        time: Date;
    }
    cards: {
        total: number;
        created: number;
    }
    activePlan: {
        _id: string;
        status: string;
        currentEnd: Date;
    }
    createdAt: Date;
    updatedAt: Date;
};