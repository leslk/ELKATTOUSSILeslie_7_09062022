import { useContext } from "react";
import { useState } from "react";
import AuthContext from "../../context/AuthContext";
import Button from "react-bootstrap/Button";
import LikeButton from "../button/LikeButton";
import PostModal from "./PostModal";
import "./Post.scss";
import logo from "../../assets/logo-groupomania.png";
import {BsThreeDots} from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";

function Post(props) {

    const alt = `image du post de ${props.pseudo} daté du ${props.created}`;
    const [showModal, setShowModal] = useState(false);
    const {user} = useContext(AuthContext);
    const [like, setLike] = useState(props.usersLiked.includes(user.userId) ? 1 : 0);
    const [likesCount, setLikesCount] = useState(props.likes);

    async function handleLike(n) {
        const res = await fetch(`http://localhost:3000/api/posts/${props.id}/like`, {
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
        });

        if (res.status === 200) {
            setLike(n);
            setLikesCount(n === 0 ? likesCount - 1 : likesCount + 1);
        }
        // .then((res) => {})
        // .catch(err => console.log(err))
    }

    return (
        <article className="post-container shadow container bg-light rounded-3 col-10 col-md-6 col-lg-8 mb-3 p-3">
            <div className="d-flex position-relative align-items-center mb-3">
                <div>
                    <img className="img-fluid w-75 rounded-circle border border-2 border-grey" src={logo} alt="logo groupomania"/>
                </div>
                <div>
                    <h2 className="h5 m-0">{props.pseudo}</h2>
                    <p className="text-tertiary m-0 opacity-75">{props.created}</p>
                </div>
                {/* {(props.userId === user.userId) || user.isAdmin ? */}
                <Dropdown
                drop="up"
                className="position-absolute top-0 end-0">
                    <DropdownToggle className="bg-transparent shadow-none border-light p-0"><BsThreeDots size={24}/></DropdownToggle>
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
                {/* //  : null} */}
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
                {/* <div className="d-flex">
                    <p className="m-0 p-3">{likesCount}{likesCount <= 1 ? " Like" : " Likes"}</p>
                </div> */}
            </div>
        </article>
    )  
}

export default Post;
