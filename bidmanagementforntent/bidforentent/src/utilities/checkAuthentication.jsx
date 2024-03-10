import RightsPopUp from "../components/rightspopup"
import { getUserDetails } from "../tools/tools"
import { rights } from "./variables"

export default function CheckRights({ ...params }) {
    const { role } = getUserDetails()
    const rightsinfo = rights[role]
    if (rightsinfo) {
        if (rightsinfo[params.part]) {
            return params?.children
        }
    }
    return <RightsPopUp />
}