import {Navbar, Nav} from "react-bootstrap";
import logo from "../../assets/icon-left-font.png";
import { Link } from "react-router-dom";
import "./Header.scss";
import {AiOutlinePoweroff} from "react-icons/ai"
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";
import { hasAuthenticated, logout } from "../../services/authTools";


  function Header() {

    const {user, setUser} = useContext(AuthContext);

    function handleLogout() {
        logout();
        setUser(hasAuthenticated());
    }


    return (
        <header className="shadow-sm bg-light">
            <Navbar className={user ? "d-flex justify-content-between px-3" : "d-flex justify-content-center px-3"}>
                    <img src={logo} alt="Logo Groupomania" />
                {user ?
                    <Nav>
                        <Link aria-label="Deconnexion" className="logout-button rounded-pill" to="/login" onClick={handleLogout}>
                            <AiOutlinePoweroff className="d-block d-sm-none" size={28}/><p className="d-none d-sm-block logout-icon m-1">Deconnexion</p>
                        </Link>
                    </Nav> 
                : 
                null}
            </Navbar>
        </header>
        
    )
  }

  export default Header;