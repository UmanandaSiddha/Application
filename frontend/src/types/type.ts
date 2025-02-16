export const PeriodEnum = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
} as const;

export const PlanEnum = {
    USER: "USER",
    ORGANIZATION: "ORGANIZATION",
    FREE: "FREE",
    CUSTOM: "CUSTOM",
    DONATOR: "DONATOR",
} as const;

export const CardEnum = {
    INDIVIDUAL: "INDIVIDUAL",
    BOTANICAL: "BOTANICAL",
    MEDICAL: "MEDICAL",
    ANIMAL: "ANIMAL",
    CREATOR: "CREATOR",
} as const;

export const UserRoleEnum = {
    USER: "USER",
    ADMIN: "ADMIN",
    ORGANIZATION: "ORGANIZATION"
} as const;

export const UserAccountEnum = {
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
} as const;

export const SubscriptionEnum = {
    USER: "USER",
    DONATOR: "DONATOR"
} as const;

export const TransactionEnum = {
    RECURRING: "RECURRING",
    ONETIME: "ONETIME"
} as const;

export interface ITransaction {
    _id: string;
    amount: number;
    start: Date;
    end: Date;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    error: any;
    transactionFor: (typeof SubscriptionEnum)[keyof typeof SubscriptionEnum];
    transactionType: (typeof TransactionEnum)[keyof typeof TransactionEnum];
    currency: string;
    paymentMethod?: {
        methodType?: string,
        cardInfo?: {
            cardType?: string,
            issuer?: string,
            last4?: string,
            name?: string,
            network?: string,
        },
        bankInfo?: string,
        walletInfo?: string,
        upiInfo?: string,
        data?: any
    },
    donator?: string;
    user?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISubscription {
    _id: string;
    planId:  string;
    razorSubscriptionId?: string;
    start: Date;
    end: Date;
    currentStart: Date;
    currentEnd: Date;
    nextBilling: Date;
    totalCount: number;
    paidCount: number;
    remainingCount: number;
    shortUrl?: string;
    status: string;
    subscriptionType: (typeof SubscriptionEnum)[keyof typeof SubscriptionEnum];
    paymentMethod?: {
        methodType?: string,
        cardInfo?: {
            cardType?: string,
            issuer?: string,
            last4?: string,
            name?: string,
            network?: string,
        },
        bankInfo?: string,
        walletInfo?: string,
        upiInfo?: string,
        data?: any
    },
    donator?: string;
    user?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPlan {
    _id: string;
    name: string;
    amount: number;
    cards: number;
    description: string;
    planType: (typeof PlanEnum)[keyof typeof PlanEnum];
    visible: boolean;
    period: (typeof PeriodEnum)[keyof typeof PeriodEnum];
    interval: number;
    razorPlanId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICard {
    _id: string;
    type: (typeof CardEnum)[keyof typeof CardEnum];
    data: IndividualData | BotanyData | CreatorData | AnimalData | MedicalData;
    shortCode: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDonator {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
    address?: {
        street: string,
        city: string,
        state: string,
        postalCode: string,
        country: string,
    }
    customerId: string;
    latestDonation?: {
        _id: string;
        status: string;
    }
    oneTimePassword?: string;
    oneTimeExpire?: Date;
}

export interface IUser {
    _id: string;
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
        password?: string;
        role: typeof UserRoleEnum[keyof typeof UserRoleEnum];
        googleId?: string;
        customerId?: string;
    }
    account: {
        accountType: Array<typeof UserAccountEnum[keyof typeof UserAccountEnum]>;
        isBlocked: boolean;
        isVerified: boolean;
        isDeactivated: boolean;
        deactivateReason?: string;
        deactivateTime?: Date;
        loginAttempt?: {
            count: number;
            lastLogin: Date;
        }
    }
    access: {
        billingInfo?: IBillingInfo;
        latestSubscription?: {
            _id: string;
            status: string;
        }
        freeAccess: boolean;
        cards: {
            total: {
                initial: number;
                extra: number;
            }
            created: number;
        }
    }
    organization?: {
        website: string;
        organizationBilling: IBillingInfo;
    }
    oneTimePassword?: string;
    oneTimeExpire?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBillingInfo {
    phoneNumber?: string;
    address: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    }
}

export interface IndividualData {
    name: string;
    mobileNumber?: string;
    homeNumber?: string;
    workNumber?: string;
    otherNumber?: string;
    personalEmail?: string;
    workEmail?: string;
    otherEmail?: string;
    aboutMe?: string;
    dateOfBirth?: string;
    homeTown?: string;
    currentCity?: string;
    languages?: string;
    music?: string;
    socialCause_Other?: string;
    philosophy_Other?: string;
    color?: string;
    city?: string;
    travelDestination?: string;
    season?: string;
    uniqueSkills?: string;
    cuisine?: string;
    beverage?: string;
    inspirationalQuotes?: string;
    funnyQuotes?: string;
    motivationalQuotes?: string;
    otherQuotes?: string;
    petLover?: string;
    partyEnthusiast?: string;
    smoker?: string;
    maritalStatus?: string;
    relationshipStatus?: string;
    fitnessRoutine?: string;
    morningPerson?: string;
    diet?: string;
    sleepingHabit?: string;
    travelMode?: string;
    genre?: string;
    sports?: string;
    artistisPursuits?: string;
    gaming?: string;
    collectignHobby?: string;
    coffee?: string;
    cookingSkills?: string;
    currentOcupation?: string;
    careerAspiation?: string;
    education?: string;
    skills?: string;
    travelMode_Other?: string;
    spiritual_Other?: string;
    core_Other?: string;
    genre_Other?: string;
    sports_Other?: string;
    artistisPursuits_Other?: string;
    gaming_Other?: string;
    collectignHobby_Other?: string;
    coffee_Other?: string;
    cookingSkills_Other?: string;
    currentOcupation_Other?: string;
    careerAspiation_Other?: string;
    education_Other?: string;
    skills_Other?: string;
    diet_Other?: string;
    spiritual?: string;
    core?: string;
    philosophy?: string;
    socialCause?: string;
    globalIssues?: string;
    weirdBelief?: string;
    otherInterests?: string;
    futureGoals?: string;
    current?: string;
    unusualExperinece?: string;
    strangeHabits?: string;
    socialMedia: {
        label: string;
        link: string;
    }[];
}

export interface BotanyData {
    name: string;
    scientificName?: string;
    family?: string;
    origin?: string;
    habitat?: string;
    description?: string;
    height?: string;
    leafType?: string;
    flowerColor?: string;
    uses?: string;
    careInstructions?: string;
    specialFeatures?: string;
    caretakerMobileNumber?: string;
    additionalNotes?: string;
}

export interface CreatorData {
    name: string;
    links: {
        label: string;
        link: string;
    }[];
}

export interface AnimalData {
    name: string;
    scientificName?: string;
    habitat?: string;
    geographicalRange?: string;
    physicalDescription?: string;
    diet?: string;
    lifespan?: string;
    behavior?: string;
    conservationStatus?: string;
    ownerName?: string;
    location?: string;
    caretakerMobileNumber?: string;
    additionalNotes?: string;
}

export interface MedicalData {
    name: string;
    dateOfBirth?: string;
    gender?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    allergyHistory?: string;
    chronicHistory?: string;
    currentMedication?: string;
    previousSurgeries?: string;
    smoker?: string;
    alcohol?: string;
    exercise?: string;
    blood?: string;
    height?: string;
    weight?: string;
    age?: string;
    allergyHistory_Other?: string;
    chronicHistory_Other?: string;
    diet_Other?: string;
    exercise_Other?: string;
    diet?: string;
    mentalCondition?: string;
    vaccinationHistory?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    insuranceGrpNumber?: string;
}