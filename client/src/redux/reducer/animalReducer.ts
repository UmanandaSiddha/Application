import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnimalReducerInitialState } from "../../types/reducer-types";
import { Animal } from "../../types/types";

const initialState: AnimalReducerInitialState = {
    animals: [],
    animal: null,
    loading: true,
};

export const animalReducer = createSlice({
    name: "animalReducer",
    initialState,
    reducers: {
        animalExist: (state, action: PayloadAction<Animal[]>) => {
            state.loading = false;
            state.animals = action.payload;
        },
        animalTemp: (state, action: PayloadAction<Animal>) => {
            state.loading = false;
            state.animal = action.payload;
        },
        animalNotTemp: (state) => {
            state.loading = false;
            state.animal = null;
        },
        animalNotExist: (state) => {
            state.loading = false;
            state.animals = [];
        },
    },
});

export const { animalExist, animalNotExist, animalTemp, animalNotTemp } = animalReducer.actions;