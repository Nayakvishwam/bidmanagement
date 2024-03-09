import loginReducer from "../features/login/redux/loginSlice"
import registerReducer from "../features/registration/redux/registerSlice"

const rootReducer = {
    loginReducer: loginReducer,
    registerReducer: registerReducer
}

export default rootReducer