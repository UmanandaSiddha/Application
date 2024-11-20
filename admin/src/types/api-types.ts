import { 
    Animal, 
    Contact, 
    Creator, 
    CustomReuest, 
    Donator, 
    Medical, 
    Personal, 
    Plan, 
    Subscription, 
    Transaction, 
    Tree, 
    User 
} from "./types";

export type UserResponse = {
    success: boolean;
    user: User;
};

export type AllUsersResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredUsersCount: number;
    users: User[];
}

export type DonatorResponse = {
    success: boolean;
    donator: Donator;
}

export type AllDonatorsResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredDonatorsCount: number;
    donators: Donator[];
}

export type PlanResponse = {
    success: boolean;
    plan: Plan;
}

export type AllPlansResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredPlanCount: number;
    plans: Plan[];
}

export type TransactionResponse = {
    success: boolean;
    transaction: Transaction;
}

export type AllTransactionsResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredTransactionsCount: number;
    transactions: Transaction[];
}

export type SubscriptionResponse = {
    success: boolean;
    subscription: Subscription;
}

export type AllSubscriptionResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredSubscriptionsCount: number;
    subscriptions: Subscription[];
}

export type CustomRequestResponse = {
    success: boolean;
    request: CustomReuest;
}

export type AllCustomReuestResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredRequestsCount: number;
    requests: CustomReuest[];
}

export type ContactResponse = {
    success: boolean;
    contact: Contact;
}

export type AllContactResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredContactsCount: number;
    contacts: Contact[];
}

export type TreeResponse = {
    success: boolean;
    tree: Tree;
};

export type CardResponse = {
    success: boolean;
    card: Tree | Personal | Medical | Creator | Animal;
}

export type AllCardsResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    cards: Tree[] | Personal[] | Medical[] | Creator[] | Animal[];
}

