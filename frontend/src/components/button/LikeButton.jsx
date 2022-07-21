import {BsSuitHeart, BsFillSuitHeartFill} from "react-icons/bs";
import "./LikeButton.scss";

function LikeButton(props) {

    return (
        <div className="position-relative">
            {props.like === 1 ? <BsFillSuitHeartFill className="position-relative like-btn like-btn__red" size="24" color="red" onClick={() => props.handleLike(0)}/> : <BsSuitHeart className="like-btn like-btn__empty" size="24" onClick={() => props.handleLike(1)}/>}
            <span className="likes-count position-absolute translate-middle badge rounded-pill border border-tertiary text-tertiary">
                {props.likesCount}
                <span className="visually-hidden">nombre de likes</span>
            </span>
        </div>
        

    )
}

export default LikeButton;