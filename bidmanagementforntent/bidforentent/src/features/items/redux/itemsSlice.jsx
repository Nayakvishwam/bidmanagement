import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ItemData, AddItemData, DeleteItems } from "./itemsApi";

const initialstate = {
    response: [],
    loading: true,
    itemaddresponse: {},
    deleteitemsresponse: {}
}
const actions = {
    ITEMSAPI: "itemsApi/ITEMSAPI",
    ADDITEMAPI: "additemApi/ADDITEMAPI",
    DELETEITEMSAPI: "deleteitemApi/DELETEITEMSAPI"
}
export const itemApi = createAsyncThunk(
    actions.ITEMSAPI,
    async (payload) => {
        const response = await ItemData(payload)
        return response
    }
)
export const additemApi = createAsyncThunk(
    actions.ADDITEMAPI,
    async (payload) => {
        const response = await AddItemData(payload)
        return response
    }
)

export const deleteitemApi = createAsyncThunk(
    actions.DELETEITEMSAPI,
    async (payload) => {
        const response = await DeleteItems(payload)
        return response
    }
)
export const itemsSlice = createSlice({
    name: "items",
    initialState: initialstate,
    extraReducers: (builder) => {
        builder.addCase(itemApi.pending, (state) => {
            state.loading = true
        })
            .addCase(itemApi.fulfilled, (state, action) => {
                const { data } = action.payload
                state.loading = false
                state.response = data
                return
            }).addCase(itemApi.rejected, (state, action) => {
                const { message: msg } = action.error
                state.response = msg
                state.loading = false
            })
        builder.addCase(additemApi.pending, (state) => {
            state.loading = true
        })
            .addCase(additemApi.fulfilled, (state, action) => {
                const data = action.payload
                state.loading = false
                state.itemaddresponse = data
            }).addCase(additemApi.rejected, (state, action) => {
                const { message: msg } = action.error
                state.itemaddresponse = msg
                state.loading = false
            })
        builder.addCase(deleteitemApi.pending, (state) => {
            state.loading = true
        })
            .addCase(deleteitemApi.fulfilled, (state, action) => {
                const data = action.payload
                state.loading = false
                state.deleteitemsresponse = data
            }).addCase(deleteitemApi.rejected, (state, action) => {
                const { message: msg } = action.error
                state.deleteitemsresponse = msg
                state.loading = false
            })
    }
})

export const itemsActions = itemsSlice.actions
export default itemsSlice.reducer