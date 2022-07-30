import {useState, useContext} from "react";
import {Form, Button} from "react-bootstrap";
import "./AuthForm.scss";
import PasswordValidator from "../passwordValidator/PasswordValidator";
import {AiOutlineEyeInvisible} from "react-icons/ai";
import {AiOutlineEye} from "react-icons/ai";
import LogMode from "../logMode/LogMode";
import { useNavigate} from "react-router-dom";
import { addItem, removeItem } from "../../services/localStorageTools";
import { hasAuthenticated } from "../../services/authTools";
import AuthContext from "../../context/AuthContext";

function Signup() {

    // useContext to set the connected user data
    const {setUser} = useContext(AuthContext);
    let navigate = useNavigate();
    // useState to set credentials for fetching
    const [credentials, setCredentials] = useState({
        pseudo: "",
        email: "",
        password: ""
    });

    // useState to set and display pseudo error
    const [pseudoError, setPseudoError] = useState("");
    // useState to set and display email error
    const [emailError, setEmailError] = useState("");
    // useState to set and display password error
    const [passwordError, setPasswordError] = useState("");
    // useState to set and diplay the password validator component
    const [passwordOnFocus, setPasswordOnFocus] = useState(false);
    // useState to display the password by clicking on the targeted button
    const [showPassword, setShowPassword] = useState(false);

    // useState to check and display password validity
    const [passwordValidity, setPasswordValidity] = useState({
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbol: false,
        passwordLength: false
    });

    // Regex to check email and password requirements
    const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    const uppercaseRegex = /(.*[A-Z])/;
    const lowercaseRegex = /(.*[a-z])/;
    const numbersRegex = /(.*[0-9]{3,})/;
    const symbolRegex = /(.*\W)/;

    // Function to set credentials for fetching
    function handleChange({currentTarget}) {
        const {name, value} = currentTarget;
        setCredentials({...credentials, [name] : value});
    }

    // Function to check pseudo length and display error
    function handlePseudo(e) {
        const pseudoChecker = e.target.value;
        if (pseudoChecker.length < 3) {
         setPseudoError("le pseudo doit contenir au moins 3 caractères");
        } else {
            setPseudoError("");
        }
    }

    // Function to check email and display error
    function handleEmail(e) {
        const emailChecker = e.target.value;
        if (!emailRegex.test(emailChecker)) {
         setEmailError("email invalide");
        } else {
            setEmailError("");
        }
    }

    // Function to fetch API to signup and login the user simultaneousy
    function handleForm(e) {
        e.preventDefault();
            fetch("http://localhost:3000/api/auth/signup", {
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
                if (res.status === 201) {
                    // login automatically
                    fetch("http://localhost:3000/api/auth/login", {
                        method: "POST",
                        headers : {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email : credentials.email,
                            password : credentials.password
                        })
                    })
                    .then(res => res.json())
                    .then((data) => {
                        //delete data.isAdmin;
                        addItem("user", JSON.stringify(data));
                        setUser(hasAuthenticated());
                        removeItem('user');
                        delete data.isAdmin;
                        addItem("user", JSON.stringify(data));
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
                } else if (res.status === 500) {
                    navigate("/error500", {replace: true})
                }
            })
            .catch((err) => console.log(err));
    }

    // Function to check password validity
    function handlePassword(e) {
        setPasswordValidity({
            uppercase: uppercaseRegex.test(e.target.value),
            lowercase: lowercaseRegex.test(e.target.value),
            numbers: numbersRegex.test(e.target.value),
            symbol : symbolRegex.test(e.target.value),
            passwordLength : e.target.value.length >= 8
        });  
    }

    function passwordIsValid() {
        return passwordValidity.uppercase &&
            passwordValidity.lowercase &&
            passwordValidity.numbers &&
            passwordValidity.symbol &&
            passwordValidity.passwordLength
    }

    return (
        <main className="container py-5">
            <LogMode mode="signup"/>
            <h1 className="text-center text-tertiary">Bienvenue sur le réseau social <br/> de Groupomania</h1>
            <Form className="auth-form w-75 m-auto">
                <Form.Label htmlFor="pseudo">Pseudo</Form.Label>
                <Form.Control 
                className="auth-form__control rounded-pill" 
                onChange={(e) => {handleChange(e); handlePseudo(e)}} 
                onFocus={() => setPasswordOnFocus(false)}
                value={credentials.pseudo} 
                id="pseudo" 
                name="pseudo" 
                type="text" 
                required
                />
                <p className="text-danger">{pseudoError}</p>
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.Control 
                className="auth-form__control rounded-pill" 
                onFocus={() => setPasswordOnFocus(false)}
                onChange={(e) => {handleChange(e); handleEmail(e)}} 
                value={credentials.email} 
                id="email" 
                name="email" 
                type="email" 
                required
                />
                <p className="text-danger">{emailError}</p>
                <Form.Label  htmlFor="password">Mot de passe</Form.Label>
                <div className="d-flex position-relative align-items-center">
                    <Form.Control className="auth-form__control rounded-pill"
                    onFocus={() => setPasswordOnFocus(true)} 
                    onChange={(e) => {handlePassword(e); handleChange(e)}} value={credentials.password} 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required
                    />
                    {showPassword ? <AiOutlineEyeInvisible className="password-icon" onClick={() => setShowPassword(false)}/>: <AiOutlineEye className="password-icon" onClick={() => setShowPassword(true)}/> }
                </div>
                <p className="text-danger">{passwordError}</p>
                {passwordOnFocus ? <PasswordValidator {...passwordValidity}/> : null}
            </Form>
            <div className="text-center">
                <Button 
                type="button"
                variant="tertiary"
                className="auth-form__btn text-white rounded-pill"
                onClick={handleForm}
                disabled={!emailRegex.test(credentials.email) || !passwordIsValid() || credentials.pseudo.length < 3}>Inscription</Button>
            </div>   
        </main>
    )
}

export default Signup