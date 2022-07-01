import SignupForm from "./components/signupForm/signupForm";
import LoginForm from "./components/loginForm/LoginForm";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import { useState} from "react";
import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import CreatePost from "./components/post/CreatePost";


function App() {

  function handleIsConnected(userData) {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      console.log(JSON.parse(atob(token.split(".")[1])));
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isConnected, setIsConnected] = useState(JSON.parse(localStorage.getItem("token")) ? true : false); // chercher si token lors du refresh

  // if (isConnected) {
  //   const token = JSON.parse(localStorage.getItem("token"));
  //   if (token) {
  //     const exp = JSON.parse(atob(token.split(".")[1])).exp;
  //     if (exp > Date.now()) {
  //       setIsConnected(true);
  //       localStorage.clear();
  //     } else {
  //       setIsConnected(true);
  //     }
  //   } else {
  //     setIsConnected(false);
  //   }
  // }

  return (
    <BrowserRouter>
      <Header isConnected={isConnected} onConnect={handleIsConnected}/>
      <Routes>
        <Route path="/signup" element={isConnected ? <Navigate to="/posts" replace={true} /> : <SignupForm onConnect={handleIsConnected}/>} />
        <Route path="/login" element={isConnected ? <Navigate to="/posts" replace={true} /> : <LoginForm onConnect={handleIsConnected}/>}/>
        <Route exact path="/posts" element={isConnected ? < CreatePost user={user}/> : <Navigate to="/login" replace={true} />}/>
        <Route exact path="/" element={isConnected ? <Navigate to="/posts" replace={true} /> : <Navigate to="/login" replace={true} />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
      
  );
}

export default App;

