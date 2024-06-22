import { Animal, Creator, CustomReuest, Medical, Personal, Plan, Subscription, Transaction, Tree, User } from "./types";

export type UserResponse = {
    success: boolean;
    user: User;
};

export type PlanResponse = {
    success: boolean;
    plan: Plan;
}

export type AllTransactionsResponse = {
    success: boolean;
    count: number;
    transactions: Transaction[];
}

export type SubscriptionResponse = {
    success: boolean;
    subscription: Subscription;
}

export type AllUsersResponse = {
    success: boolean;
    count: number;
    users: User[];
}

export type CustomRequestResponse = {
    success: boolean;
    request: CustomReuest;
}

export type AllCustomReuestResponse = {
    success: boolean;
    count: number;
    requests: CustomReuest[];
}

export type AllPlansResponse = {
    success: boolean;
    count: number;
    plans: Plan[];
}

export type TreeResponse = {
    success: boolean;
    tree: Tree;
};

export type AllCardsResponse = {
    success: boolean;
    count: number;
    cards: Tree[] | Personal[] | Medical[] | Creator[] | Animal[];
}

