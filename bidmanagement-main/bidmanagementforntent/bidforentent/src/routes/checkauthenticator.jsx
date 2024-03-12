// import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
// import { authenticator } from "../features/verifyautheticator/redux/authenticatorSlice"
import Tools from "../tools/tools"
import { setAuthenticationdetails } from "../features/verifyautheticator/redux/authenticatorSlice"

export default function Authentication({ ...params }) {
    // const { response } = useSelector(state => state.authenticatorReducer)
    const dispatch = useDispatch()
    const data = Tools.getLcalStorage({ key: "userinfo" })
    if (data) {
        dispatch(setAuthenticationdetails(JSON.parse(data)))
        return params?.children
    }
    // useEffect(() => {
    //     const data = Tools.getLcalStorage({ key: "userinfo" })
    //     if (data) {
    //         dispatch(authenticator({ token: JSON.parse(data).token }))
    //     }
    // }, [])
    // if (response?.role) {
    //     return params?.children
    // }
}