export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    image: string;
    gooleId: string;
    customerId: string;
    isVerified: boolean;
    accountType: string;
    isBlocked: boolean;
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
        planId: string;
        status: string;
        currentEnd: Date;
    }
    freePlan: {
        status: boolean;
        start: Date;
        end: Date;
        type: string;
    }
    billingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    }
    phone: string;
    orgDetails: {
        website: string;
        address: {
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        },
        phone: string;
    }
};

export type Donator = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    },
    pan: string;
    customerId: string;
    activeDonation: {
        _id: string;
        status: string;
    },
}



