// CSS
import "./scss/custom.scss";
// Context
import AuthContext from "./context/AuthContext";
// Components
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LoginForm from "./components/loginForm/LoginForm";
import SignupForm from "./components/signupForm/signupForm";
import AuthenticatedRoute from "./components/AutenticatedRoute";
import CreatePost from "./components/post/CreatePost";
// React
import { useState} from "react";
import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
// Services
import { hasAuthenticated } from "./services/Auth";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
        <Header isAuthenticated={isAuthenticated}/>
        <Routes>
          <Route exact path="/signup" element={<SignupForm/>}/>
          <Route exact path="/login" element={<LoginForm/>}/>
          <Route element={<AuthenticatedRoute/>}>
            <Route exact path="/" element={<Navigate to="/posts" replace={true}/>} />
            <Route path="/posts" element={<CreatePost/>} />
          </Route>
          {/*Check another method to block unexisting routes*/}
          <Route path='*' element={<p>Not Found</p>}/>
        </Routes>
        <Footer/>
      </AuthContext.Provider>
    </BrowserRouter>
      
  );
}

export default App;

