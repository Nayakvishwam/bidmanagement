const apiUrl = "http://127.0.0.1:8000/"

export const apiPaths = {
    loginUrl: apiUrl + "api/login",
    registerUrl: apiUrl + "api/register",
    verifyauthenticatorUrl: apiUrl + "api/verifyauthenticator",
    itemsUrl: apiUrl + "api/items",
    AdditemUrl: apiUrl + "api/additem",
    DeleteitemUrl: apiUrl + "api/deleteitems",
    EdititemUrl: apiUrl + "api/edititem",
    AuctionsUrl: apiUrl + "api/getauctions",
    AddAuctionUrl: apiUrl + "api/addauction"
}

export const masterCaller = {
    callfunc: async function callfunc({ ...params }) {
        const otherParams = ({ ...params }) => {
            let obj = {}
            if (params.method == "post" ||
                params.method == "DELETE" ||
                params.method == "put") {
                obj["body"] = JSON.stringify(params.body)
            }
            return obj
        }
        const response = await fetch(params.url, {
            method: params.method,
            headers: params.headers,
            ...otherParams(params)
        }).then((response) => {
            return response.json()
        }).catch((err) => {
            return err
        })
        return response
    },
    get: async function get({ ...params }) {
        return this.callfunc({
            url: params.url,
            method: "get",
            headers: {
                ...params.headers,
                "Content-Type": "application/json"
            }
        })
    },
    post: async function post({ ...params }) {
        return this.callfunc({
            url: params.url,
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                ...params.body
            }
        })
    },
    delete: async function remove({ ...params }) {
        return this.callfunc({
            url: params.url,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                ...params.body
            }
        })
    },
    put: async function put({ ...params }) {
        return this.callfunc({
            url: params.url,
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                ...params.body
            }
        })
    }
}