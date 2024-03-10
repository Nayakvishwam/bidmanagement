import { DataGrid } from "@mui/x-data-grid"
import "../../assets/css/styles.css"
import { useEffect, useState } from "react"
import {
    Alert, Box,
    Button, CircularProgress, Dialog,
    DialogActions, DialogContent,
    DialogTitle, Link,
    Snackbar, TextField
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { additemApi, itemApi, deleteitemApi } from "./redux/itemsSlice"
import { getUserDetails } from "../../tools/tools";
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
                return <>
                    <a onMouseEnter={() => {
                        setData(preState => ({
                            ...preState,
                            ["edititem"]: params.row
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
        if (payload.status_code == 200) {
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
                <Snackbar open={data.alertinfo.open} autoHideDuration={6000} onClose={handleAlertClose}>
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
                    Are You Sure You Want To Remove {data.selecteditem.length > 0 ? "Items" : "Item"}
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
                                    message: `Remove ${data.selecteditem > 1 ? "Items" : "Item"} Details!`
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
                open={data.open}
                onClose={() => handleClose("open")}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Add Item"}
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
                        onChange={({ target }) => {
                            setData(preState => ({
                                ...preState,
                                ["itemdata"]: {
                                    name: target.value
                                }
                            }))
                        }}
                        variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose("open")}>Cancel</Button>
                    <Button onClick={async () => {
                        if (data.itemdata.name) {
                            const { payload } = await dispatch(additemApi({ token: token, name: data.itemdata.name }))
                            if (payload?.status_code == 200) {
                                setData(preState => ({
                                    ...preState,
                                    open: false,
                                    alertinfo: {
                                        severity: "success",
                                        open: true,
                                        message: `Add New Item Details!`
                                    }
                                }))
                                getItems()
                            }
                            else if (payload?.status_code == 400) {
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
                            handleClose("open")
                        }
                    }}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            {loading
                && (
                    <Box>
                        <div className="container-fluid" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <div className="container">
                                        <CircularProgress />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
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