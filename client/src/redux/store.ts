import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from "./reducer/userReducer";
import { donatorReducer } from './reducer/donatorReducer';

export const store = configureStore({
    reducer: {
        [userReducer.name]: userReducer.reducer,
        [donatorReducer.name]: donatorReducer.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;