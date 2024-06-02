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
    user: string;
}

export type Transaction = {
    _id: string;
    amount: number;
    start: Date;
    end: Date;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    paymentMethod: any;
    user: string;
}

export type Tree = {
    _id: string;
    name: string
    scientificName: string;
    treeType: string;
    location: string;
    description: string;
    features: string;
    maintenance: string;
    benefits: string;
    funFact: string;
    user: {
        _id: string;
        email: string;
    }
};

export type Animal = {
    _id: string;
    species: string;
    name: string;
    age: number;
    gender: string;
    color: string;
    location: string;
    owner: string;
    phone:  number;
    user: {
        _id: string;
        email: string;
    }
}

export type Personal = {
    _id: string;
    name: string;
    contactInfo: any;
    socialMedia: any;
    lifesty: any;
    favourites: any;
    mottos: any;
    misce: any;
    interest: any;
    value: any;
    beliefs: any;       
    profession: any;
    backg: any;
    expert: any;
    additional: any;
    user: string;
}

export type Medical = {
    _id: string;
    personalInfo: any;
    healthHistory: any;
    currentMedication: string;
    previousSurgeries: string;
    healthHabits: any;
    insuranceInfo: any;
    user: string;
}

export type Creator = {
    _id: string;
    name: string;
    links: any;
    user: string;
}