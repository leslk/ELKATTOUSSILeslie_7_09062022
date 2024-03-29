// Requires
const mongoose = require("mongoose");

// Create post schema
const postSchema = mongoose.Schema({
    userId: {type: String, required: true},
    textContent : {type: String, required: false},
    imageUrl : {type: String, required: false},
    likes: {type: Number, default: 0},
    usersLiked: {type: [String], required: false},
    created: {type: Date, required: true}
});

module.exports = (mongoose.model("Post", postSchema));