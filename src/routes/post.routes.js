const express = require("express");
const postController = require("../controllers/post.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Apply auth middleware to all post routes
router.use(protect);

router.post("/", postController.createPost);
router.post("/verify-location", postController.verifyLocation);
router.post("/:id/save", postController.toggleSavePost);
router.get("/", postController.getFeed);
router.get("/user/:id", postController.getUserPosts);
router.delete("/:id", postController.deletePost);

module.exports = router;
