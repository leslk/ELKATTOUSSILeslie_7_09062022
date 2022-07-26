import { Link } from "react-router-dom";
import  notFoundImage  from "../../assets/not-found.jpeg";
import "./NotFound.scss";

export function NotFound() {
    return (
        <div className="text-center">
            <h1 className="my-5 px-3">Erreur 404 : Page Introuvable</h1>
            <div>
                <Link to="/" className="btn btn-primary not-found-btn text-white rounded-pill"> retourner à la page posts </Link>
            </div>
            
            <img src={notFoundImage} className="img-fluid mw-25" />
            
        </div>
    )
}