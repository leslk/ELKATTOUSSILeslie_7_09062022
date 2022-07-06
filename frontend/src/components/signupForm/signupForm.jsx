import {useState} from "react";
import {Form} from "react-bootstrap";
import "./signupForm.scss";
import Button from "../button/Button";
import PasswordValidator from "../passwordValidator/PasswordValidator";
import {AiOutlineEyeInvisible} from "react-icons/ai";
import {AiOutlineEye} from "react-icons/ai";
import LogMode from "../logMode/LogMode";
import { useNavigate} from "react-router-dom";
import { addItem } from "../../services/LocalStorage";

function Signup(props) {

    let navigate = useNavigate();
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pseudoError, setPseudoError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordOnFocus, setPasswordOnFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [passwordValidity, setPasswordValidity] = useState({
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbol: false,
        passwordLength: false
    });

    const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    const uppercaseRegex = /(.*[A-Z])/;
    const lowercaseRegex = /(.*[a-z])/;
    const numbersRegex = /(.*[0-9]{3,})/;
    const symbolRegex = /(.*\W)/;

    function handlePseudo(e) {
        const pseudoChecker = e.target.value;
        if (pseudoChecker.length < 3) {
         setPseudoError("le pseudo doit contenir au moins 3 caractères");
        } else {
            setPseudoError("");
        }
        setPseudo(e.target.value);
    }

    function handleEmail(e) {
        const emailChecker = e.target.value;
        if (!emailRegex.test(emailChecker)) {
         setEmailError("email invalide");
        } else {
            setEmailError("");
        }
        setEmail(e.target.value);
    }

    function handleForm(e) {
        e.preventDefault();
            fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pseudo: pseudo,
                    email : email,
                    password : password
                })
            })
            .then(async function(res) {
                const data = await res.json();
                if (res.status === 201) {
                    // login automatically
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
                    .then((resData) => {
                        addItem("token", JSON.stringify(resData.token))
                        props.onConnect(resData);
                        navigate("/posts", {replace: true});
                    })
                    .catch(err => console.log(err));
                } else if (res.status === 400) {
                    // Display error
                    if (data.errorType === "email") {
                        setEmailError(data.message)
                    } else if (data.errorType === "pseudo") {
                        setPseudoError(data.message)
                    } else if (data.errorType === "password") {
                        setPasswordError(data.message)
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

    function handlePassword(e) {
        setPasswordValidity({
            uppercase: uppercaseRegex.test(e.target.value),
            lowercase: lowercaseRegex.test(e.target.value),
            numbers: numbersRegex.test(e.target.value),
            symbol : symbolRegex.test(e.target.value),
            passwordLength : e.target.value.length >= 8
        }); 
        setPassword(e.target.value);  
    }

    return (
        <main className="container py-5">
            <LogMode mode="signup"/>
            <h1 className="signup-title text-center">Bienvenue sur le réseau social <br/> de Groupomania</h1>
            <Form className="w-75 m-auto">
                <Form.Label htmlFor="pseudo">Pseudo</Form.Label>
                <Form.Control className="rounded-pill" onFocus={() => setPasswordOnFocus(false)} onChange={handlePseudo} value={pseudo} id="pseudo" name="pseudo" type="text" required/>
                <p className="text-danger">{pseudoError}</p>
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.Control className="rounded-pill" onFocus={() => setPasswordOnFocus(false)} onChange={handleEmail} value={email} id="email" name="email" type="email" required/>
                <p className="text-danger">{emailError}</p>
                <Form.Label  htmlFor="password">Mot de passe</Form.Label>
                <div className="d-flex position-relative align-items-center">
                    <Form.Control className="rounded-pill"
                    onFocus={() => setPasswordOnFocus(true)} 
                    onChange={handlePassword} value={password} 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required
                    />
                    {showPassword ? <AiOutlineEye className="password-icon" onClick={() => setShowPassword(false)}/>: <AiOutlineEyeInvisible className="password-icon" onClick={() => setShowPassword(true)}/> }
                </div>
                <p className="text-danger">{passwordError}</p>
                {passwordOnFocus ? <PasswordValidator {...passwordValidity}/> : null}
            </Form>
            <div className="text-center">
                <Button onClick={handleForm} 
                text="Inscription" 
                disabled={!emailRegex.test(email) || !passwordValidity.passwordLength || pseudo.length < 3}/>
            </div>   
        </main>
    )
}

export default Signup