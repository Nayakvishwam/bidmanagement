import { apiPaths, masterCaller } from "../../../utilities/apiCaller";

export function Auctions({ ...params }) {
    return masterCaller.post({ url: apiPaths.AuctionsUrl, body: params })
}

export function AddAuction({ ...params }) {
    return masterCaller.post({ url: apiPaths.AddAuctionUrl, body: params })
}