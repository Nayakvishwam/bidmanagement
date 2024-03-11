import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authenticator } from "../features/verifyautheticator/redux/authenticatorSlice"
import Tools from "../tools/tools"

export default function Authentication({ ...params }) {
    const { response } = useSelector(state => state.authenticatorReducer)
    const dispatch = useDispatch()
    useEffect(() => {
        const data = Tools.getLcalStorage({ key: "userinfo" })
        if (data) {
            dispatch(authenticator({ token: JSON.parse(data).token }))
        }
    }, [])
    if (response?.userid) {
        return params?.children
    }
}