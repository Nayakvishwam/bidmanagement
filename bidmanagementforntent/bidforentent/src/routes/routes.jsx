import {
    Routes, Route,
    unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import { history } from "../app/history";
import Login from "../features/login/login";
import Registration from "../features/registration/registration";
import App from "../app/App";
import Authentication from "./checkauthenticator";
export default function Router() {
    return (
        <HistoryRouter history={history}>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Registration />}></Route>
                <Route path="/app" element={() => false}></Route>
                <Route path="app/*" element={
                    <Authentication>
                        <App />
                    </Authentication>
                }></Route>
            </Routes>
        </HistoryRouter>
    )
}