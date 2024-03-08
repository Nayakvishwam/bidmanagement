import {
    Routes, Route,
    unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import { history } from "../app/history";
import Login from "../features/login/login";
import Registration from "../features/registration/registration";

export default function Router() {
    return (
        <HistoryRouter history={history}>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Registration />}></Route>
            </Routes>
        </HistoryRouter>
    )
}