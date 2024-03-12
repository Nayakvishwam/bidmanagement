import { apiPaths, masterCaller } from "../../../utilities/apiCaller";

export function ItemData({ ...params }) {
    return masterCaller.post({ url: apiPaths.itemsUrl, body: params })
}

export function AddItemData({ ...params }) {
    return masterCaller.post({ url: apiPaths.AdditemUrl, body: params })
}

export function DeleteItems({ ...params }) {
    return masterCaller.delete({ url: apiPaths.DeleteitemUrl, body: params })
}

export function EditItem({ ...params }) {
    return masterCaller.put({ url: apiPaths.EdititemUrl, body: params })
}