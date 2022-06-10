const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");

router.post("/", postCtrl.createPost);
router.get("/", postCtrl.getAllPosts);
router.put("/", postCtrl.updatePost);
router.delete("/", postCtrl.deletePost);
router.post("/like", postCtrl.addLikeToPost);


module.exports = router;