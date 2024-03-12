import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auctions, AddAuction } from "./auctionsApi";

const initialstate = {
    loading: false,
    response: [],
    addauctionresponse: {}
}

const actions = {
    AUCTIONSAPI: '/auctionsapi/AUCTIONSAPI',
    ADDAUCTIONAPI: '/addauctionapi/ADDAUCTIONAPI'
}

export const auctions = createAsyncThunk(
    actions.AUCTIONSAPI,
    async (payload) => {
        const response = await Auctions(payload)
        return response
    }
)
export const addAuction = createAsyncThunk(
    actions.ADDAUCTIONAPI,
    async (payload) => {
        const response = await AddAuction(payload)
        return response
    }
)
export const auctionsSlice = createSlice(
    {
        name: "auctions",
        initialState: initialstate,
        extraReducers: (builder) => {
            builder.addCase(auctions.pending, (state) => {
                state.loading = true
            })
                .addCase(auctions.fulfilled, (state, action) => {
                    const { data } = action.payload
                    state.response = data
                    state.loading = false
                })
                .addCase(auctions.rejected, (state, action) => {
                    const { message: msg } = action.error
                    state.response = msg
                    state.loading = false
                })
            builder.addCase(addAuction.pending, (state) => {
                state.loading = true
            })
                .addCase(addAuction.fulfilled, (state, action) => {
                    const { data } = action.payload
                    state.addauctionresponse = data
                    state.loading = false
                })
                .addCase(addAuction.rejected, (state, action) => {
                    const { message: msg } = action.error
                    state.addauctionresponse = msg
                    state.loading = false
                })

        }
    }
)


export const auctionsActions = auctionsSlice.actions
export default auctionsSlice.reducer