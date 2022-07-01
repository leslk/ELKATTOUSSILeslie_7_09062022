import { useState } from "react";
import { useRef } from "react";
import {Form} from "react-bootstrap";
import "./CreatePost.scss";
import PostList from "./PostList";


function CreatePost(props) {
 
    const fileRef = useRef();
    const [image, setImage] = useState({file : null});
    const [showImage, setShowImage] = useState(false);
    const [textContent, setTextContent] = useState();

  function handleChange(e) {
    fileRef.current.files = e.target.files;
    setImage(URL.createObjectURL(e.target.files[0]));
    setShowImage(true);
    console.log(fileRef.current.value);
  };

  function handleReset(e) {
    fileRef.current.value = "";
    setShowImage(false);
    console.log(fileRef.current.value)
  }

  function handlePost(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('userId', props.user.userId)
    formData.append('textContent', textContent)
    formData.append('image', fileRef.current.files[0])
    console.log(fileRef.current.files[0]);
    fetch("http://localhost:3000/api/posts",{
        method : "POST",
        headers : {
            "Authorization" : `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: formData
    })
  }

  return (

   <main className="col m-3">
        {/* <h1>Bonjour {props.user.pseudo}</h1> */}
        <form className="shadow container bg-light rounded-3 col col-md-8 col-lg-5">
            <div className="text-center">
                <Form.Label htmlFor="post" className="h5 my-3">Nouvelle publication</Form.Label>
            </div>
            {showImage ? <div className="post-image-container text-center"><img className="post-image img-fluid mb-3" src={image} alt="" /></div> : null}
            <Form.Control onChange={(e) => setTextContent(e.target.value)} as="textarea" className="post-input rounded-3 mb-2" name="post" id="post" placeholder="Ecrivez quelque chose"></Form.Control>
            <div>
                <button type="button" className="image-btn rounded-pill" onClick={() => fileRef.current.click()}>
                    Ajouter une image
                </button>
                <Form.Control
                    name="image"
                    ref={fileRef}
                    onChange={handleChange}
                    multiple={false}
                    type="file"
                    hidden
                />
                <button type="button" className="image-btn rounded-pill" onClick={handleReset}>Supprimer</button>
            </div>
            <div className="d-flex justify-content-center">
                <button onClick={handlePost} className="rounded-pill m-2 send-btn">Publier</button>
            </div>
        </form>
        <PostList user={props.user}/>
   </main>

    
  )
}

export default CreatePost