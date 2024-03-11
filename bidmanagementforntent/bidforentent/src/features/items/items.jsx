import { DataGrid } from "@mui/x-data-grid"
import "../../assets/css/styles.css"
import { useEffect, useState } from "react"
import {
    Alert, Box,
    Button, Dialog,
    DialogActions, DialogContent,
    DialogTitle, Link,
    Snackbar, TextField
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { additemApi, itemApi, deleteitemApi, edititemApi } from "./redux/itemsSlice"
import { getUserDetails } from "../../tools/tools";
import Loader from "../../components/loader"

export default function Items() {
    const dispatch = useDispatch()
    const { token } = getUserDetails()
    const { response, loading } = useSelector(state => state.itemReducer)
    const alertdefaultdata = {
        severity: "",
        message: "",
        open: false
    }
    const [data, setData] = useState({
        open: false,
        deleteopen: false,
        itemdata: {
            name: null
        },
        alertinfo: alertdefaultdata,
        selecteditem: [],
        edititem: {},
        editviewopen: false
    })
    const columns = [
        {
            field: 'name',
            headerName: 'Item Name',
            width: 150,
            editable: true
        },
        {
            field: 'id',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => {
                let row = {
                    itemid: params.row.id,
                    name: params.row.name
                }
                return <>
                    <a onMouseEnter={() => {
                        setData(preState => ({
                            ...preState,
                            ["edititem"]: row,
                            editviewopen: true,
                            open: false
                        }))
                    }
                    } style={{ color: "blue", cursor: "pointer", textDecoration: "none" }}><i className=" ri-pencil-fill"></i></a>
                </>
            }
        },
    ]
    const [rows, setRows] = useState([])
    const getItems = async () => {
        const { payload } = await dispatch(itemApi({ token: token }))
        if (payload?.status_code == 200) {
            setRows(payload.data)
        }
    }
    const handleClose = (key) => {
        setData(preState => ({
            ...preState,
            [key]: false
        }))
    }
    useEffect(() => {
        getItems()
    }, [])
    const handleAlertClose = () => {
        setData(preState => ({
            ...preState,
            ["alertinfo"]: alertdefaultdata
        }))
    }
    return (
        <>
            <div>
                <Snackbar open={data.alertinfo.open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={handleAlertClose}>
                    <Alert
                        onClose={handleAlertClose}
                        severity={data.alertinfo.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {data.alertinfo.message}
                    </Alert>
                </Snackbar>
            </div>
            <Dialog
                open={data.deleteopen}
                onClose={() => handleClose("deleteopen")}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Item"}
                </DialogTitle>
                <DialogContent>
                    Are You Sure You Want To Remove {data.selecteditem.length > 1 ? "Items" : "Item"}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose("deleteopen")}>Cancel</Button>
                    <Button onClick={async () => {
                        const { payload } = await dispatch(deleteitemApi({ token: token, ids: data.selecteditem }))
                        if (payload?.status_code == 200) {
                            setData(preState => ({
                                ...preState,
                                open: false,
                                alertinfo: {
                                    severity: "success",
                                    open: true,
                                    message: `Remove ${data.selecteditem.length > 1 ? "Items" : "Item"} Details!`
                                }
                            }))
                            getItems()
                        }
                        handleClose("deleteopen")
                    }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={data.open || data.editviewopen}
                onClose={() => handleClose(data.open ? "open" : "editviewopen")}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {data.editviewopen ? "Edit" : "Add"} Item
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        type="text"
                        fullWidth
                        value={data.editviewopen ? data.edititem?.name : null}
                        onChange={({ target }) => {
                            setData(preState => ({
                                ...preState,
                                [data.editviewopen ? "edititem" : "itemdata"]: data.editviewopen ? {
                                    ...data.edititem,
                                    name: target.value
                                } : {
                                    name: target.value
                                }
                            }))
                        }}
                        variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(data.open ? "open" : "editviewopen")}>Cancel</Button>
                    <Button onClick={async () => {
                        if (data.open ? data.itemdata.name : data.edititem.name) {
                            const { payload } = await dispatch(data.open ?
                                additemApi({ token: token, name: data.itemdata.name }) :
                                edititemApi({ token: token, ...data.edititem }))
                            if (payload?.status_code == 200) {
                                setData(preState => ({
                                    ...preState,
                                    open: false,
                                    alertinfo: {
                                        severity: "success",
                                        open: true,
                                        message: `${data.editviewopen ? "Edit" : "Add New"} Item Details!`
                                    }
                                }))
                                getItems()
                            }
                            else if (payload) {
                                setData(preState => ({
                                    ...preState,
                                    open: false,
                                    alertinfo: {
                                        severity: "error",
                                        open: true,
                                        message: payload.message
                                    }
                                }))
                            }
                            handleClose(data.open ? "open" : "editviewopen")
                        }
                    }}>
                        {data.open ? "Add" : "Edit"}
                    </Button>
                </DialogActions>
            </Dialog>
            {loading
                && (
                    <Loader />
                )
            }
            {!loading && (<section className="section">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="filter">
                                <Link style={{ cursor: "pointer", color: "black", textDecoration: "none" }} className="icon" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></Link>
                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li onClick={() => {
                                        setData(preState => ({ ...preState, ['open']: true }))
                                    }}><Link style={{ cursor: "pointer", color: "black", textDecoration: "none" }} className="dropdown-item" >Add</Link></li>
                                    {data.selecteditem.length > 0 && (
                                        <li onClick={() => {
                                            setData(preState => ({ ...preState, ['deleteopen']: true }))
                                        }}><Link style={{ cursor: "pointer", color: "black", textDecoration: "none" }} className="dropdown-item" >Delete</Link></li>
                                    )}
                                </ul>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Items</h5>
                                {response?.length > 0 && (<Box sx={{ height: 400, width: '100%' }}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                                paginationModel: {
                                                    pageSize: 10,
                                                },
                                            },
                                        }}
                                        pageSizeOptions={[5, 10]}
                                        checkboxSelection
                                        disableRowSelectionOnClick
                                        onRowSelectionModelChange={(data) => {
                                            setData(preState => ({
                                                ...preState,
                                                selecteditem: data
                                            }))
                                        }}
                                    />
                                </Box>)}
                            </div>
                        </div>
                    </div>
                </div>
            </section>)}
        </>
    )
}