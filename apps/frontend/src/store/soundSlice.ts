import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SoundState {
    sound: boolean
}

const initialState: SoundState = {
    sound: false
};

const sound = createSlice({
    name: "sound",
    initialState,
    reducers: {
        changeSound: (
            state,
        ) => {
            state.sound = !state.sound;
            // console.log(state.sound);
        }
    },
});

export const { changeSound } = sound.actions;
export default sound.reducer;
