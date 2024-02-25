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
    personals: Personal[];
    personal: Personal | null;
    loading: boolean;
}

export interface MedicalReducerInitialState {
    medicals: MedicalType[];
    medical: MedicalType | null;
    loadings: boolean;
}

export interface CreatorReducerInitialState {
    creators: Creator[];
    creator: Creator | null;
    loading: boolean;
}


