import { createSlice } from "@reduxjs/toolkit";
import { State } from "@/types/customTypes"

interface PositionState {
    position: State | null;
    error: boolean;
}

const initialState: PositionState = {
    position: null,
    error: false
};

const position = createSlice({
    name: "position",
    initialState,
    reducers: {
        changePosition: (state, actions) => { state.position = actions.payload },
        setError: (state, actions) => { state.error = actions.payload }
    },
});

export const { changePosition, setError } = position.actions;
export default position.reducer;
