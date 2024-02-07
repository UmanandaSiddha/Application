import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TreeReducerInitialState } from "../../types/reducer-types";
import { Tree } from "../../types/types";

const initialState: TreeReducerInitialState = {
    tree: [],
    trus: null,
    loading: true,
};

export const treeReducer = createSlice({
    name: "treeReducer",
    initialState,
    reducers: {
        treeExist: (state, action: PayloadAction<Tree[]>) => {
            state.loading = false;
            state.tree = action.payload;
        },
        treeTemp: (state, action: PayloadAction<Tree>) => {
            state.loading = false;
            state.trus = action.payload;
        },
        treeNotTemp: (state) => {
            state.loading = false;
            state.trus = null;
        },
        treeNotExist: (state) => {
            state.loading = false;
            state.tree = [];
        },
    },
});

export const { treeExist, treeNotExist, treeTemp, treeNotTemp } = treeReducer.actions;