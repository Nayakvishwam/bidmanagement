import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Registration from "./registerApi";

const initialstate = {
    registerResponse: {},
    loading: false
}

const actions = {
    REGISTER: "register/REGISTER"
}

export const registerUser = createAsyncThunk(
    actions.REGISTER,
    async (payload) => {
        const response = await Registration(payload)
        return response
    }
)

export const registerSlice = createSlice(
    {
        name: "registeruser",
        initialState: initialstate,
        extraReducers: (builder) => {
            builder
                .addCase(registerUser.pending, (state) => {
                    state.loading = false
                })
                .addCase(registerUser.fulfilled, (state, action) => {
                    state.loading = true
                    state.registerResponse = action.payload
                })
                .addCase(registerUser.rejected, (state, action) => {
                    state.loading = false;
                    state.registerResponse = action.error
                })
        }
    }
)

export const registerActions = registerSlice.actions;
export default registerSlice.reducer;