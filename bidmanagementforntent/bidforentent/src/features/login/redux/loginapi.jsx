import { apiPaths, masterCaller } from "../../../utilities/apiCaller";

export default function login({ ...params }) {
    return masterCaller.post({ url: apiPaths.loginUrl, body: params })
}