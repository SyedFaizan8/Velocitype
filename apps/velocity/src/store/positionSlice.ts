import { createSlice } from "@reduxjs/toolkit";
import { State } from "@/hooks/useEngine"

interface PositionState {
    position: State | null;
}

const initialState: PositionState = {
    position: null
};

const position = createSlice({
    name: "position",
    initialState,
    reducers: {
        changePosition: (state, actions) => {
            state.position = actions.payload;
        }
    },
});

export const { changePosition } = position.actions;
export default position.reducer;
