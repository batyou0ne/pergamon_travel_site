const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");
const { sendSuccess } = require("../utils/response");

/**
 * @desc    Follow a user
 * @route   POST /api/users/:id/follow
 * @access  Private
 */
const followUser = catchAsync(async (req, res) => {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.id);

    await userService.followUser(followerId, followingId);

    sendSuccess(res, 200, null, "User followed successfully");
});

/**
 * @desc    Unfollow a user
 * @route   DELETE /api/users/:id/unfollow
 * @access  Private
 */
const unfollowUser = catchAsync(async (req, res) => {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.id);

    await userService.unfollowUser(followerId, followingId);

    sendSuccess(res, 200, null, "User unfollowed successfully");
});

/**
 * @desc    Get followers of a user
 * @route   GET /api/users/:id/followers
 * @access  Public
 */
const getFollowers = catchAsync(async (req, res) => {
    const targetUserId = parseInt(req.params.id);

    const followers = await userService.getFollowers(targetUserId);

    sendSuccess(res, 200, { followers }, "Followers retrieved successfully");
});

/**
 * @desc    Get users a user is following
 * @route   GET /api/users/:id/following
 * @access  Public
 */
const getFollowing = catchAsync(async (req, res) => {
    const targetUserId = parseInt(req.params.id);

    const following = await userService.getFollowing(targetUserId);

    sendSuccess(res, 200, { following }, "Following retrieved successfully");
});

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
};
