import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DonatorReducerInitialState } from "../../types/reducer-types";
import { Donator } from "../../types/types";

const initialState: DonatorReducerInitialState = {
    donator: null,
    activeDonation: false,
    loading: true,
};

export const donatorReducer = createSlice({
    name: "donatorReducer",
    initialState,
    reducers: {
        donatorExist: (state, action: PayloadAction<Donator>) => {
            state.loading = true;
            state.donator = action.payload;
            if (["active", "pending"].includes(action.payload.activeDonation?.status)) {
                state.activeDonation = true
            }
            state.loading = false;
        },
        donatorNotExist: (state) => {
            state.loading = false;
            state.donator = null;
        },
        toggleDonation: (state, action: PayloadAction<Donator>) => {
            if (["active", "pending"].includes(action.payload.activeDonation?.status)) {
                state.activeDonation = true
            } else {
                state.activeDonation = false
            }
        }
    },
});

export const { donatorExist, donatorNotExist, toggleDonation } = donatorReducer.actions;
