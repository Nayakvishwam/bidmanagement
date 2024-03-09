import { apiPaths, masterCaller } from "../../../utilities/apiCaller";

export default function Registration({ ...params }) {
    return masterCaller.post({ url: apiPaths.registerUrl, body: params })
}