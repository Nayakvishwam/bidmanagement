import loginReducer from "../features/login/redux/loginSlice"
import registerReducer from "../features/registration/redux/registerSlice"
import authenticatorReducer from "../features/verifyautheticator/redux/authenticatorSlice"
import auctionsReducer from "../features/auctions/redux/auctionsSlice"
import itemReducer from "../features/items/redux/itemsSlice"
const rootReducer = {
    loginReducer: loginReducer,
    registerReducer: registerReducer,
    authenticatorReducer: authenticatorReducer,
    itemReducer: itemReducer,
    auctionsReducer: auctionsReducer
}

export default rootReducer