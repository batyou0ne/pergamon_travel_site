const express = require("express");
const commentController = require("../controllers/comment.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Allow public fetching of comments, but protect creation and deletion
router.get("/post/:postId", commentController.getPostComments);

// All other routes are protected
router.use(protect);

router.post("/", commentController.createComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
