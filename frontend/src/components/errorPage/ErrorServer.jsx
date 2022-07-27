import { Link, useNavigate } from "react-router-dom";
import  errorServer  from "../../assets/server-error.jpeg";

export function ErrorServer() {
    let navigate = useNavigate();
    return (
        <div className="text-center">
            <h1 className="my-5 px-3">Erreur 500 : Erreur interne du serveur</h1>
            <div>
                <Link 
                to="/" 
                className="btn btn-primary not-found-btn text-white rounded-pill"
                onClick={()=> navigate(-1)}>
                     retour 
                </Link>
            </div>
            
            <img src={errorServer} className="img-fluid mw-25" />
            
        </div>
    )
}