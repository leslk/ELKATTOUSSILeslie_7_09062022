import SignupForm from "./components/signupForm/signupForm";
import LoginForm from "./components/loginForm/LoginForm";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import { useState,  Redirect } from "react";
import "./scss/custom.scss";
import React from "react";
import {BrowserRouter, Routes, Switch, Route} from "react-router-dom"


function App() {

  function handleIsConnected() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }

  const [isConnected, setIsConnected] = useState(JSON.parse(localStorage.getItem("token")) ? true : false); // chercher si token lors du refresh
  // callback onConnect(isUserConnected)
  // -> setConnected(true)
  return (
    <BrowserRouter>
      <Header isConnected={isConnected}/>
      <Routes>
        <Route exact path="/signup" element={<SignupForm onConnect={handleIsConnected}/>} />
        <Route path="/login" element={<LoginForm onConnect={handleIsConnected}/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
      
  );
}

export default App;

