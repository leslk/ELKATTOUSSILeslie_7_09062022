import { useRef, useState } from "react";
import {Form, Modal} from "react-bootstrap";

function PostModal(props) {
    const fileRef = useRef();
    const [image, setImage] = useState(props.image ? props.image : null);
    const [errorImage, setErrorImage] = useState(null);
    const [showImage, setShowImage] = useState(image !== null);
    const [deleteImage, setDeleteImage] = useState(false);
    const [textContent, setTextContent] = useState(props.textContent ? props.textContent : '');
    const [textContentError, setTextContentError] = useState(null);
    const [charactercount, setCharacterCount] = useState(0);

    function handleFile(e) {
        const fileName = e.target.files[0].name;
        const extension = fileName.split(".")[1];
        if (['gif', 'png', 'jpeg', 'jpg'].includes(extension)) {
            fileRef.current.files = e.target.files;
            setImage(URL.createObjectURL(e.target.files[0]));
            setShowImage(true);
            setErrorImage(null);
            setDeleteImage(false);
        } else {
            setErrorImage("Ce format de fichier n'est pas accepté");
            handleReset();
        }
    };

    function handleReset() {
        fileRef.current.value = null;
        setShowImage(false);
        setImage(null);
        setDeleteImage(true);
        console.log("toto");
    }

    function handleCharacter(e) {
        setTextContent(e.target.value);
        setCharacterCount(e.target.value.length);

        if (e.target.value.length > 0 && e.target.value.length < 2) {
            setTextContentError("un minimun de 2 charactères est requis");
         } else if (e.target.value.length === 500) {
            setTextContentError("Vous avez atteint le maximum de caractères acceptés pour la création d'un post");
        } else {
            setTextContentError(null);
        }

    }

    return (
        <Modal 
                show={props.showModal} 
                onHide={() => props.setShowModal(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{props.headerText}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group
                        controlId="FormText" >
                            <Form.Label>Texte</Form.Label>
                            <Form.Control 
                            onChange={handleCharacter} 
                            as="textarea" 
                            className="post-input rounded-3 mb-2" 
                            name="post"
                            placeholder="Ecrivez quelque chose"
                            maxLength={500}
                            value={textContent}
                            /> 
                            {textContentError ? <p className="text-danger">{textContentError}</p> : null }
                            <p>{charactercount} /500 caractères</p>          
                        </Form.Group>
                        <Form.Group 
                        className="mb-3"
                        >
                            {showImage ? <div className="post-image-container text-center"><img className="post-image img-fluid mb-3" src={image} alt="" /></div> : null}
                            <button 
                                type="button" 
                                className="image-btn rounded-pill" 
                                onClick={image != null ? handleReset : () => fileRef.current.click()}
                            >
                                {image != null ? "Supprimer l'image" : "Ajouter une image"}
                            </button>
                            <Form.Control
                                name="image"
                                ref={fileRef}
                                onChange={handleFile}
                                multiple={false}
                                type="file"
                                hidden
                            />
                            {errorImage ? <p className="text-danger">{errorImage}</p> : null}
                            <p>Fichiers acceptés : jpg, png, gif</p>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <button 
                            onClick={(e) => {
                                    if (props.buttonText === "publier") {
                                        props.handlePost(e, fileRef, textContent);   
                                    } else {
                                        props.handleUpdate(e, props.id, fileRef, textContent, deleteImage);
                                    } 
                                    props.setShowModal(false);  
                                }   
                            // }
                        }
                            className="rounded-pill m-2 send-btn"
                        >
                            {props.buttonText}
                        </button>
                    </Modal.Footer>
                </Modal>
    )
}

export default PostModal;