import { Timer } from "@/types/customTypes";
import { createSlice } from "@reduxjs/toolkit";

interface PositionState {
    timing: Timer;
    keyboard: boolean;
    sound: boolean;
}

const initialState: PositionState = {
    timing: 15,
    keyboard: false,
    sound: false
};

const settings = createSlice({
    name: "settings",
    initialState,
    reducers: {
        changeTiming: (state, actions) => { state.timing = actions.payload },
        changekeyboard: (state) => { state.keyboard = !state.keyboard },
        changeSound: (state) => { state.sound = !state.sound }
    },
});

export const { changeTiming, changekeyboard, changeSound } = settings.actions;
export default settings.reducer;
