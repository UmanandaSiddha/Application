import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types/type";

interface UserReducerInitialState {
    user: IUser | null;
    isPaid: boolean;
    loading: boolean;
}

const initialState: UserReducerInitialState = {
    user: null,
    isPaid: false,
    loading: true,
};

export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        userExist: (state, action: PayloadAction<IUser>) => {
            state.loading = false;
            state.user = action.payload;
            if (action.payload.access.latestSubscription?.status === "active") {
                state.isPaid = true
            }
        },
        userNotExist: (state) => {
            state.loading = false;
            state.user = null;
        },
        togglePaid: (state, action: PayloadAction<IUser>) => {
            if (action.payload.access.latestSubscription?.status === "active") {
                state.isPaid = true
            } else {
                state.isPaid = false
            }
        }
    },
});

export const { userExist, userNotExist, togglePaid } = userReducer.actions;
