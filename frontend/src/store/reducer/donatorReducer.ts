import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDonator } from "../../types/type";

interface DonatorReducerInitialState {
    donator: IDonator | null;
    latestDonation: boolean;
    loading: boolean;
}

const initialState: DonatorReducerInitialState = {
    donator: null,
    latestDonation: false,
    loading: true,
};

export const donatorReducer = createSlice({
    name: "donatorReducer",
    initialState,
    reducers: {
        donatorExist: (state, action: PayloadAction<IDonator>) => {
            state.loading = true;
            state.donator = action.payload;
            if (action.payload.latestDonation && ["active", "pending"].includes(action.payload.latestDonation?.status)) {
                state.latestDonation = true
            }
            state.loading = false;
        },
        donatorNotExist: (state) => {
            state.loading = false;
            state.donator = null;
        },
        toggleDonation: (state, action: PayloadAction<IDonator>) => {
            if (action.payload.latestDonation && ["active", "pending"].includes(action.payload.latestDonation?.status)) {
                state.latestDonation = true
            } else {
                state.latestDonation = false
            }
        }
    },
});

export const { donatorExist, donatorNotExist, toggleDonation } = donatorReducer.actions;
