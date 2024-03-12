import { Link } from "react-router-dom"
// import { rights } from "../utilities/variables"
// import { getUserDetails } from "../tools/tools"

export default function Sidebar() {
    // const data = getUserDetails()
    return (<aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
            <li className="nav-item">
                <Link className="nav-link " to="/app/items">
                    <i className="bi bi-grid"></i>
                    <span>Items</span>
                </Link>
            </li>
            <>
                <li className="nav-item">
                    <Link className="nav-link collapsed" data-bs-target="#auctions" data-bs-toggle="collapse">
                        <i className="ri-at-line"></i>
                        <span>Auctions</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                </li>
                <ul id="auctions" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                    <li>
                        <Link to="/app/auctions">
                            <i className="bi bi-circle"></i><span>View Auctions</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/createauction">
                            <i className="bi bi-circle"></i><span>Add Auction</span>
                        </Link>
                    </li>
                </ul>
            </>
        </ul>
    </aside>)
}