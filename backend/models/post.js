const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    postTextContent : {type: String, required: true},
    imageUrl : {type: String, required: true},
    likes: {type: Number, default: 0},
    usersLiked: {type: [String], required: false}
});

module.exports(mongoose.model("Post", postSchema));