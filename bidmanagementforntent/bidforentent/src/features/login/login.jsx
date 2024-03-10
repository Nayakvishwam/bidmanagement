import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginuser } from "./redux/loginSlice";
import React from "react";
import { Snackbar, Alert } from "@mui/material";
import $ from "jquery"
import { history } from "../../app/history";
import Tools from "../../tools/tools";
export default function Login() {
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
    const [alertinfo, setAlertInfo] = React.useState(alertdefaultdata)
    const dispatch = useDispatch()
    const handleOnSubmit = async (event) => {
        event.preventDefault()
        $("#submit").prop("disabled", true);
        let formData = new FormData(event.target)
        formData = Object.fromEntries(formData)
        const { payload } = await dispatch(loginuser(formData))
        if (payload.status_code == 200) {
            await new Promise((resolve, reject) => {
                try {
                    Tools.setLocalStorage({ key: "userinfo", value: JSON.stringify(payload.data) })
                    resolve({ finish: true })
                } catch (error) {
                    reject(error)
                }
            }).then(response => {
                if (response?.finish) {
                    return history.push("/app")
                }
            })
        }
        else {
            setAlertInfo(preState => ({
                ...preState,
                severity: "error",
                message: payload.message,
                open: true
            }))
        }
        $("#submit").prop("disabled", false);
    }
    return (
        <main>
            <div>
                <Snackbar open={alertinfo.open} autoHideDuration={6000} onClose={handleClose}>
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
            <div className="container">
                <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="card mb-3">

                                    <div className="card-body">

                                        <div className="pt-4 pb-2">
                                            <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                            <p className="text-center small">Enter your username & password to login</p>
                                        </div>

                                        <form className="row g-3 needs-validation" onSubmit={(event) => handleOnSubmit(event)}>

                                            <div className="col-12">
                                                <label htmlFor="yourUsername" className="form-label">Email</label>
                                                <div className="input-group has-validation">
                                                    <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                    <input type="email" name="email" className="form-control" id="yourUsername" required />
                                                    <div className="invalid-feedback">Please enter your username.</div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="yourPassword" className="form-label">Password</label>
                                                <input type="password" name="password" className="form-control" id="yourPassword" required />
                                                <div className="invalid-feedback">Please enter your password!</div>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100" id="submit" type="submit">Login</button>
                                            </div>
                                            <div className="col-12">
                                                <p className="small mb-0">Don't have account? <Link to="/register">Create an account</Link></p>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

            </div>
        </main>
    )
}