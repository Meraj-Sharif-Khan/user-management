import { ToastContainer } from "react-toastify"
import Login from "./components/login"
import { Routes,Route, Navigate} from "react-router-dom"
import NotFound from "./components/notFoundComponente"
import Signup from "./components/signup"
import Users from "./components/users"


function App() {
  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/" element={<Users/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>      
      </Routes>
    </>
  )
}

export default App
