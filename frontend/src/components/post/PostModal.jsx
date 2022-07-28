import { useRef, useState } from "react";
import {Form, Modal, Button} from "react-bootstrap";
import "./PostModal.scss";

function PostModal(props) {
    // useRef to set the choosen file
    const fileRef = useRef();
    // useState to set the post image
    const [image, setImage] = useState(props.image ? props.image : null);
    // useState to set and display post image error (file types)
    const [errorImage, setErrorImage] = useState(null);
    // useState to display the choosen image in modal
    const [showImage, setShowImage] = useState(image !== null);
    // useState to deleteImage in database
    const [deleteImage, setDeleteImage] = useState(false);
    // useState to set the post textContent
    const [textContent, setTextContent] = useState(props.textContent ? props.textContent : '');
    // useState to set the post textContent error
    const [textContentError, setTextContentError] = useState(null);
    // useState to set, display and check the post textContent length
    const [charactercount, setCharacterCount] = useState(0);


    function handleFile(e) {
        const fileName = e.target.files[0].name;
        const splittedName = fileName.split('.');
        const extension = splittedName[splittedName.length - 1];
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

    // Function to delete the choosen file
    function handleReset() {
        fileRef.current.value = null;
        setShowImage(false);
        setImage(null);
        setDeleteImage(true);
        console.log("toto");
    }

    // Function to check the post text content length (min 2, max 500)
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
                aria-labelledby={props.headerText}
                onHide={() => props.setShowModal(false)}
                centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id={props.headerText}>{props.headerText}</Modal.Title>
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
                            {showImage ? <div className="post-image__container text-center"><img className="post-image img-fluid mb-3" src={image} alt="" /></div> : null}
                            <Button 
                                variant="outline-tertiary"
                                type="button" 
                                className="post-image__btn rounded-pill" 
                                onClick={image != null ? handleReset : () => fileRef.current.click()}
                            >
                                {image != null ? "Supprimer l'image" : "Ajouter une image"}
                            </Button>
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
                        <Button 
                            onClick={(e) => {
                                    if (props.buttonText === "publier") {
                                        props.handlePost(e, fileRef, textContent);   
                                    } else {
                                        props.handleUpdate(e, props.id, fileRef, textContent, deleteImage, props.userId);
                                    } 
                                    props.setShowModal(false);  
                                }   
                        }
                        variant="tertiary"
                        className="publish-btn rounded-pill m-2"
                        disabled={textContent.length < 2 && image === null}
                        >
                            {props.buttonText}
                        </Button>
                    </Modal.Footer>
                </Modal>
    )
}

export default PostModal;