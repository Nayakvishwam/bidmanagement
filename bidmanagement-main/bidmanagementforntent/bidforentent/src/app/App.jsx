import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import "../assets/vendor/bootstrap/css/bootstrap.min.css"
import "../assets/vendor/bootstrap-icons/bootstrap-icons.css"
import "../assets/vendor/boxicons/css/boxicons.min.css"
import "../assets/vendor/quill/quill.snow.css"
import "../assets/vendor/quill/quill.bubble.css"
import "../assets/vendor/remixicon/remixicon.css"
import "../assets/vendor/simple-datatables/style.css"
import "../assets/css/style.css"
import "../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
import "../assets/vendor/quill/quill.min.js"
import "../assets/vendor/simple-datatables/simple-datatables.js"
import "../assets/vendor/tinymce/tinymce.min.js"
import "../assets/js/main.js"
import AppRoutes from '../routes/AppRoutes.jsx'
function App() {
  return (
    <>
      <Navbar />
      <main id="main" className="main">
        <AppRoutes />
      </main>
      <Sidebar />
    </>
  )
}

export default App
