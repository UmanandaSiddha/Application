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
    tree: Tree;
}

export type PaymentResponse = {
    success: boolean;
    payments: Payment[];
}

export type AnimalResponse = {
    success: boolean;
    count: number;
    animal: Animal[];
}

export type SingleAnimalResponse = {
    success: boolean;
    animal: Animal;
}

export type PersonalResponse = {
    success: boolean;
    count: number;
    personal: Personal[];
}

export type SinglePersonalResponse = {
    success: boolean;
    personal: Personal;
}

export type MedicalResponse = {
    success: boolean;
    count: number;
    medical: MedicalType[];
}

export type SingleMedicalResponse = {
    success: boolean;
    medical: MedicalType;
}

export type CreatorResponse = {
    success: boolean;
    count: number;
    creator: Creator[];
}

export type SingleCreatorResponse = {
    success: boolean;
    creator: Creator;
}
