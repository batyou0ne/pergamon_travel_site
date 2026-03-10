const express = require("express");
const postController = require("../controllers/post.controller");
const { protect, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Allow public access to read posts, but attach user if logged in (for checking if "saved")
router.get("/", optionalAuth, postController.getFeed);
router.get("/user/:id", optionalAuth, postController.getUserPosts);

// Apply auth middleware to all remaining post routes (create, delete, save, etc.)
router.use(protect);

router.post("/", postController.createPost);
router.post("/verify-location", postController.verifyLocation);
router.post("/:id/save", postController.toggleSavePost);
router.post("/:id/like", postController.toggleLikePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
