import { IDonator } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DonatorReducerInitialState {
    donator: IDonator | null;
    activeDonation: boolean;
    loading: boolean;
}

const initialState: DonatorReducerInitialState = {
    donator: null,
    activeDonation: false,
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
                state.activeDonation = true
            }
            state.loading = false;
        },
        donatorNotExist: (state) => {
            state.loading = false;
            state.donator = null;
        },
        toggleDonation: (state, action: PayloadAction<IDonator>) => {
            if (action.payload.latestDonation && ["active", "pending"].includes(action.payload.latestDonation?.status)) {
                state.activeDonation = true
            } else {
                state.activeDonation = false
            }
        }
    },
});

export const { donatorExist, donatorNotExist, toggleDonation } = donatorReducer.actions;
