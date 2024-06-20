import { Animal, Creator, CustomReuest, Medical, Personal, Tree, User } from "./types";

export type UserResponse = {
    success: boolean;
    user: User;
};

export type AllUsersResponse = {
    success: boolean;
    count: number;
    users: User[];
}

export type AllCustomReuestResponse = {
    success: boolean;
    count: number;
    requests: CustomReuest[];
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

