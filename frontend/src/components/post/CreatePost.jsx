import { useRef, useContext, useState } from "react";
import {Form, Modal} from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import "./CreatePost.scss";
import Button from "../button/Button";
import PostModal from "./PostModal";

function CreatePost(props) {

    const {user} = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    return (

    <div className="col m-3">
            {/* <h1>Bonjour {props.user.pseudo}</h1> */}
           <Button
           type="button"
            onClick={() => setShowModal(true)}
           text="Créer un post"/>

           {showModal ? 
                <PostModal headerText="Nouvelle publication" buttonText="publier" handlePost={props.handlePost} showModal={showModal} setShowModal={setShowModal}/>
             : null}
    </div>

        
    )
}

export default CreatePost