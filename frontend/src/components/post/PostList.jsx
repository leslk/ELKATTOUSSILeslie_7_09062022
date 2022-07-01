import Post from "./Post";
import {useState, useEffect} from "react";

function PostList(props) {
    

    const [postList, setPostList] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/api/posts",{
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${JSON.parse(localStorage.getItem("token"))}`
            }
        })
        .then(res => res.json())
        .then((data) => {
            setPostList(data)
            setDataLoaded(true)
        }) 
    },[])
    return (
        dataLoaded
        ? 
        <div>
            {postList.map((e) => (
                <div key={e._id}>
                    <Post 
                    userId={e.userId}
                    usersLiked={e.usersLiked}
                    pseudo={e.pseudo}
                    user={props.user}
                    textContent={e.textContent}
                    imageUrl={e.imageUrl}
                    likes={e.likes}
                    created={e.created}
                    id={e._id}
                    />
                </div> 
            ))}
        </div>
        :
        null
    )
}

export default PostList;