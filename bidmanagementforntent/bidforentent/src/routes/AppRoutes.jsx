import { Routes, Route } from "react-router-dom";
import Items from "../features/items/items";
import CheckRights from "../utilities/checkAuthentication";
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="items/" element={
                <CheckRights part={"items"}>
                    <Items />
                </CheckRights>
            }>
            </Route>
        </Routes>
    )
}