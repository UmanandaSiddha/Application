import {
    User,
    Tree,
    Payment,
    Personal,
    MedicalType,
    Creator
} from "./types";

export type UserResponse = {
    success: boolean;
    user: User;
};

export type TreeResponse = {
    success: boolean;
    count: number;
    tree: Tree[];
}

export type SingleTreeResponse = {
    success: boolean;
    tree: Tree;
}

export type PaymentResponse = {
    success: boolean;
    payments: Payment[];
}

export type PersonalResponse = {
    success: boolean;
    personal: Personal;
}

export type MedicalResponse = {
    success: boolean;
    medical: MedicalType;
}

export type CreatorResponse = {
    success: boolean;
    creator: Creator;
}
