import Post from "./Post";
import {useState, useEffect, useContext} from "react";
import AuthContext from "../../context/AuthContext";
import {createDate, sortByDate} from "../../services/dateTools";
import CreatePost from "./CreatePost";
import {checkErrorsAndGetData} from "../../services/errorTools";
import { checkToken } from "../../services/authTools";
import {useNavigate} from "react-router-dom";

function PostList(props) {

    let navigate = useNavigate();
    // UseState to set first posts list via UseEffect
    const [postList, setPostList] = useState([]);
    // useContext user to access the connected user data
    const {user} = useContext(AuthContext);

    useEffect(() => {
        fetch("http://localhost:3000/api/posts", {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })
        .then(res => checkErrorsAndGetData(res))
        .then((data) => {
            // Sort post by date
            sortByDate(data);
            // Set posts List to display it via .map method
            setPostList(data);
        })
        .catch(error => alert(error.message));
    }, []);

    // Function to create a new post
    function handlePost(e, fileRef, textContent) {
        e.preventDefault();
        if (checkToken(user.token)) {
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
            .then(res => checkErrorsAndGetData(res))
            .then((newPost) => {
                newPost = {...newPost, pseudo: user.pseudo};
                setPostList([newPost, ...postList]);
            })
            .catch(error => alert(error.message));
        } else {
            navigate("/login", {replace: true});
        } 
    }

    // Function to delete a post
    function handleDelete(postId) {
        if (checkToken(user.token)) {
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
            .then(res => checkErrorsAndGetData(res))
            .then(data => {
                const index = postList.findIndex((element) => element._id === data.id);
                postList.splice(index, 1);
                setPostList([...postList]);
            })
            .catch(error => alert(error.message));
        } else {
            navigate("/login", {replace: true});
        }
    }

    // Function to update a post
    function handleUpdate(e, postId, fileRef, textContent, deleteImage, creatorId) {
        e.preventDefault();
        if (checkToken(user.token)) {
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
            .then((res) => checkErrorsAndGetData(res))
            .then((updatedPost) => {
                const index = postList.findIndex((element) => element._id === updatedPost._id);
                postList[index].textContent = updatedPost.textContent;
                postList[index].imageUrl = updatedPost.imageUrl;
                setPostList([...postList]);
            })
            .catch(error => alert(error.message));
        } else {
            navigate("/login", {replace: true});
        }
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