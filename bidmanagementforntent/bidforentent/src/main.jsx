import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from "./routes/routes"
import "./assets/vendor/bootstrap/css/bootstrap.min.css"
import "./assets/vendor/bootstrap-icons/bootstrap-icons.css"
import "./assets/vendor/boxicons/css/boxicons.min.css"
import "./assets/vendor/quill/quill.snow.css"
import "./assets/vendor/quill/quill.bubble.css"
import "./assets/vendor/remixicon/remixicon.css"
import "./assets/vendor/simple-datatables/style.css"
import "./assets/css/style.css"
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
