// Requires
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require("../models/user")
require("dotenv").config({path : "./config/.env"});


exports.createPost = (req, res, next) => {
    let post = {};
    if(req.file) {
        post = new Post({
            ...req.body,
            imageUrl : `${process.env.HOST}/images/${req.file.filename}`,
            created : Date.now(),
        });
    } else {
        post = new Post({
            ...req.body,
            imageUrl : null,
            created : Date.now(),
        });
    }
    post.save()
    .then(() => res.status(201).json(post))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
    Post.find()
    .then(async (posts) => {
        const allPosts = [];
        for (let post of posts) {
            const user = await User.findOne({_id: post.userId})
            allPosts.push({...post._doc , pseudo: user.pseudo});
        }
        return allPosts;
    })
    .then((data) => res.status(200).json(data))
    .catch(error => res.status(400).json({error}));
};

exports.updatePost = async (req, res, next) => {
    const post = await Post.findOne({_id : req.body.id})
    let imageUrl = post.imageUrl;

    if(req.file) { 
        if (imageUrl) {
            const fileName = imageUrl.split("/images/")[1];
            fs.unlinkSync(`images/${fileName}`);
        }
        imageUrl = `${process.env.HOST}/images/${req.file.filename}`
    } 
    else if(req.deleteImage === "true"){
        const fileName = imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${fileName}`);
        imageUrl = null;
    }
    Post.findOneAndUpdate({ _id: req.body.id}, {
        ...req.body,
        imageUrl: imageUrl 
    }, {new: true})
    .then((post) => {
        return res.status(200).json(post)
    })
    .catch((error) => res.status(400).json({error}));
};

exports.deletePost = (req, res, next) => {
    // Decode token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;

    Post.findOne({_id: req.body.id})
    .then(post => {
        if (post.userId != userId) {
            return res.status(401).json("requête non autorisée !");
        }
        if (post.imageUrl) {
            const fileName = post.imageUrl.split("/images/")[1];
            fs.unlinkSync(`images/${fileName}`)
        }
        Post.deleteOne({ _id: req.body.id })
        .then(() => res.status(200).json({ id: post._id}))
        .catch(error => res.status(400).json({ error: error })); 
    })
    .catch(error => res.status(500).json({error: error}));
};

exports.addLikeToPost = (req, res, next) => {
    Post.findOne({_id: req.body.id})
    .then(post => {
        switch(req.body.like) {
            case 1 : 
                if(post.usersLiked.includes(req.body.userId)) {
                    res.status(400).json({error: "Vous avez deja liké ce post"}); 
                } else {
                    Post.updateOne({_id: req.body.id},
                        {$push : {usersLiked: req.body.userId},
                        $inc: {likes: +1}})
                    .then(() => {
                        res.status(200).json({message: "vous avez ajouté un like"});
                    })
                    .catch(error => res.status(400).json({ error }));    
                }
                break;

            case 0 : 
                if(post.usersLiked.includes(req.body.userId)) {
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