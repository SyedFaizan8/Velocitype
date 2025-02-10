import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
    user_id: string;
    username: string;
    imageUrl: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    initialized: false
};

// Login User
export const loginUser = createAsyncThunk("auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, data, { withCredentials: true });
            console.log("login data" + response.data)
            return response.data.data;
        } catch (error: any) {
            console.log(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    });

// Fetch Current User
export const fetchUser = createAsyncThunk("auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, { withCredentials: true });
            console.log("fetching data", response.data.data)
            return response.data.data;
        } catch (error: any) {
            console.log(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message || "User not found");
        }
    });

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(fetchUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.initialized = true;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.user = null;
                state.loading = false;
                state.initialized = true;
            });
    },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
