import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreatorReducerInitialState } from "../../types/reducer-types";
import { Creator } from "../../types/types";

const initialState: CreatorReducerInitialState = {
    creator: null,
    loading: true,
};

export const creatorReducer = createSlice({
    name: "creatorReducer",
    initialState,
    reducers: {
        creatorExist: (state, action: PayloadAction<Creator>) => {
            state.loading = false;
            state.creator = action.payload;
        },
        creatorNotExist: (state) => {
            state.loading = false;
            state.creator = null;
        },
    },
});

export const { creatorExist, creatorNotExist } = creatorReducer.actions;