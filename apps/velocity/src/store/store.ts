import { configureStore } from "@reduxjs/toolkit";
import typingReducer from "@/store/typingSlice";
import authReducer from "@/store/authSlice";
import positionReducer from "@/store/positionSlice"
import settingReducer from "@/store/settingsSlice"

export const store = configureStore({
    reducer: {
        typing: typingReducer,
        auth: authReducer,
        position: positionReducer,
        setting: settingReducer
    },
});

// Infer types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
