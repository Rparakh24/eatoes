import { Route, Routes } from "react-router-dom";
import AdminMenu from "./pages/AdminMenu";
import SignUp from "./pages/SignUp";
import Signin from "./pages/Signin";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
function App(){
  return (
    <div>
      <Routes>
        <Route path="/admin" element={<AdminMenu/>}/>
        <Route path="/" element={<SignUp/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/confirm" element={<Confirmation/>}/>
      </Routes>
    </div>
  )
}

export default App
