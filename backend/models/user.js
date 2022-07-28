// Requires
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Create user schema
const userSchema = mongoose.Schema({
    pseudo : {type: String, required: true, unique: true},
    email : {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);