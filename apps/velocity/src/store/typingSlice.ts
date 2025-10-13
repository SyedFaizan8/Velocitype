import { Timer } from "@/types/customTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TypingState {
    wpm: number;
    accuracy: number;
    raw: number;
    totalLetters: number;
    totalWords: number;
    errors: number;
    timer: Timer;
}

const initialState: TypingState = {
    wpm: 0,
    accuracy: 0,
    raw: 0,
    totalLetters: 0,
    totalWords: 0,
    errors: 0,
    timer: 15,
};

const typingSlice = createSlice({
    name: "typing",
    initialState,
    reducers: {
        setTypingStats: (
            state,
            action: PayloadAction<TypingState>
        ) => {
            state.wpm = action.payload.wpm;
            state.accuracy = action.payload.accuracy;
            state.raw = action.payload.raw;
            state.totalLetters = action.payload.totalLetters;
            state.totalWords = action.payload.totalWords;
            state.errors = action.payload.errors;
            state.timer = action.payload.timer;
        },
        resetStats: (state) => {
            state.wpm = initialState.wpm;
            state.accuracy = initialState.accuracy;
            state.raw = initialState.raw;
            state.totalLetters = initialState.totalLetters;
            state.totalWords = initialState.totalWords;
            state.errors = initialState.errors;
            state.timer = initialState.timer;
        },
    },
});

export const { setTypingStats, resetStats } = typingSlice.actions;
export default typingSlice.reducer;
