import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { auctions } from "./redux/auctionsSlice"
import { getUserDetails } from "../../tools/tools"
import "../../assets/css/styles.css"
import Loader from "../../components/loader"
import { Box, Link } from "@mui/material"
export default function Auctions() {
    const dispatch = useDispatch()
    const { response, loading } = useSelector(state => state.auctionsReducer)
    const { token } = getUserDetails()
    useEffect(() => {
        dispatch(auctions({ token: token }))
    }, [])
    return (
        <>
            {loading
                && (
                    <Loader />
                )
            }
            <section className="section">
                <div className="row">
                    {
                        response?.map((auction, index) => {
                            return (
                                <div className="col-lg-3" key={index}>
                                    <div className="card">
                                        <div className="filter">
                                            <Link style={{ cursor: "pointer", color: "black", textDecoration: "none" }} className="icon show" data-bs-toggle="dropdown" aria-expanded="true"><i className="bi bi-three-dots"></i></Link>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <li><Link style={{ cursor: "pointer", color: "black", textDecoration: "none" }} className="dropdown-item">View More</Link></li>
                                            </ul>
                                        </div>
                                        <div className="card-header">Auction :- {auction.id}</div>
                                        <div className="card-body">
                                            <p className="card-text">
                                                Description :-
                                                {auction.description}
                                            </p>
                                            <p className="card-text">
                                                Company Name :- {auction.companyname}
                                            </p>
                                            <p className="card-text">
                                                Item :- {auction.itemname}
                                            </p>
                                            <p className="card-text">
                                                Quantity :- {auction.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        response?.length == 0 && !loading && (<Box>
                            <div className="container-fluid" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                                <div className="row justify-content-center">
                                    <div className="col-md-12">
                                        <div className="container">
                                            Auctions Not Avaliable
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Box>)
                    }
                </div>
            </section>
        </>)
}