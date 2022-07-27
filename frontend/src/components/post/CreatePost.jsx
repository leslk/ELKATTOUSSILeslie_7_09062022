import { useState } from "react";
import {Button} from "react-bootstrap";
import {BsPencilSquare} from "react-icons/bs";
import "./CreatePost.scss";
import PostModal from "./PostModal";

function CreatePost(props) {

    // useState to showModal by clicking the targeted button
    const [showModal, setShowModal] = useState(false);

    return (

    <div className="col m-3 text-center">
           <Button
           variant="primary"
           className="create-post-btn text-white rounded-pill"
           type="button"
            onClick={() => setShowModal(true)}
           ><span className="p-2"><BsPencilSquare size={20}/></span> Créer un post</Button>
           {showModal ? 
                <PostModal headerText="Nouvelle publication" buttonText="publier" handlePost={props.handlePost} showModal={showModal} setShowModal={setShowModal}/>
             : null}
    </div>

        
    )
}

export default CreatePost