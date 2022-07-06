import {useContext, useState} from "react";
import {Form} from "react-bootstrap";
import "./LoginForm.scss";
import Button from "../button/Button";
import {AiOutlineEyeInvisible} from "react-icons/ai";
import {AiOutlineEye} from "react-icons/ai";
import LogMode from "../logMode/LogMode";
import { useNavigate} from "react-router-dom";
import { addItem } from "../../services/LocalStorage";
import AuthContext from "../../context/AuthContext";
import { hasAuthenticated } from "../../services/Auth";

function LoginForm() {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
    let navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

    function handleChange({currentTarget}) {
        console.log(currentTarget);
        const {name, value} = currentTarget;
        setUser({...user, [name] : value});
        //console.log(user);
    }

    function handleForm(e) {
        e.preventDefault()
        fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...user
            })
        })
        .then(async function(res) {
            const data = await res.json();
            if (res.status === 200) {
                localStorage.setItem("token", JSON.stringify(data.token))
                //addItem("token", JSON.stringify(data.token));
                console.log(localStorage.getItem("token"));
                setIsAuthenticated(true);
                navigate("/posts", {replace: true});
                
            } else if (res.status === 400) {
                // Display error
                if (data.errorType === "email") {
                    setEmailError(data.message);
                    setPasswordError('');
                } else {
                    setPasswordError(data.message);
                    setEmailError('');
                } 
            } else if (res.status === 404) {
                // 404 : redirect 404 page
            } else if (res.status === 500) {
                // 500 : redirect page 500
            } else {
             // else : throw error or console log
            }  
        })
        .catch((err) => console.log(err));
    }


    return (
        
        <main className="container py-5">
            <LogMode mode="login"/>
            <h1 className="login-title text-center">Connectez-vous</h1>
            <Form className="w-75 m-auto">
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.Control className="rounded-pill" 
                    onChange={handleChange} 
                    value={user.email} 
                    id="email" 
                    name="email" 
                    type="email" 
                    required
                />
                <p className="text-danger">{emailError}</p>
                <Form.Label  htmlFor="password">Mot de passe</Form.Label>
                <div className="d-flex position-relative align-items-center">
                    <Form.Control 
                        className="rounded-pill" 
                        onChange={handleChange} 
                        value={user.password} 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        required
                    />
                    {showPassword ? <AiOutlineEye className="password-icon" onClick={() => setShowPassword(false)}/>: <AiOutlineEyeInvisible className="password-icon" onClick={() => setShowPassword(true)}/> }
                </div>
                <p className="text-danger">{passwordError}</p>
                <div className="text-center">
                    <Button onClick={handleForm} 
                    text="Connexion" 
                    disabled={!emailRegex.test(user.email) || user.password.length < 8}
                    />
                </div>
            </Form>
        </main> 
    )
}

export default LoginForm