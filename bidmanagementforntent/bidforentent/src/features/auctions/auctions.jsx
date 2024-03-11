import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { auctions } from "./redux/auctionsSlice"
import { getUserDetails } from "../../tools/tools"
import Loader from "../../components/loader"
import { Box } from "@mui/material"
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
                        response?.map((auction) => {
                            return (
                                <div className="col-lg-3">
                                    <div className="card">
                                        <div class="card-header">{auction.id}</div>
                                        <div className="card-body">
                                            <h5 class="card-title">Auction</h5>
                                            <p className="card-text">
                                                Description :-
                                                {auction.description}
                                            </p>
                                            Company Name :- {auction.companyname}
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