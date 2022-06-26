import SignupForm from "./components/signupForm/signupForm";
import LoginForm from "./components/loginForm/LoginForm";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import { useState,  Redirect } from "react";
import "./scss/custom.scss";
import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"


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

  return (
    <BrowserRouter>
      <Header isConnected={isConnected} onConnect={handleIsConnected}/>
      <Routes>
        <Route exact path="/signup" element={isConnected ? <Navigate to="/posts" replace={true} /> : <SignupForm onConnect={handleIsConnected}/>} />
        <Route path="/login" element={isConnected ? <Navigate to="/posts" replace={true} /> : <LoginForm onConnect={handleIsConnected}/>}/>
        <Route path="/posts" element={isConnected ? <p>Bonjour</p> : <Navigate to="/login" replace={true} />}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
      
  );
}

export default App;

