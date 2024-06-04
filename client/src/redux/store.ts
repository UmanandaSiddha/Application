import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from "./reducer/userReducer";

export const store = configureStore({
    reducer: {
        [userReducer.name]: userReducer.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;