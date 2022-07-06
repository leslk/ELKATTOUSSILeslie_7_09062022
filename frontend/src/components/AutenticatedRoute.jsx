import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AuthenticatedRoute = () => {
    const {isAuthenticated} = useContext(AuthContext);
    
    return isAuthenticated ? (
        <Outlet/>
    ) : (
        <Navigate to="/login" replace={true}/>
    )
}

export default AuthenticatedRoute;