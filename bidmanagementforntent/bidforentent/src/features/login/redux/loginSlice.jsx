import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import login from "./loginapi";
const initialstate = {
    loginresponse: {},
    loading: false
}

const actions = {
    LOGINUSER: "loginuser/LOGINUSER"
}

export const loginuser = createAsyncThunk(
    actions.LOGINUSER,
    async (payload) => {
        const response = await login(payload);
        return response
    }
)

const loginSlice = createSlice({
    name: "loginuser",
    initialState: initialstate,
    extraReducers: (builder) => {
        builder.addCase(loginuser.pending, (state) => {
            state.loading = true
        })
            .addCase(loginuser.fulfilled, (state, action) => {
                const response = action.payload
                state.loading = false
                state.loginresponse = response
            })
            .addCase(loginuser.rejected, (state, action) => {
                state.loading = false;
                state.loginresponse = action.error
            })

    }
})

export const loginActions = loginSlice.actions;
export default loginSlice.reducer;