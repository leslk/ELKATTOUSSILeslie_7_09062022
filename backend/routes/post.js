// Requires
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config")

// Import controllers
const postCtrl = require("../controllers/post");

// Create post routes
router.post("/", auth, multer, postCtrl.createPost);
router.get("/", auth, postCtrl.getAllPosts);
router.put("/:id", auth, multer, postCtrl.updatePost);
router.delete("/:id", auth, postCtrl.deletePost);
router.post("/:id/like",auth, postCtrl.addLikeToPost);


module.exports = router;