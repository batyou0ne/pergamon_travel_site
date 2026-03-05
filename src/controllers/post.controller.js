const postService = require("../services/post.service");
const catchAsync = require("../utils/catchAsync");
const { sendSuccess } = require("../utils/response");

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = catchAsync(async (req, res) => {
    const userId = req.user.id;

    // Create the post
    const post = await postService.createPost(userId, req.body);

    // If location is provided, automatically verify for badges
    let earnedBadges = [];
    if (req.body.latitude && req.body.longitude) {
        earnedBadges = await postService.verifyLocationForBadge(userId, req.body.latitude, req.body.longitude);
    }

    sendSuccess(res, 201, { post, earnedBadges }, "Post created successfully");
});

/**
 * @desc    Verify location manually
 * @route   POST /api/posts/verify-location
 * @access  Private
 */
const verifyLocation = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    const earnedBadges = await postService.verifyLocationForBadge(userId, latitude, longitude);

    sendSuccess(res, 200, { earnedBadges }, "Location verified");
});

/**
 * @desc    Get global feed
 * @route   GET /api/posts
 * @access  Private
 */
const getFeed = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const { page, limit } = req.query;
    const posts = await postService.getFeedPosts(
        userId,
        page ? parseInt(page) : undefined,
        limit ? parseInt(limit) : undefined
    );

    sendSuccess(res, 200, { posts }, "Feed retrieved successfully");
});

/**
 * @desc    Get user's posts
 * @route   GET /api/posts/user/:id
 * @access  Private
 */
const getUserPosts = catchAsync(async (req, res) => {
    const userId = parseInt(req.params.id);
    const posts = await postService.getUserPosts(userId);

    sendSuccess(res, 200, { posts }, "User posts retrieved successfully");
});

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const postId = parseInt(req.params.id);

    await postService.deletePost(postId, userId);

    sendSuccess(res, 200, null, "Post deleted successfully");
});

/**
 * @desc    Toggle save post
 * @route   POST /api/posts/:id/save
 * @access  Private
 */
const toggleSavePost = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const postId = parseInt(req.params.id);

    const result = await postService.toggleSavePost(postId, userId);

    sendSuccess(res, 200, result, "Post saved status toggled");
});

module.exports = {
    createPost,
    verifyLocation,
    getFeed,
    getUserPosts,
    deletePost,
    toggleSavePost,
};
