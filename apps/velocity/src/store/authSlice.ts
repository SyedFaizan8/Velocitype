import { encryptFrontend } from "@/utils/encryptFrontend";
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

export const loginUser = createAsyncThunk("auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const { error, iv, ciphertext, signature } = await encryptFrontend(data);
            if (error) throw error

            const response = await axios.post("/api/login",
                {
                    data: ciphertext,
                    iv
                },
                {
                    headers: {
                        "x-signature": signature,
                    },
                });

            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    });


export const fetchUser = createAsyncThunk("auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/user/me`, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    try {
                        await axios.post('/api/refresh-token', {}, { withCredentials: true });
                        const refreshedResponse = await axios.get('/api/user/me', { withCredentials: true })
                        return refreshedResponse.data.data;
                    } catch (refreshError) {
                        if (axios.isAxiosError(refreshError)) {
                            return rejectWithValue(refreshError.response?.data.message || "Refresh token failed");
                        }
                        return rejectWithValue("Refresh token failed");
                    }
                }
                return rejectWithValue(error.response?.data.message || "User not found")
            }
            return rejectWithValue("An unkown error occured");
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
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.initialized = true;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.initialized = true;
                state.error = action.payload as string;
            });
    },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;