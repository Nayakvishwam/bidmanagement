import { apiPaths, masterCaller } from "../../../utilities/apiCaller";

export default function Authenticator({ ...params }) {
    return masterCaller.post({ url: apiPaths.verifyauthenticatorUrl, body: params })
}