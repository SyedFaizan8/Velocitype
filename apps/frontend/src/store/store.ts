import { configureStore } from "@reduxjs/toolkit";
import typingReducer from "@/store/typingSlice";
import soundReducer from "@/store/soundSlice";
import authReducer from "@/store/authSlice"

export const store = configureStore({
    reducer: {
        typing: typingReducer,
        sound: soundReducer,
        auth: authReducer
    },
});

// Infer types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
