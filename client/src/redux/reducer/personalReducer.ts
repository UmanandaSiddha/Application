import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersonalReducerInitialState } from "../../types/reducer-types";
import { Personal } from "../../types/types";

const initialState: PersonalReducerInitialState = {
    personal: null,
    loading: true,
};

export const personalReducer = createSlice({
    name: "personalReducer",
    initialState,
    reducers: {
        personalExist: (state, action: PayloadAction<Personal>) => {
            state.loading = false;
            state.personal = action.payload;
        },
        personalNotExist: (state) => {
            state.loading = false;
            state.personal = null;
        },
    },
});

export const { personalExist, personalNotExist } = personalReducer.actions;