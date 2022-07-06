import Post from "./Post";
import {useState, useEffect} from "react";

function PostList(props) {
    

    const [postList, setPostList] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const token = `Bearer ${JSON.parse(localStorage.getItem("token"))}`;
        console.log(token);
        fetch("http://localhost:3000/api/posts",{
            method: "GET",
            headers: {
                "Authorization" : token
            }
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            data.sort(function(a, b) {
                const dateA = Date.parse(a.created);
                const dateB = Date.parse(b.created);
                if (dateA > dateB) {
                    return -1;
                }
                if (dateA < dateB) {
                    return 1;
                }
                return 0;
            })
            setPostList(data)
            setDataLoaded(true)
        }) 
    },[]);

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
                    created={new Date(e.created).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
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