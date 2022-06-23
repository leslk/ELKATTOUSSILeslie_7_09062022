const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");

router.post("/", postCtrl.createPost);
router.get("/", postCtrl.getAllPosts);
router.put("/:id", postCtrl.updatePost);
router.delete("/:id", postCtrl.deletePost);
router.post("/:id/like", postCtrl.addLikeToPost);


module.exports = router;