import {BsSuitHeart, BsFillSuitHeartFill} from "react-icons/bs"

function LikeButton(props) {

    return (
        <div>
            {props.like === 1 ? <BsFillSuitHeartFill size="24" color="red" onClick={() => props.handleLike(0)}/> : <BsSuitHeart size="24" onClick={() => props.handleLike(1)}/>}
        </div>
        

    )
}

export default LikeButton;