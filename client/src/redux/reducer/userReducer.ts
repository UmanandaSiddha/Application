import { IUser } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
            state.loading = true;
            state.user = action.payload;
            if ((action.payload.access.latestSubscription && ["active", "pending"].includes(action.payload.access.latestSubscription?.status)) || action.payload.access.freeAccess) {
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
