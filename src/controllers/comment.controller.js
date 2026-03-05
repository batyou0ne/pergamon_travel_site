const commentService = require("../services/comment.service");
const catchAsync = require("../utils/catchAsync");
const { sendSuccess } = require("../utils/response");

/**
 * @desc    Create a new comment
 * @route   POST /api/comments
 * @access  Private
 */
const createComment = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { postId, content } = req.body;

    const comment = await commentService.createComment(userId, parseInt(postId), content);

    sendSuccess(res, 201, { comment }, "Comment added successfully");
});

/**
 * @desc    Get comments for a post
 * @route   GET /api/comments/post/:postId
 * @access  Public/Private
 */
const getPostComments = catchAsync(async (req, res) => {
    const postId = parseInt(req.params.postId);
    const { page, limit } = req.query;

    const result = await commentService.getPostComments(
        postId,
        page ? parseInt(page) : undefined,
        limit ? parseInt(limit) : undefined
    );

    sendSuccess(res, 200, result, "Comments retrieved successfully");
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
const deleteComment = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const commentId = parseInt(req.params.id);

    await commentService.deleteComment(commentId, userId);

    sendSuccess(res, 200, null, "Comment deleted successfully");
});

module.exports = {
    createComment,
    getPostComments,
    deleteComment,
};
