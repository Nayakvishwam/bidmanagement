import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authenticator } from "../features/verifyautheticator/redux/authenticatorSlice"
import { useNavigate } from "react-router-dom"
import Tools from "../tools/tools"

export default function ({ ...params }) {
    const { response } = useSelector(state => state.authenticatorReducer)
    const dispatch = useDispatch()
    const navigate = useNavigate()
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