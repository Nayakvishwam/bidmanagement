const setLocalStorage = ({ ...params }) => {
    localStorage.setItem(params.key, params.value)
}

const getLcalStorage = ({ ...params }) => {
    return localStorage.getItem(params.key)
}

const Tools = {
    setLocalStorage: setLocalStorage
}
export default Tools