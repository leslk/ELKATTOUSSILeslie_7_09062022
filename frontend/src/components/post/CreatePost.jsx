import { useState } from "react";
import { useRef } from "react";
import {Form, Alert} from "react-bootstrap";
import "./CreatePost.scss";
import PostList from "./PostList";


function CreatePost(props) {
 
    const fileRef = useRef();
    const [image, setImage] = useState({file : null});
    const [errorImage, setErrorImage] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [textContent, setTextContent] = useState();
    const [charactercount, setCharacterCount] = useState(0);
    const [update, setUpdate] = useState(false);

    function handleChange(e) {
        console.log(e.target.files.length);
        const fileName = e.target.files[0].name;
        const extension = fileName.split(".")[1];
        console.log(extension);
        if (['gif', 'png', 'jpeg', 'jpg'].includes(extension)) {
            fileRef.current.files = e.target.files;
            setImage(URL.createObjectURL(e.target.files[0]));
            setShowImage(true);
            setErrorImage(null);
        } else {
            setErrorImage("Ce format de fichier n'est pas accepté");
            handleReset();
        }
    };

    function handleReset(e) {
        fileRef.current.value = null;
        setShowImage(false);
    }

    function handleCharacter(e) {

        setTextContent(e.target.value);
        setCharacterCount(e.target.value.length);
    }

    function handlePost(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append('userId', props.user.userId)
        formData.append('textContent', textContent)
        formData.append('image', fileRef.current.files[0])
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
            <Form className="shadow container bg-light rounded-3 col mb-5 col-md-8 col-lg-5">
                <Form.Group controlId="FormPost">
                    <Form.Label className="h5 my-3 w-100 text-center">Nouvelle publication</Form.Label>
                    <Form.Control onChange={handleCharacter} as="textarea" rows={3} className="post-input rounded-3 mb-2" name="post" placeholder="Ecrivez quelque chose"/>
                    <p>{charactercount} /500 caractères</p>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    {showImage ? <div className="post-image-container text-center"><img className="post-image img-fluid mb-3" src={image} alt="" /></div> : null}
                    <button type="button" className="image-btn rounded-pill" onClick={fileRef.current && fileRef.current.value ? handleReset : () => fileRef.current.click()}>
                        {fileRef.current && fileRef.current.value ? "Supprimer l'image" : "Ajouter une image"}
                    </button>
                    <Form.Control
                        name="image"
                        ref={fileRef}
                        onChange={handleChange}
                        multiple={false}
                        type="file"
                        hidden
                    />
                    {errorImage ? <p className="text-danger">{errorImage}</p> : null}
                    <p>Fichiers acceptés : jpg, png, gif</p>
                </Form.Group>
                <div className="d-flex justify-content-center">
                    <button onClick={handlePost} className="rounded-pill m-2 send-btn">Publier</button>
                </div>
            </Form>
            <PostList user={props.user} />
    </main>

        
    )
}

export default CreatePost