import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MedicalReducerInitialState } from "../../types/reducer-types";
import { MedicalType } from "../../types/types";

const initialState: MedicalReducerInitialState = {
    medical: null,
    loadings: true,
};

export const medicalReducer = createSlice({
    name: "medicalReducer",
    initialState,
    reducers: {
        medicalExist: (state, action: PayloadAction<MedicalType>) => {
            state.loadings = false;
            state.medical = action.payload;
        },
        medicalNotExist: (state) => {
            state.loadings = false;
            state.medical = null;
        },
    },
});

export const { medicalExist, medicalNotExist } = medicalReducer.actions;