import { Link } from "react-router-dom"
import { rights } from "../utilities/variables"
import { getUserDetails } from "../tools/tools"

export default function Sidebar() {
    const data = getUserDetails()
    return (<aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
            {rights[data.role]?.items && (<li className="nav-item">
                <Link className="nav-link " to="/app/items">
                    <i className="bi bi-grid"></i>
                    <span>Items</span>
                </Link>
            </li>)}
        </ul>
    </aside>)
}