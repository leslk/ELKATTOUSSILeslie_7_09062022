import Post from "./Post";
import {useState, useEffect, useContext} from "react";
import AuthContext from "../../context/AuthContext";
import {createDate, sortByDate} from "../../services/dateTools";
import CreatePost from "./CreatePost";

function PostList(props) {
    const [postList, setPostList] = useState([]);
    const {user} = useContext(AuthContext);

    // Use effect joué une seule fois au chargement de la page pour récupérer la data
    useEffect(() => {
        console.log('use effect');
        // Récupérer les posts de la base de donnée avec un s merci
        fetch("http://localhost:3000/api/posts", {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })
        .then(res => res.json())
        .then((data) => {
            // Set postlist en local après avoir trié par date
            sortByDate(data);
            setPostList(data);
        });
    }, []);

    function handlePost(e, fileRef, textContent) {
        e.preventDefault();
        let formData = new FormData();
        formData.append('userId', user.userId)
        formData.append('textContent', textContent)
        formData.append('image', fileRef.current.files[0])
        fetch("http://localhost:3000/api/posts",{
            method : "POST",
            headers : {
                "Authorization" : `Bearer ${user.token}`,
            },
            body: formData
        })
        .then((res) => res.json())
        .then((newPost) => {
            newPost = {...newPost, pseudo: user.pseudo};
            setPostList([newPost, ...postList]);
        });
        
    }

    function handleDelete(postId) {
        fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${user.token}`
            },
            body: JSON.stringify({
                id: postId,
                userId: user.userId
            })
        })
        .then(res => res.json())
        .then(data => {
            const index = postList.findIndex((element) => element._id === data.id);
            postList.splice(index, 1);
            setPostList([...postList]);
        })
        .catch(err => console.log(err))
    }

    function handleUpdate(e, postId, fileRef, textContent, deleteImage, creatorId) {
        e.preventDefault();
        let formData = new FormData();
        formData.append('userId', user.isAdmin ? creatorId : user.userId);
        formData.append("id", postId);
        formData.append('textContent', textContent);
        formData.append('deleteImage', deleteImage);
        if (fileRef.current.files[0]) {
            formData.append('image', fileRef.current.files[0]);
        }
        fetch(`http://localhost:3000/api/posts/${postId}`,{
            method : "PUT",
            headers : {
                "Authorization" : `Bearer ${user.token}`,
            },
            body: formData,
        })
        .then((res) => res.json())
        .then((updatedPost) => {
            const index = postList.findIndex((element) => element._id === updatedPost._id);
            postList[index].textContent = updatedPost.textContent;
            postList[index].imageUrl = updatedPost.imageUrl;
            setPostList([...postList]);
        });
    }

    return (
        <main>
            <CreatePost handlePost={handlePost}/>
            <div>
                {postList.map((e) => (
                    <div key={e._id}>
                        <Post
                        handleUpdate={handleUpdate}
                        handleDelete={handleDelete}
                        userId={e.userId}
                        usersLiked={e.usersLiked}
                        pseudo={e.pseudo}
                        user={props.user}
                        textContent={e.textContent}
                        imageUrl={e.imageUrl}
                        likes={e.likes}
                        created={createDate(e.created, 'fr-FR')}
                        id={e._id}
                        />
                    </div> 
                ))}
            </div>
        </main>
    )   
}

export default PostList;