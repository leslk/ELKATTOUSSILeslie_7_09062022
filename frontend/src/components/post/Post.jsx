import { useContext } from "react";
import { useState } from "react";
import AuthContext from "../../context/AuthContext";
import LikeButton from "../button/LikeButton";
import PostModal from "./PostModal";
import "./Post.scss";
import logo from "../../assets/logo-groupomania.png";
import {BsThreeDots} from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { checkErrorsAndGetData } from "../../services/errorTools";

function Post(props) {

    // Set the alternative image text
    const alt = `image du post de ${props.pseudo} daté du ${props.created}`;
    // useState to showModal by clicking the targeted button
    const [showModal, setShowModal] = useState(false);
    // useContext user to access the connected user data
    const {user} = useContext(AuthContext);
    // useState to set like value (for fetching)
    const [like, setLike] = useState(props.usersLiked.includes(user.userId) ? 1 : 0);
    // useState to set and display the number of likes for each post
    const [likesCount, setLikesCount] = useState(props.likes);

    // Function to fetch API to like or erase like
    function handleLike(n) {
        fetch(`http://localhost:3000/api/posts/${props.id}/like`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${user.token}`
            },
            body: JSON.stringify({
                id: props.id,
                like: n,
                userId: user.userId
            })
        })
        .then(res => checkErrorsAndGetData(res))
        .then(() => {
            setLike(n);
            setLikesCount(n === 0 ? likesCount - 1 : likesCount + 1);
        }) 
        .catch(error => alert(error.message));
    }

    return (
        <article className="post-container shadow container bg-light rounded-3 col-12 col-md-10 col-lg-8 mb-3 p-3">
            <div className="d-flex position-relative align-items-center mb-3">
                <div>
                    <img className="img-fluid w-75 rounded-circle border border-2 border-grey" src={logo} alt="logo groupomania"/>
                </div>
                <div>
                    <h2 className="h5 m-0">{props.pseudo}</h2>
                    <p className="text-tertiary m-0 opacity-75">{props.created}</p>
                </div>
                {(props.userId === user.userId) || user.isAdmin ?
                <Dropdown
                className="position-absolute top-0 end-0">
                    <DropdownToggle className="bg-transparent shadow-none border-light p-0 m-0"><BsThreeDots size={24} aria-label="ouvrir le menu à developper"/></DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem 
                        onClick={() => setShowModal(true)}
                        >
                            Modifier
                        </DropdownItem>
                        <DropdownItem 
                        onClick={(e) => props.handleDelete(props.id)}
                        >
                            Supprimer
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                : null}
                {showModal ? <PostModal imageUrl={props.imageUrl} id={props.id} textContent={props.textContent} image={props.imageUrl} userId={props.userId} headerText="Modifier la publication" buttonText="enregistrer les modifications"showModal={showModal} setShowModal={setShowModal} handleUpdate={props.handleUpdate}/> : null}
                
            </div>
            <p>{props.textContent}</p>
            <div className="text-center">
                <div className="text-center w-100">
                    {props.imageUrl != null ? <img className="img-fluid w-100 mb-3" src={props.imageUrl} alt={alt}/> : null}
                </div>
            </div>
            <div className="d-flex justify-content-start align-items-center">
                <LikeButton 
                likesCount={likesCount}
                handleLike={handleLike} 
                like={like}
                />
            </div>
        </article>
    )  
}

export default Post;
