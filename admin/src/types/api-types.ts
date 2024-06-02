import { Tree, User } from "./types";

export type UserResponse = {
    success: boolean;
    user: User;
};

export type AllUsersResponse = {
    success: boolean;
    count: number;
    users: User[];
}

export type TreeResponse = {
    success: boolean;
    tree: Tree;
};

export type AllTreesResponse = {
    success: boolean;
    count: number;
    trees: Tree[];
}

