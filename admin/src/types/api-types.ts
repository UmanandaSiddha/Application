import { User } from "./types";

export type UserResponse = {
    success: boolean;
    user: User;
};

export type AllUsersResponse = {
    success: boolean;
    count: number;
    users: User[];
}
