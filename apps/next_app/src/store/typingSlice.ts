import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TypingState {
    cpm: number;
    wpm: number;
    accuracy: number;
    totalLetters: number;
    totalWords: number;
    errors: number;
}

const initialState: TypingState = {
    cpm: 0,
    wpm: 0,
    accuracy: 0,
    totalLetters: 0,
    totalWords: 0,
    errors: 0,
};

const typingSlice = createSlice({
    name: "typing",
    initialState,
    reducers: {
        setTypingStats: (
            state,
            action: PayloadAction<TypingState>
        ) => {
            state.cpm = action.payload.cpm;
            state.wpm = action.payload.wpm;
            state.accuracy = action.payload.accuracy;
            state.totalLetters = action.payload.totalLetters;
            state.totalWords = action.payload.totalWords;
            state.errors = action.payload.errors;
        },
        resetStats: (state) => {
            state.accuracy = initialState.accuracy;
            state.cpm = initialState.cpm;
            state.errors = initialState.errors;
            state.totalLetters = initialState.totalLetters;
            state.totalWords = initialState.totalWords;
            state.wpm = initialState.wpm;
        },
    },
});

export const { setTypingStats, resetStats } = typingSlice.actions;
export default typingSlice.reducer;
