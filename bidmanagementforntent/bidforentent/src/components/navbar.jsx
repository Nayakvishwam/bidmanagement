import { Link as MuiLink } from "@mui/material"
import { useState } from "react"
import $ from "jquery"
import { useSelector } from "react-redux"
import { pagespaths, roles } from "../utilities/variables"
import { history } from "../app/history"
import userimage from "../assets/faces/User.png"
import { useLocation } from "react-router-dom"
export default function Navbar() {
    const [tooglesidebar, setToogleSidebar] = useState(false)
    const location = useLocation();
    const { response } = useSelector(state => state.authenticatorReducer)
    return <header id="header" className="header fixed-top d-flex align-items-center">

        <div className="d-flex align-items-center justify-content-between">
            <MuiLink style={{ textDecoration: "none" }} className="logo d-flex align-items-center">
                <i className={pagespaths[location.pathname].icon} />
                <span className=" d-none d-lg-block" style={{ marginLeft: 10 }}>{pagespaths[location.pathname].name}</span>
            </MuiLink>
            <i className="bi bi-list toggle-sidebar-btn" onClick={(event) => {
                setToogleSidebar(!tooglesidebar)
                if (!tooglesidebar) {
                    $('body').addClass('toggle-sidebar');
                }
                else {
                    $('body').removeClass('toggle-sidebar');
                }
            }}></i>
        </div>

        <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
                <li className="nav-item dropdown pe-3">
                    <MuiLink style={{ textDecoration: "none", color: "black", cursor: "pointer" }} className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                        <img src={userimage} alt="Profile" className="rounded-circle" />
                        <span className="d-none d-md-block dropdown-toggle ps-2">{response.email}</span>
                    </MuiLink>

                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                        <li className="dropdown-header">
                            <h6>{response.email}</h6>
                            <span>{roles[response.role]}</span>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>

                        <li>
                            <MuiLink style={{ textDecoration: "none", color: "black" }} className="dropdown-item d-flex align-items-center" >
                                <i className="bi bi-person"></i>
                                <span>My Profile</span>
                            </MuiLink>
                        </li>
                        <li onClick={() => {
                            localStorage.removeItem("userinfo")
                            history.push("/login")
                        }}>
                            <MuiLink style={{ textDecoration: "none", color: "black", cursor: "pointer" }} className="dropdown-item d-flex align-items-center" >
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Sign Out</span>
                            </MuiLink>
                        </li>

                    </ul>
                </li>

            </ul>
        </nav>

    </header>
}