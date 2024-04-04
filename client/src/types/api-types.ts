import {
    User,
    Tree,
    Payment,
    Personal,
    MedicalType,
    Creator,
    Animal
} from "./types";

export type UserResponse = {
    success: boolean;
    user: User;
};

export type TreeResponse = {
    success: boolean;
    count: number;
    vCards: Tree[];
}

export type SingleTreeResponse = {
    success: boolean;
    vCard: Tree;
}

export type PaymentResponse = {
    success: boolean;
    payments: Payment[];
}

export type AnimalResponse = {
    success: boolean;
    count: number;
    vCards: Animal[];
}

export type SingleAnimalResponse = {
    success: boolean;
    vCard: Animal;
}

export type PersonalResponse = {
    success: boolean;
    count: number;
    vCards: Personal[];
}

export type SinglePersonalResponse = {
    success: boolean;
    vCard: Personal;
}

export type MedicalResponse = {
    success: boolean;
    count: number;
    vCards: MedicalType[];
}

export type SingleMedicalResponse = {
    success: boolean;
    vCard: MedicalType;
}

export type CreatorResponse = {
    success: boolean;
    count: number;
    vCards: Creator[];
}

export type SingleCreatorResponse = {
    success: boolean;
    vCard: Creator;
}
