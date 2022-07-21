import "./LogMode.scss";
import { Link } from "react-router-dom";


function LogMode(props) {

    return (
        <nav className="auth-form container">
                <div className="d-flex justify-content-center mb-5">
                    <Link 
                    className={props.mode === 'signup' ? "log-btn active-btn btn btn-primary rounded-pill text-white" : "log-btn auth-btn btn rounded-pill text-black"} 
                    to="/signup"
                    >
                        S'inscrire
                    </Link> 
                  
                    <Link 
                    className={props.mode === 'login' ? "log-btn active-btn btn btn-primary rounded-pill text-white" : "log-btn auth-btn btn rounded-pill text-black"}
                    to="/login"
                    >
                        Se connecter
                    </Link> 

                </div>
        </nav>
    )

}

export default LogMode