import {Navbar, Nav} from "react-bootstrap";
import logo from "../../assets/icon-left-font.png";
import { Link } from "react-router-dom";
import "./Header.scss";


  function Header(props) {



    return (
        <header className="shadow-sm bg-light w-100 p-3">
            <Navbar className="d-flex justify-content-around">
                    <img className="img-fluid" src={logo} alt="Logo Groupomania" />
                {props.isConnected ? <Nav><Link className="logout-button rounded-pill" to="/login">Deconnexion</Link></Nav> : ""}
            
            </Navbar>
        </header>
        
    )
  }

  export default Header;