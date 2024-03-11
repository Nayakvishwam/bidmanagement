import { useEffect, useState } from "react"
import { getUserDetails } from "../../tools/tools"
import { itemApi } from "../items/redux/itemsSlice"
import { useDispatch, useSelector } from "react-redux"
import $ from "jquery"
import { Snackbar, Alert } from "@mui/material"
import { history } from "../../app/history"
import { addAuction } from "./redux/auctionsSlice"

export default function CreateAuctions() {
    const { company_id, token } = getUserDetails()
    const dispatch = useDispatch()
    const { response } = useSelector(state => state.itemReducer)
    const getItems = async () => {
        await dispatch(itemApi({ token: token }))
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
        event.preventDefault()
        let formData = new FormData(event.target)
        formData = Object.fromEntries(formData)
        const data = Object.values(formData)
        if (!data.includes('') && !data.includes(null)) {
            formData.item_id = Number(formData.item_id)
            formData.quantity = Number(formData.quantity)
            formData.company_id = Number(formData.company_id)
            formData.token = token
            const { payload } = await dispatch(addAuction(formData))
            console.log(payload)
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
                                    <input type="hidden" name="company_id" value={company_id} />
                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Select Item</label>
                                        <div className="col-sm-10">
                                            <select className="form-select" name="item_id" aria-label="Default select example" required>
                                                {
                                                    response?.length > 0 && (response?.map((response, index) => {
                                                        return <option key={index} value={response.id}>{response.name}</option>
                                                    }))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label htmlFor="qunatity" className="col-sm-2 col-form-label">Quantity</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" type="number" id="quantity" name="quantity" required></input>
                                        </div>
                                    </div>
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