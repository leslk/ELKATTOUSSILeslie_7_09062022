import { useState } from "react";
import { useRef } from "react";
import {Form} from "react-bootstrap";
import "./CreatePost.scss";


function CreatePost(props) {
 
    const fileRef = useRef();
    const [image, setImage] = useState({file : null});
    const [showImage, setShowImage] = useState(false);

  function handleChange(e) {
    fileRef.current.files = e.target.files;
    console.log(fileRef.current.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
    setShowImage(true);
    console.log(fileRef);
  };

  function handlePost() {
    fetch("http://localhost:3000/api/posts",{
        method : "POST",
        headers : {
            "Authorization" : `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            userId: props.user.userId,
            textContent : "{type: String, required: true}",
            imageUrl : "",
        })
    })
  }

  return (

   <main className="col m-3">
        <h1>Bonjour {props.user.pseudo}</h1>
        <div className="shadow container bg-light rounded-3 col col-md-8 col-lg-5">
            <div className="text-center">
                <Form.Label htmlFor="post" className="h5 my-3">Nouvelle publication</Form.Label>
            </div>
            {showImage ? <img className="img-fluid mb-3" src={image} alt="" /> : null}
            <Form.Control as="textarea" className="post-input rounded-3 mb-2" name="post" id="post" placeholder="Ecrivez quelque chose"></Form.Control>
            <div>
                <button className="image-btn rounded-pill" onClick={() => fileRef.current.click()}>
                    Ajouter une image
                </button>
                <Form.Control
                    ref={fileRef}
                    onChange={handleChange}
                    multiple={false}
                    type="file"
                    hidden
                />
            </div>
            <div className="d-flex justify-content-center">
                <button onClick={handlePost} className="rounded-pill m-2 send-btn">Publier</button>
            </div>
        </div>
   </main>
    
  )
}


export default CreatePost