import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MedicalReducerInitialState } from "../../types/reducer-types";
import { MedicalType } from "../../types/types";

const initialState: MedicalReducerInitialState = {
    medicals: [],
    medical: null,
    loadings: true,
};

export const medicalReducer = createSlice({
    name: "medicalReducer",
    initialState,
    reducers: {
        medicalExist: (state, action: PayloadAction<MedicalType[]>) => {
            state.loadings = false;
            state.medicals = action.payload;
        },
        medicalTemp: (state, action: PayloadAction<MedicalType>) => {
            state.loadings = false;
            state.medical = action.payload;
        },
        medicalNotTemp: (state) => {
            state.loadings = false;
            state.medical = null;
        },
        medicalNotExist: (state) => {
            state.loadings = false;
            state.medicals = [];
        },
    },
});

export const { medicalExist, medicalNotExist, medicalTemp, medicalNotTemp } = medicalReducer.actions;