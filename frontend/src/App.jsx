import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SignUp } from "./pages/Signup"
import { SignIn } from "./pages/Signin"
import { SendMoney } from "./components/SendMoney"
import { Dashboard } from "./pages/Dashboard"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/send" element={<SendMoney/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
