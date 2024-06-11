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
    cards: {
        total: number;
        created: number;
    }
    activePlan: {
        _id: string;
        planId: string;
        status: string;
    }
};

export type Donator = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: {
        street: String;
        city: String;
        state: String;
        postalCode: String;
        country: String;
    },
    pan: String;
    customerId: String;
    activeDonation: {
        _id: string;
        status: string;
    },
}



