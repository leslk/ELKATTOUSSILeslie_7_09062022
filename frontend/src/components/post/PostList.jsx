import Post from "./Post";
import {useState, useEffect, useContext} from "react";
import AuthContext from "../../context/AuthContext";
import {createDate, sortByDate} from "../../services/dateTools";
import CreatePost from "./CreatePost";
import {checkErrorsAndGetData} from "../../services/errorTools";

function PostList(props) {
    // UseState to set first posts list via UseEffect
    const [postList, setPostList] = useState([]);
    // useState use as a dependency in useEffect to update the posts list
    const [newPostList, setNewPostList] = useState([]);
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
    }, [newPostList]);

    // Function to create a new post
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
        .then(res => checkErrorsAndGetData(res))
        .then(() => {
            setNewPostList([...postList]);
        })
        .catch(error => alert(error.message));
        
    }

    // Function to delete a post
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
        .then(res => checkErrorsAndGetData(res))
        .then(() => {
            setNewPostList([...postList]);
        })
        .catch(error => alert(error.message));
    }

    // Function to update a post
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
        .then((res) => checkErrorsAndGetData(res))
        .then(() => {
            setNewPostList([...postList]);
        })
        .catch(error => alert(error.message));
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