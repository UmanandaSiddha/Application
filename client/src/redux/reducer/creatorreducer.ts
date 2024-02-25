import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreatorReducerInitialState } from "../../types/reducer-types";
import { Creator } from "../../types/types";

const initialState: CreatorReducerInitialState = {
    creators: [],
    creator: null,
    loading: true,
};

export const creatorReducer = createSlice({
    name: "creatorReducer",
    initialState,
    reducers: {
        creatorExist: (state, action: PayloadAction<Creator[]>) => {
            state.loading = false;
            state.creators = action.payload;
        },
        creatorTemp: (state, action: PayloadAction<Creator>) => {
            state.loading = false;
            state.creator = action.payload;
        },
        creatorNotTemp: (state) => {
            state.loading = false;
            state.creator = null;
        },
        creatorNotExist: (state) => {
            state.loading = false;
            state.creators = [];
        },
    },
});

export const { creatorExist, creatorNotExist, creatorTemp, creatorNotTemp } = creatorReducer.actions;