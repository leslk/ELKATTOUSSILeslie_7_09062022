import { useEffect } from "react";
import { useRef, useState } from "react";
import LikeButton from "../button/LikeButton";

function Post(props) {

    const like = useRef();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        if (props.usersLiked.includes(props.user.userId)) {
            like.current = 0
        } else {
            like.current = 1
        }
        if (props.userId === props.user.userId) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    },[])

    function handleLike() {
        fetch(`http://localhost:3000/api/posts/${props.id}/like`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${JSON.parse(localStorage.getItem("token"))}`
            },
            body: JSON.stringify({
                id: props.id,
                like: like.current,
                userId: props.user.userId
            })
        })
        .then()
        .catch(err => console.log(err))
    }

    function handleDelete() {
        fetch(`http://localhost:3000/api/posts/${props.id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${JSON.parse(localStorage.getItem("token"))}`
            },
            body: JSON.stringify({
                id: props.id,
                userId: props.user.userId
            })
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    return (
        <div className="shadow container bg-light rounded-3 col col-md-8 col-lg-5">
            <h1>{props.pseudo}</h1>
            <div className="text-center">
                <div className="post-image-container text-center">
                    <img className="post-image img-fluid mb-3" src={props.imageUrl} alt=""/>
                </div>
            </div>
            <p>{props.textContent}</p>
            <p>{props.created}</p>
            <div className="d-flex justify-content-start align-items-center">
                <LikeButton addLike={handleLike} like={like.current}/>
                <div className="d-flex">
                    <p className="m-0 p-3">{props.likes}{props.likes <= 1 ? " Like" : " Likes"}</p>
                </div>
            </div>
                {showButton === true ? <div><button className="rounded-pill send-btn" type="button">Modifier</button><button className="rounded-pill send-btn" type="button" onClick={handleDelete}>Supprimer</button></div> : null}
        </div>
    )  
}

export default Post;
