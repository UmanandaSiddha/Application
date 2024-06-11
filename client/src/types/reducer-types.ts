import { Donator, User } from "./types";

export interface UserReducerInitialState {
    user: User | null;
    loading: boolean;
    isPaid: boolean;
}

export interface DonatorReducerInitialState {
    donator: Donator | null;
    loading: boolean;
    activeDonation: boolean;
}


