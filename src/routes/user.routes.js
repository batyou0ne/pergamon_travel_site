const express = require("express");
const userController = require("../controllers/user.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Define routes
router.post("/:id/follow", protect, userController.followUser);
router.delete("/:id/unfollow", protect, userController.unfollowUser);

router.get("/:id/followers", userController.getFollowers);
router.get("/:id/following", userController.getFollowing);

module.exports = router;
