// Requires
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require("../models/user")
require("dotenv").config({path : "./config/.env"});

// Create post
exports.createPost = (req, res, next) => {
    // Check if there is no file and request text content doesn't respect the requirementsi in client side
    if (req.body.textContent.length < 2 && !req.file || req.body.textContent.length > 500 && !req.file) {
        return res.status(400).json("Vous devez renseigner au moins un message de deux caractères minimum pour pouvoir publier")
    }
    // Empty post object 
    let post = {};
    // if request file
    if(req.file) {
        // Set post object with image Url = file
        post = new Post({
            ...req.body,
            imageUrl : `${process.env.HOST}/images/${req.file.filename}`,
            created : Date.now(),
        });
    } else {
        // Set post object with image Url = null
        post = new Post({
            ...req.body,
            imageUrl : null,
            created : Date.now(),
        });
    }
    post.save()
    .then(() => res.status(201).json(post))
    .catch(error => res.status(500).json({ error }));
};

// Get all posts
exports.getAllPosts = (req, res, next) => {
    // Find all posts in database
    Post.find()
    .then(async (posts) => {
        const allPosts = [];
        // loop to hydrate post with user pseudo (very usefull if the user change its pseudo)
        for (let post of posts) {
            const user = await User.findOne({_id: post.userId})
            allPosts.push({...post._doc , pseudo: user.pseudo});
        }
        return allPosts;
    })
    .then((data) => res.status(200).json(data))
    .catch(error => res.status(400).json({error}));
};

// Update posts
exports.updatePost = async (req, res, next) => {
    // Decode token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;

    // get user and post to check the id
    const user = await User.findOne({_id: userId});
    const post = await Post.findOne({_id : req.body.id});

    // Check if there is no file and request text content doesn't respect the requirementsi in client side
    if (req.body.textContent.length < 2 && !req.file || req.body.textContent.length > 500 && !req.file) {
        return res.status(400).json("Vous devez renseigner au moins un message de deux caractères minimum pour pouvoir publier")
    }
    // check if decoded token doesn't match the targeted post user id or if the user isn't admin
    if (post.userId != userId && !user.isAdmin) {
        return res.status(403).json("requête non autorisée !");
    } 

    // set image Url with post image URL
    let imageUrl = post.imageUrl;

    // if request file
    if(req.file) { 
        // if there is already an imageUrl in database
        if (imageUrl) {
            // delete the database image
            const fileName = imageUrl.split("/images/")[1];
            fs.unlinkSync(`images/${fileName}`);
        }
        // set image URL with request file
        imageUrl = `${process.env.HOST}/images/${req.file.filename}`
    } 
    // if request body delete image is true
    else if (req.body.deleteImage === "true") {
        // delete image URL in database
        const fileName = imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${fileName}`);
        // set image URL = null
        imageUrl = null;
    }
    // Update post in database
    Post.findOneAndUpdate({ _id: req.body.id}, {
        ...req.body,
        imageUrl: imageUrl 
    }, {new: true})
    .then((post) => {
        return res.status(200).json(post)
    })
    .catch((error) => res.status(400).json({error}));
};

exports.deletePost = async (req, res, next) => {
    // Decode token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;

    // get user to check the id
    const user = await User.findOne({_id: req.body.userId});

    Post.findOne({_id: req.body.id})
    .then(post => {
        // check if decoded token doesn't match the targeted post user id or if the user isn't admin
        if (post.userId != userId && !user.isAdmin) {
            return res.status(403).json("requête non autorisée !");
        }
        // if there is image URL in database
        if (post.imageUrl) {
            // Delte image URL in database
            const fileName = post.imageUrl.split("/images/")[1];
            fs.unlinkSync(`images/${fileName}`)
        }
        // Delete post
        Post.deleteOne({ _id: req.body.id })
        .then(() => res.status(200).json({ id: post._id}))
        .catch(error => res.status(500).json({ error: error })); 
    })
    .catch(error => res.status(500).json({error: error}));
};

exports.addLikeToPost = (req, res, next) => {
    Post.findOne({_id: req.body.id})
    .then(post => {
        switch(req.body.like) {
            case 1 : 
                //The user add a like
                // User has already liked = error
                if(post.usersLiked.includes(req.body.userId)) {
                    res.status(400).json("Vous avez deja liké ce post"); 
                } else {
                    // Incrementing likes and push userId into usersLiked array
                    Post.updateOne({_id: req.body.id},
                        {$push : {usersLiked: req.body.userId},
                        $inc: {likes: +1}})
                    .then(() => {
                        res.status(200).json({message: "vous avez ajouté un like"});
                    })
                    .catch(error => res.status(500).json({ error }));    
                }
                break;

            case 0 :
                // The user erase his like 
                // Check if the userId is in the usersLiked array and delete it if it's the case + decrementing likes
                if(post.usersLiked.includes(req.body.userId)) {
                    Post.updateOne({_id: req.body.id},
                        {$pull : {usersLiked: req.body.userId},
                        $inc: {likes: -1}})
                    .then(() => {
                        res.status(200).json({message: "vous avez retiré votre like"})
                    })
                    .catch(error => res.status(500).json({error}));
                } else {
                    // User has already erase his like or don't like the post yet = error
                    return res.status(400).json("Vous devez liker ce post pour pouvoir effectuer cette requête")
                }
                break;
        }
    })
    .catch(error => res.status(500).json({error}));
};