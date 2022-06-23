// Requires
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
require("dotenv").config({path : "./config/.env"});


exports.createPost = (req, res, next) => {
    const post = new Post ({
        postTextContent : req.body.postTextContent,
        imageUrl : `${process.env.HOST}/images/${req.file.filename}`
    });
    post.save()
    .then(() => res.status(201).json({message: "Post Créé !"}))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
    Post.find()
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({error}));
};

exports.updatePost = (req, res, next) => {
    let updatedPost = {};
    if(req.file) {
        Post.findOne({_id : req.params.id}) 
        .then((post) => {
            const fileName = post.imageUrl.split("/images/");
            fs.unlinkSync(`images/${fileName}`)
        })
        updatedPost = {
            ...JSON.parse(req.body.post),
            imageUrl : `${process.env.HOST}/images/${req.file.filename}`
        }
    } else {
        updatedPost = {
            ...req.body
        }
    }
    Post.updateOne({ _id: req.params.id}, {
        updatedPost,
        _id : req.params.id,
    })
    .then(() => res.status(200).json({message: 'Post modifié !'}))
    .catch((error) => res.status(400).json({error}));
};

exports.deletePost = (req, res, next) => {
    // Decode token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;

    Post.findOne({_id: req.params.id})
    .then(post => {
        if (post.userId != userId) {
            return res.status(401).json("requête non autorisée !");
        }
        const fileName = post.imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${fileName}`)
            Post.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !"}))
            .catch(error => res.status(400).json({ error: error })); 
    })
    .catch(error => res.status(500).json({error: error}));
};

exports.addLikeToPost = (req, res, next) => {
    Post.findOne({_id: req.params.id})
    .then(post => {
        switch(req.body.like) {
            case 1 : 
                if(post.usersLiked.includes(req.body.userId)) {
                    res.status(400).json({error: "Vous avez deja liké ce post"}); 
                } else {
                    Post.updateOne({_id: req.params.id},
                        {$push : {usersLiked: req.body.userId},
                        $inc: {likes: +1}})
                    .then(() => {
                        res.status(200).json({message: "vous avez ajouté un like"});
                    })
                    .catch(error => res.status(400).json({ error }));    
                }
                break;

            case 0 : 
                if(post.usersLiked.includes(req.params.userId)) {
                    Post.updateOne({_id: req.body.id},
                        {$pull : {usersLiked: req.body.userId},
                        $inc: {likes: -1}})
                    .then(() => {
                        res.status(200).json({message: "vous avez retiré votre like"})
                    })
                    .catch(error => res.status(500).json({error}));
                } else {
                    return res.status(400).json({error: "Vous devez liké ce post pour pouvoir effectuer cette requête"})
                }
                break;
        }
    })
    .catch(error => res.status(500).json({error}));
};