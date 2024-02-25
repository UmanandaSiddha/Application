import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersonalReducerInitialState } from "../../types/reducer-types";
import { Personal } from "../../types/types";

const initialState: PersonalReducerInitialState = {
    personals: [],
    personal: null,
    loading: true,
};

export const personalReducer = createSlice({
    name: "personalReducer",
    initialState,
    reducers: {
        personalExist: (state, action: PayloadAction<Personal[]>) => {
            state.loading = false;
            state.personals = action.payload;
        },
        personalTemp: (state, action: PayloadAction<Personal>) => {
            state.loading = false;
            state.personal = action.payload;
        },
        personalNotTemp: (state) => {
            state.loading = false;
            state.personal = null;
        },
        personalNotExist: (state) => {
            state.loading = false;
            state.personals = [];
        },     
    },
});

export const { personalExist, personalNotExist, personalTemp, personalNotTemp } = personalReducer.actions;