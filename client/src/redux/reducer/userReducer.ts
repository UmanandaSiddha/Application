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
            state.loading = true;
            state.user = action.payload;
            if (["active", "pending"].includes(action.payload.activePlan?.status) || action.payload.freePlan?.status) {
                state.isPaid = true
            }
            state.loading = false;
        },
        userNotExist: (state) => {
            state.loading = false;
            state.user = null;
        },
        togglePaid: (state, action: PayloadAction<boolean>) => {
            if (action.payload === true) {
                state.isPaid = true
            } else {
                state.isPaid = false
            }
        }
    },
});

export const { userExist, userNotExist, togglePaid } = userReducer.actions;
