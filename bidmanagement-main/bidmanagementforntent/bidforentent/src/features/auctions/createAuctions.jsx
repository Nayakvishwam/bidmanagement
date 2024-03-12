import { useEffect, useState } from "react"
import { getUserDetails } from "../../tools/tools"
import { itemApi } from "../items/redux/itemsSlice"
import { useDispatch, useSelector } from "react-redux"
import $, { event, param } from "jquery"
import { Snackbar, Alert } from "@mui/material"
import { addAuction } from "./redux/auctionsSlice"

export default function CreateAuctions() {
    const { token } = getUserDetails()
    const dispatch = useDispatch()
    const { response } = useSelector(state => state.itemReducer)
    const getItems = async () => {
        await dispatch(itemApi({ token: token }))
    }
    const [userfullinfo, setUserFullInfo] = useState(
        {
            itemsaddparts: [],
            count: 1,
            selecteditems: {}
        }
    )
    const itemsselected = Object.values(userfullinfo.selecteditems)
    const setSelectedItem = ({ ...params }) => {
        const index = params.index
        delete params.index
        const setselecteditem = {
            ...userfullinfo.selecteditems,
            [index]: {
                ...userfullinfo.selecteditems[index],
                ...params
            }
        }
        setUserFullInfo(preState => ({
            ...preState,
            ["selecteditems"]: setselecteditem
        }))
    }
    const AddItemsParts = () => {
        let parts = []
        for (let dataindex = 0; dataindex < userfullinfo.count - 1; dataindex++) {
            parts.push(
                <>
                    <div className="row mb-3" key={"data" + dataindex + 1}>
                        <label className="col-sm-2 col-form-label">Select Item</label>
                        <div className="col-sm-10" key={"chield" + dataindex}>
                            <select className="form-select"
                                onChange={async ({ target }) => { await setSelectedItem({ "index": dataindex + 1, "item_id": target.value ? Number(target.value) : target.value }) }}
                            >
                                {
                                    response?.length > 0 && (response?.map((getresponse, index) => {
                                        return <option key={index} value={getresponse.id} disabled={itemsselected.some(obj => obj.item_id === getresponse.id)}>{getresponse.name}</option>
                                    }))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3" key={"info" + dataindex + 1}>
                        <label htmlFor="qunatity" className="col-sm-2 col-form-label">Quantity</label>
                        <div className="col-sm-10" key={"chield" + dataindex + 1}>
                            <input
                                className="form-control"
                                type="number"
                                id="quantity"
                                min={"1"}
                                onChange={({ target }) => setSelectedItem({ "index": dataindex + 1, "quantity": target.value ? Number(target.value) : target.value })}>

                            </input>
                        </div>
                    </div>
                </>
            )
        }
        return parts
    }
    useEffect(() => {
        getItems()
    }, [])
    const alertdefaultdata = {
        severity: "",
        message: "",
        open: false
    }
    const handleClose = () => {
        setAlertInfo(preState => ({
            ...preState,
            ...alertdefaultdata
        }))
    };
    const [alertinfo, setAlertInfo] = useState(alertdefaultdata)
    const handleSubmit = async (event) => {
        $("#addauction").prop("disabled", true);
        $("#removeitem").prop("disabled", true);
        $("#additem").prop("disabled", true);
        event.preventDefault()
        let formData = new FormData(event.target)
        formData = Object.fromEntries(formData)
        const data = Object.values(formData)
        if (!data.includes('') && !data.includes(null)) {
            formData.item_id = Number(formData.item_id)
            formData.quantity = Number(formData.quantity)
            formData.token = token
            formData.auctions_lines = Object.values(userfullinfo.selecteditems)
            delete formData.item_id
            delete formData.quantity
            const { payload } = await dispatch(addAuction(formData))
            if (payload?.status_code == 200) {
                history.push("/app/auctions")
            }
            else if (payload) {
                setAlertInfo(preState => ({
                    ...preState,
                    severity: "error",
                    message: payload.message,
                    open: true
                }))
            }
        }
        $("#addauction").prop("disabled", false);
        $("#removeitem").prop("disabled", false);
        $("#additem").prop("disabled", false);
    }
    return (
        <>
            <div>
                <Snackbar open={alertinfo.open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity={alertinfo.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {alertinfo.message}
                    </Alert>
                </Snackbar>
            </div>
            <section className="section">
                <div className="row" style={{ justifyContent: "center", alignItems: "center", marginTop: 60 }}>
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Create Auction</h5>
                                <form method="post" onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
                                        <div className="col-sm-10">
                                            <textarea className="form-control" id="description" name="description" style={{ height: 100 }} required></textarea>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Select Item</label>
                                        <div className="col-sm-10">
                                            <select className="form-select" name="item_id"
                                                onChange={({ target }) => setSelectedItem({ "index": 0, "item_id": target.value ? Number(target.value) : target.value })}
                                            >
                                                {
                                                    response?.length > 0 && (response?.map((response, index) => {
                                                        return <option key={index} value={response.id} disabled={itemsselected.some(obj => obj.item_id === response.id)}>{response.name}</option>
                                                    }))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label htmlFor="qunatity" className="col-sm-2 col-form-label">Quantity</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" type="number" id="quantity" name="quantity" min={"1"} required></input>
                                        </div>
                                    </div>
                                    {userfullinfo.count > 1 ? AddItemsParts().map((response) => {
                                        return response
                                    }
                                    ) : null}
                                    {userfullinfo.count != 1 && (<div className="row mb-3">
                                        <div className="col-sm-10">
                                            <button type="button" id="removeitem" onClick={() => {
                                                setUserFullInfo(preState => ({
                                                    ...preState,
                                                    count: userfullinfo.count - 1
                                                }))
                                            }} className="btn btn-primary">Remove Item</button>
                                        </div>
                                    </div>)}
                                    {userfullinfo.count < response?.length && (<div className="row mb-3">
                                        <div className="col-sm-10">
                                            <button type="button" id="additem" style={{ position: "absolute", right: 10 }} onClick={() => {
                                                console.log(userfullinfo.count)
                                                setUserFullInfo(preState => ({
                                                    ...preState,
                                                    count: userfullinfo.count + 1
                                                }))
                                            }} className="btn btn-primary">Add Item</button>
                                        </div>
                                    </div>)}
                                    <div className="row mb-3">
                                        <div className="col-sm-10">
                                            <button type="submit" id="addauction" className="btn btn-primary">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}