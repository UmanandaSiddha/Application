import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentReducerInitialState } from "../../types/reducer-types";
import { Payment } from "../../types/types";

const initialState: PaymentReducerInitialState = {
    payments: [],
    payment: null,
    loadings: true,
};

export const paymentReducer = createSlice({
    name: "paymentReducer",
    initialState,
    reducers: {
        paymentExist: (state, action: PayloadAction<Payment[]>) => {
            state.loadings = false;
            state.payments = action.payload;
        },
        paymentTemp: (state, action: PayloadAction<Payment>) => {
            state.loadings = false;
            state.payment = action.payload;
        },
        paymentNotExist: (state) => {
            state.loadings = false;
            state.payments = [];
        },
    },
});

export const { paymentExist, paymentNotExist, paymentTemp } = paymentReducer.actions;