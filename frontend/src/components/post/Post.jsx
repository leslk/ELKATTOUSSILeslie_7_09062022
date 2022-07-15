import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import AuthContext from "../../context/AuthContext";
import Button from "../button/Button";
import LikeButton from "../button/LikeButton";
import PostModal from "./PostModal";

function Post(props) {

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
        <article className="shadow container bg-light rounded-3 col col-md-8 col-lg-5">
            <h1>{props.pseudo}</h1>
            <div className="text-center">
                <div className="post-image-container text-center">
                    {props.imageUrl != null ? <img className="post-image img-fluid mb-3" src={props.imageUrl} alt=""/> : null}
                </div>
            </div>
            <p>{props.textContent}</p>
            <p>{props.created}</p>
            <div className="d-flex justify-content-start align-items-center">
                <LikeButton handleLike={handleLike} like={like}/>
                <div className="d-flex">
                    <p className="m-0 p-3">{likesCount}{likesCount <= 1 ? " Like" : " Likes"}</p>
                </div>
            </div>
                {(props.userId === user.userId) || user.isAdmin ? <div><Button type="button" text="Modifier" onClick={() => setShowModal(true)}/><Button className="rounded-pill send-btn" type="button" onClick={(e) => props.handleDelete(props.id)} text="Supprimer"/></div> : null}
                {showModal ? <PostModal imageUrl={props.imageUrl} id={props.id} textContent={props.textContent} headerText="Modifier la publication" image={props.imageUrl} buttonText="enregistrer les modifications"showModal={showModal} setShowModal={setShowModal} handleUpdate={props.handleUpdate}/> : null}
        </article>
    )  
}

export default Post;
