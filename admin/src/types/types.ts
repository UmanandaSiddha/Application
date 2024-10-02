export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    image: string;
    googleId: string;
    customerId: string;
    isVerified: boolean;
    isDeactivated: boolean;
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
    },
    createdAt: Date;
    updatedAt: Date;
};

export type Plan = {
    _id: string;
    name: string;
    amount: number;
    cards: number;
    description: string;
    planType: string;
    visible: boolean;
    period: string;
    interval: number;
    razorPlanId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CustomReuest = {
    _id: string;
    email: string;
    attended: boolean;
    accepted: string;
    reason: string;
    cards: number;
    amount: number;
    comment: string;
    period: string;
    interval: number;
    user: {
        _id: string;
        email: string;
        name: string;
    }
    createdAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export type Tree = {
    _id: string;
    shortCode: string;
    type: string;
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
    createdAt: Date;
    updatedAt: Date;
};

export type Animal = {
    _id: string;
    shortCode: string;
    type: string;
    species: string;
    name: string;
    age: number;
    gender: string;
    color: string;
    location: string;
    owner: string;
    phone: number;
    user: {
        _id: string;
        email: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

export type Personal = {
    _id: string;
    shortCode: string;
    name: string,
    type: string;
    mobileNumer: string,
    homeNumber: string,
    workNumber: string,
    otherNumber: string,
    personalEmail: string,
    workEmail: string,
    otherEmail: string,
    aboutMe: string,
    dateOfBirth: string,
    homeTown: string,
    currentCity: string,
    languages: string,
    music: string,
    color: string,
    city: string,
    travelDestination: string,
    season: string,
    uniqueSkills: string,
    cuisine: string,
    beverage: string,
    inspirationalQuotes: string,
    funnyQuotes: string,
    motivationalQuotes: string,
    otherQuotes: string,
    travelMode: string,
    petLover: string,
    partyEnthusiast: string,
    smoker: string,
    maritalStatus: string,
    relationshipStatus: string,
    fitnessRoutine: string,
    morningPerson: string,
    diet: string,
    diet_Other: string,
    sleepingHabit: string,
    genre: string,
    sports: string,
    artistisPursuits: string,
    gaming: string,
    collectignHobby: string,
    coffee: string,
    cookingSkills: string,
    travelMode_Other: string,
    genre_Other: string,
    sports_Other: string,
    artistisPursuits_Other: string,
    gaming_Other: string,
    collectignHobby_Other: string,
    coffee_Other: string,
    cookingSkills_Other: string,
    currentOcupation_Other: string,
    careerAspiation_Other: string,
    education_Other: string,
    skills_Other: string,
    spiritual: string,
    core: string,
    philosophy: string,
    socialCause: string,
    globalIssues: string,
    weirdBelief: string,
    currentOcupation: string,
    careerAspiation: string,
    education: string,
    skills: string,
    otherInterests: string,
    futureGoals: string,
    current: string,
    unusualExperinece: string,
    strangeHabits: string,
    socialMedia: [
        {
            name: string;
            label: string;
        }
    ]
    user: {
        _id: string;
        email: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

export type Medical = {
    _id: string;
    shortCode: string;
    type: string;
    name: string,
    dateOfBirth: string,
    gender: string,
    street: string,
    city: string,
    state: string,
    postalCode: number,
    phone: string,
    email: string,
    emergencyName: string,
    emergencyRelation: string,
    emergencyPhone: string,
    allergyHistory: string,
    chronicHistory: string,
    currentMedication: string,
    previousSurgeries: string,
    smoker: string,
    alcohol: string,
    exercise: string,
    diet: string,
    mentalCondition: string,
    vaccinationHistory: string,
    insuranceProvider: string,
    insurancePolicyNumber: number,
    insuranceGrpNumber: number,
    user: {
        _id: string;
        email: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

export type Creator = {
    _id: string;
    shortCode: string;
    type: string;
    name: string;
    links: [
        {
            name: string;
            label: string;
        }
    ]
    user: {
        _id: string;
        email: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

export type Contact = {
    _id: string;
    email: string;
    name: string;
    message: string;
    report: boolean;
    attended: boolean;
    createdAt: Date;
    updatedAt: Date;
}

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
        planId: string;
        status: string;
        currentEnd: Date;
    }
    oneTimePassword: string;
    oneTimeExpire: Date;
    createdAt: Date;
    updatedAt: Date;
}