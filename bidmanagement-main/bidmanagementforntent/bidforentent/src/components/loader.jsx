import { Box, CircularProgress } from "@mui/material"

export default function Loader() {
    return (
        <Box>
            <div className="container-fluid" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="container">
                            <CircularProgress />
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    )
}