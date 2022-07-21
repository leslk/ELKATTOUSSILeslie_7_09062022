import {AiFillLinkedin, AiFillFacebook, AiFillTwitterSquare} from "react-icons/ai";
import "./Footer.scss";

function Footer() {
    return (
        <footer className="p-3 bg-light">
            <div className="text-center">
                <h2>Groupomania - Réseau social Entreprise</h2>
            </div>
            <div className="footer__icons d-flex justify-content-center">
                <a aria-label="page Facebook" href="https://fr-fr.facebook.com/">
                    <AiFillFacebook className="footer__icons__facebook"/>
                </a>
                <a aria-label="page LinkedIn" href="https://www.linkedin.com/feed/">
                    <AiFillLinkedin className="footer__icons__linkedin"/>
                </a>  
                <a aria-label="page Twitter" href="https://twitter.com/?lang=fr">
                    <AiFillTwitterSquare className="footer__icons__twitter"/>
                </a> 
            </div>
        </footer>
    )
}

export default Footer;