import SignupForm from "./components/signupForm/signupForm";
import LoginForm from "./components/loginForm/LoginForm";

import "./scss/custom.scss";
import React from "react";
import {BrowserRouter, Routes, Switch, Route} from "react-router-dom"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupForm/>}/>
        <Route path="/login" element={<LoginForm/>}/>
      </Routes>
    </BrowserRouter>
      
  );
}

export default App;

