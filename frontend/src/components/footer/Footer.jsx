import logo from "../../assets/icon-left-font-monochrome-black.png";
import {AiFillLinkedin, AiFillFacebook, AiFillTwitterSquare} from "react-icons/ai";
import "./Footer.scss"
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="p-3 bg-light">
            <div className="text-center">
                <h2>Groupomania - Réseau social Entreprise</h2>
            </div>
            <div className="footer-icons d-flex justify-content-center">
                <a aria-label="page Facebook" href="https://fr-fr.facebook.com/">
                    <AiFillFacebook className="footer-icons-facebook"/>
                </a>
                <a aria-label="page LinkedIn" href="https://www.linkedin.com/feed/">
                    <AiFillLinkedin className="footer-icons-linkedin"/>
                </a>  
                <a aria-label="page Twitter" href="https://twitter.com/?lang=fr">
                    <AiFillTwitterSquare className="footer-icons-twitter"/>
                </a> 
            </div>
        </footer>
    )
}

export default Footer;