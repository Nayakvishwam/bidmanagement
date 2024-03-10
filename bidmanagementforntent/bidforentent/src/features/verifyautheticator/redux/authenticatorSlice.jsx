import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Authenticator from "./authenticatorApi";

const initialstate = {
    response: {},
    loading: false
}

const actions = {
    VERIFYAUTHENTICATOR: "VERIFYAUTHENTICATOR/verifyauthenticator"
}

export const authenticator = createAsyncThunk(
    actions.VERIFYAUTHENTICATOR,
    async (payload) => {
        const response = await Authenticator(payload)
        return response
    }
)

export const authenticatorSlice = createSlice({
    name: "authenticator",
    initialState: initialstate,
    extraReducers: function (builder) {
        builder.addCase(authenticator.pending, (state) => {
            state.loading = true
        }).addCase(authenticator.fulfilled, (state, action) => {
            state.loading = false
            state.response = action.payload.data
        }).addCase(authenticator.rejected, (state) => {
            state.loading = false
        })
    }
})


export const authenticatorActions = authenticatorSlice.actions;
export default authenticatorSlice.reducer;