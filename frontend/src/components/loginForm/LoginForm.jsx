import {useContext, useState} from "react";
import {Form} from "react-bootstrap";
import "./AuthForm.scss";
import Button from "react-bootstrap/Button";
import {AiOutlineEyeInvisible} from "react-icons/ai";
import {AiOutlineEye} from "react-icons/ai";
import LogMode from "../logMode/LogMode";
import { useNavigate} from "react-router-dom";
import { addItem } from "../../services/localStorageTools";
import AuthContext from "../../context/AuthContext";
import { hasAuthenticated } from "../../services/authTools";

function LoginForm() {

    const {setUser} = useContext(AuthContext);
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

    function handleChange({currentTarget}) {
        const {name, value} = currentTarget;
        setCredentials({...credentials, [name] : value});
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
                ...credentials
            })
        })
        .then(async function(res) {
            const data = await res.json();
            if (res.status === 200) {
                addItem("user", JSON.stringify(data));
                setUser(hasAuthenticated());
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
            <h1 className="text-center text-tertiary">Connectez-vous</h1>
            <Form className="auth-form w-75 m-auto">
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.Control className="auth-form__control rounded-pill" 
                onChange={handleChange} 
                value={credentials.email} 
                id="email" 
                name="email" 
                type="email" 
                required
                />
                <p className="text-danger">{emailError}</p>
                <Form.Label  htmlFor="password">Mot de passe</Form.Label>
                <div className="d-flex position-relative align-items-center">
                    <Form.Control 
                    className="auth-form__control rounded-pill" 
                    onChange={handleChange} 
                    value={credentials.password} 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required
                    />
                    {showPassword ? <AiOutlineEyeInvisible className="password-icon" onClick={() => setShowPassword(false)}/>: <AiOutlineEye className="password-icon" onClick={() => setShowPassword(true)}/> }
                </div>
                <p className="text-danger">{passwordError}</p>
                <div className="text-center">
                    <Button
                    type="button"
                    variant="tertiary"
                    className="text-white rounded-pill"
                    onClick={handleForm} 
                    disabled={!emailRegex.test(credentials.email) || credentials.password.length < 8}
                    >Connexion</Button>
                </div>
            </Form>
        </main> 
    )
}

export default LoginForm