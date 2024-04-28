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
        status: string;
    }
};

export type Subscription = {
    planId: string;
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
    user: string;
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
    user: string;
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

export type MedicalType = {
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