import "./LogMode.scss";
import { Link } from "react-router-dom";


function LogMode(props) {

    return (
        <nav className="auth-form container mt-5">
                <div className="d-flex justify-content-center mb-5">
                    <Link 
                    className={props.mode == 'signup' ? "active-btn rounded-pill" : "auth-btn rounded-pill"} 
                    to="/signup"
                    >
                        S'inscire
                    </Link> 
                  
                    <Link 
                    className={props.mode == 'login' ? "active-btn rounded-pill" : "auth-btn rounded-pill"}
                    to="/login"
                    >
                        Se connecter
                    </Link> 

                </div>
        </nav>
    )

}

export default LogMode