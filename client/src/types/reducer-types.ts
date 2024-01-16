import { User, Tree, Payment, Personal, MedicalType, Creator } from "./types";

export interface UserReducerInitialState {
    user: User | null;
    loading: boolean;
    isPaid: boolean;
}

export interface TreeReducerInitialState {
    tree: Tree[];
    trus: Tree | null;
    loading: boolean;
}

export interface PaymentReducerInitialState {
    payments: Payment[];
    payment: Payment | null;
    loadings: boolean;
}

export interface PersonalReducerInitialState {
    personal: Personal | null;
    loading: boolean;
}

export interface MedicalReducerInitialState {
    medical: MedicalType | null;
    loadings: boolean;
}

export interface CreatorReducerInitialState {
    creator: Creator | null;
    loading: boolean;
}


