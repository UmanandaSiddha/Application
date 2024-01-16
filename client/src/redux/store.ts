import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from "./reducer/userReducer";
import { treeReducer } from './reducer/treeReducer';
import { paymentReducer } from './reducer/paymentReducer';
import { personalReducer } from './reducer/personalReducer';
import { medicalReducer } from './reducer/medicalReducer';
import { creatorReducer } from './reducer/creatorreducer';

export const store = configureStore({
    reducer: {
        [userReducer.name]: userReducer.reducer,
        [treeReducer.name]: treeReducer.reducer,
        [paymentReducer.name]: paymentReducer.reducer,
        [personalReducer.name]: personalReducer.reducer,
        [medicalReducer.name]: medicalReducer.reducer,
        [creatorReducer.name]: creatorReducer.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;