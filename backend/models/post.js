const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    userId: {type: String, required: true},
    textContent : {type: String, required: true},
    imageUrl : {type: String, required: true},
    likes: {type: Number, default: 0},
    usersLiked: {type: [String], required: false},
    created: {type: Date, required: true}
});

module.exports = (mongoose.model("Post", postSchema));