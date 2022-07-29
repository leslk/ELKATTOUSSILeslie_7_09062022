// SCSS
import "./scss/custom.scss";
// Context
import AuthContext from "./context/AuthContext";
// Components
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LoginForm from "./components/authForm/LoginForm";
import SignupForm from "./components/authForm/signupForm";
import AuthenticatedRoute from "./components/AutenticatedRoute";
import PostList from "./components/post/PostList";
// React
import { useState} from "react";
import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
// Services
import { hasAuthenticated } from "./services/authTools";
import { NotFound } from "./components/errorPage/NotFound";
import { ErrorServer } from "./components/errorPage/ErrorServer";


function App() {
  const [user, setUser] = useState(hasAuthenticated());

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{user, setUser}}>
        <Header />
        <Routes>
          <Route exact path="/signup" element={<SignupForm/>}/>
          <Route exact path="/login" element={<LoginForm/>}/>
          <Route element={<AuthenticatedRoute/>}>
            <Route exact path="/" element={<Navigate to="/posts" replace={true}/>} />
            <Route exact path="/posts" element={<PostList/>} />
          </Route>
          <Route exact path="/error-500" element={<ErrorServer/>}/>
          <Route path='/*' element={<NotFound/>}/>
        </Routes>
        <Footer/>
      </AuthContext.Provider>
    </BrowserRouter>      
  );
}

export default App;

