export const roles = {
    admin: "Admin",
    superadmin: "Super Admin",
}
export const rights = {
    superadmin: {
        "items": true
    },
    admin: {
        "auctions": true,
        "createAuctions": true

    }
}
export const pagespaths = {
    "/app/items/": {
        name: "Items",
        icon: "bi bi-grid"
    },
    "/app/auctions/": {
        name: "Auctions",
        icon: " ri-at-line"
    },
    "/app/createauction/": {
        name: "Create Auction",
        icon: " ri-at-line"
    }
}

export const roleredirect = {
    superadmin: {
        pagepath: "/app/items/"
    },
    admin: {
        pagepath: "/app/auctions/"
    }
}