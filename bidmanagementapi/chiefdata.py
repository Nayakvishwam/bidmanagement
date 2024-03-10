secretkey = "L2QkMPUkkrBvvv4YjgXoww=="

jwt_regex_pattern = r'^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$'

rightsallow = {
    "superadmin": {
        "paths": [
            "/api/items",
            "/api/additem",
            "/api/deleteitems",
            "/api/edititem"
        ]
    }
}
