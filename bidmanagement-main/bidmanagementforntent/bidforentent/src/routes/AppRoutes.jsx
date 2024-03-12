import { Routes, Route } from "react-router-dom";
import Items from "../features/items/items";
// import CheckRights from "../utilities/checkAuthentication";
import Auctions from "../features/auctions/auctions";
import CreateAuctions from "../features/auctions/createAuctions";
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="items/" element={
                // <CheckRights part={"items"}>
                <Items />
                // </CheckRights>
            }>
            </Route>
            <Route path="auctions/" element={
                // <CheckRights part={"auctions"}>
                <Auctions />
                // </CheckRights>
            }>
            </Route>
            <Route path="createauction/" element={
                // <CheckRights part={"createAuctions"}>
                <CreateAuctions />
                // </CheckRights>
            }>
            </Route>
        </Routes >
    )
}