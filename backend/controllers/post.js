const Post = require("../models/post");

exports.createPost = (req, res, next) => {
    const post = new Post ({
        postTextContent : req.body.postTextContent,
        imageUrl : `${process.env.Host}/images/${req.file.filename}`
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
    console.log(req.body);
    Post.updateOne({ _id: req.body.id}, {
        postTextContent : req.body.postTextContent,
        imageUrl : `${process.env.Host}/images/${req.file.filename}`,
    })
    .then(() => res.status(200).json({message: 'Post modifié !'}))
    .catch((error) => res.status(400).json({error}));
}

exports.deletePost = (req, res, next) => {
    Post.findOneAndDelete({_id: req.body.id})
    .then(() => res.status(200).json({message: 'Post supprimé !'}))
    .catch((error) => res.status(400).json({error}));
}

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
}