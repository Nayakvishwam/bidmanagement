import { Link as MuiLink } from "@mui/material"
import { useState } from "react"
import $ from "jquery"
export default function Navbar() {
    const [tooglesidebar, setToogleSidebar] = useState(false)
    return <header id="header" className="header fixed-top d-flex align-items-center">

        <div className="d-flex align-items-center justify-content-between">
            <MuiLink style={{ textDecoration: "none" }} className="logo d-flex align-items-center">
                <img src="assets/img/logo.png" alt="" />
                <span className="d-none d-lg-block">NiceAdmin</span>
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

                    <MuiLink style={{ textDecoration: "none", color: "black" }} className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                        <span className="d-none d-md-block dropdown-toggle ps-2">K. Anderson</span>
                    </MuiLink>

                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                        <li className="dropdown-header">
                            <h6>Kevin Anderson</h6>
                            <span>Web Designer</span>
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
                        <li>
                            <hr className="dropdown-divider" />
                        </li>

                        <li>
                            <MuiLink style={{ textDecoration: "none", color: "black" }} className="dropdown-item d-flex align-items-center">
                                <i className="bi bi-gear"></i>
                                <span>Account Settings</span>
                            </MuiLink>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>

                        <li>
                            <MuiLink style={{ textDecoration: "none", color: "black" }} className="dropdown-item d-flex align-items-center">
                                <i className="bi bi-question-circle"></i>
                                <span>Need Help?</span>
                            </MuiLink>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>

                        <li>
                            <MuiLink style={{ textDecoration: "none", color: "black" }} className="dropdown-item d-flex align-items-center" >
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