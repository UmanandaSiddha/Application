import { Animal, Creator, MedicalType, Personal, Tree } from "./card_types";
import { Plan, Subscription, Transaction } from "./plan_types";
import { Donator, User } from "./types";

export type UserResponse = {
    success: boolean;
    user: User;
};

export type DonatorResponse = {
    success: boolean;
    donator: Donator;
}

export type PlanResponse = {
    success: boolean;
    plans: Plan[];
}

export type SinglePlanResponse = {
    success: boolean;
    plan: Plan;
}

export type SubscriptionResponse = {
    success: boolean;
    subscription: Subscription;
}

export type TransactionResponse = {
    success: boolean;
    transaction: Transaction[];
}

export type SingleTransactionResponse = {
    success: boolean;
    transaction: Transaction;
}

export type TreeResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredCardsCount: number;
    vCards: Tree[];
}

export type SingleTreeResponse = {
    success: boolean;
    vCard: Tree;
}

export type AnimalResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredCardsCount: number;
    vCards: Animal[];
}

export type SingleAnimalResponse = {
    success: boolean;
    vCard: Animal;
}

export type PersonalResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredCardsCount: number;
    vCards: Personal[];
}

export type SinglePersonalResponse = {
    success: boolean;
    vCard: Personal;
}

export type MedicalResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredCardsCount: number;
    vCards: MedicalType[];
}

export type SingleMedicalResponse = {
    success: boolean;
    vCard: MedicalType;
}

export type CreatorResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredCardsCount: number;
    vCards: Creator[];
}

export type SingleCreatorResponse = {
    success: boolean;
    vCard: Creator;
}
