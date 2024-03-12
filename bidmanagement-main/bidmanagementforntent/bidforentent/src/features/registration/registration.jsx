import React from "react";
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Snackbar, Alert } from "@mui/material";
import { registerUser } from "./redux/registerSlice";
import { history } from "../../app/history";
import $ from "jquery"
export default function Registration() {
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
    const handleSubmit = async (event) => {
        $("#submit").prop("disabled", true);
        event.preventDefault()
        let formData = new FormData(event.target)
        formData = Object.fromEntries(formData)
        const { payload } = await dispatch(registerUser(formData))
        if (payload?.status_code == 200) {
            setAlertInfo(preState => ({
                ...preState,
                severity: "success",
                message: payload.message,
                open: true
            }))
            return history.push("/login")
        }
        else if (payload) {
            setAlertInfo(preState => ({
                ...preState,
                severity: "error",
                message: payload.message,
                open: true
            }))
        }
        $("#submit").prop("disabled", false);
    }
    return (<main>
        <div className="container">
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
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                                        <p className="text-center small">Enter your personal details to create account</p>
                                    </div>
                                    <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
                                        <div className="col-12">
                                            <label htmlFor="yourCompany" className="form-label">Your Company Name</label>
                                            <input type="text" name="companyname" className="form-control" id="yourCompany" required />
                                            <div className="invalid-feedback">Please, enter your name!</div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="youremail" className="form-label">Your Email</label>
                                            <input type="email" name="email" className="form-control" id="youremail" />
                                            <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="yourPassword" className="form-label">Password</label>
                                            <input type="password" name="password" className="form-control" id="yourPassword" required />
                                            <div className="invalid-feedback">Please enter your password!</div>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary w-100" id="submit" type="submit">Create Account</button>
                                        </div>
                                        <div className="col-12">
                                            <p className="small mb-0">Already have an account? <Link to="/login">Log in</Link></p>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </div>
    </main>)
}