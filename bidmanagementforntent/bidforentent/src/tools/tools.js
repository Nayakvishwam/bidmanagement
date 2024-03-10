import { useSelector } from "react-redux"

const setLocalStorage = ({ ...params }) => {
    localStorage.setItem(params.key, params.value)
    return
}

const getLcalStorage = ({ ...params }) => {
    return localStorage.getItem(params.key)
}
export function getUserDetails(){
    const { response } = useSelector(state => state.authenticatorReducer)
    return response
}
const Tools = {
    setLocalStorage: setLocalStorage,
    getLcalStorage: getLcalStorage
}
export default Tools