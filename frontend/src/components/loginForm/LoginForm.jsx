import {useState} from "react";
import {Form} from "react-bootstrap";
import "./LoginForm.scss";
import Button from "../button/Button";
import {AiOutlineEyeInvisible} from "react-icons/ai";
import {AiOutlineEye} from "react-icons/ai";
import LogMode from "../logMode/LogMode";

function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

    function handleForm(e) {
        e.preventDefault()
        if (email === "" || password === "") {
            setPasswordError("Veuillez remplir tous les champs");
        } else {
            fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email : email,
                    password : password
                })
            })
            .then(res => res.json())
            .then (function(data) {
                console.log(data)
                if (data.type === "email") {
                    setEmailError(data.error);
                    setPasswordError("")
                } else {
                    setPasswordError(data.error);
                    setEmailError("");
                }
               
            })
            .catch((err) => console.log(err));
        }
        
    }

    return (
        
        <div className="container">
            <LogMode mode="login"/>
            <h1 className="login-title text-center">Connectez-vous</h1>
            <Form className="w-75 m-auto">
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.Control className="rounded-pill" 
                onChange={(e) => 
                setEmail(e.target.value)} 
                value={email} 
                id="email" 
                name="email" 
                type="email" 
                required/>
                <p className="text-danger">{emailError}</p>
                <Form.Label  htmlFor="password">Mot de passe</Form.Label>
                <div className="d-flex position-relative align-items-center">
                    <Form.Control 
                    className="rounded-pill" 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
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
                    disabled={!emailRegex.test(email) || password.length < 8}
                    />
                </div>
            </Form>
        </div> 
    )
}

export default LoginForm