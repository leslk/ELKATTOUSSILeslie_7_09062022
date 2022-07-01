import {BsSuitHeart, BsFillSuitHeartFill} from "react-icons/bs"

function LikeButton(props) {

    return (
        <div>
            {props.like === 0 ? <BsFillSuitHeartFill size="24" color="red" onClick={props.addLike}/> : <BsSuitHeart size="24" onClick={props.addLike}/>}
        </div>
        

    )
}

export default LikeButton;