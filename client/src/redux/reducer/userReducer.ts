import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";

const initialState: UserReducerInitialState = {
    user: null,
    isPaid: false,
    loading: true,
};

export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        userExist: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
            if (Number(action.payload.currentPlan?.endDate) > Number(Date.now()) && (action.payload.currentPlan.planStatus === "succeeded")) {
                state.isPaid = true
            }
        },
        userNotExist: (state) => {
            state.loading = false;
            state.user = null;
        },
        togglePaid: (state, action: PayloadAction<User>) => {
            if (Number(action.payload.currentPlan?.endDate) > Number(Date.now()) && (action.payload.currentPlan.planStatus === "succeeded")) {
                state.isPaid = true
            } else {
                state.isPaid = false
            }
        }
    },
});

export const { userExist, userNotExist, togglePaid } = userReducer.actions;
