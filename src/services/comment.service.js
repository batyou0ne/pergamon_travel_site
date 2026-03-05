const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

class CommentService {
    /**
     * @desc Create a new comment on a post
     */
    async createComment(userId, postId, content) {
        if (!content || content.trim().length === 0) {
            throw new AppError("Comment content cannot be empty", 400);
        }

        // Verify post exists
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        const comment = await prisma.comment.create({
            data: {
                userId,
                postId,
                content: content.trim(),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        return comment;
    }

    /**
     * @desc Get comments for a post with pagination
     */
    async getPostComments(postId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const comments = await prisma.comment.findMany({
            where: { postId },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        const total = await prisma.comment.count({
            where: { postId }
        });

        return {
            comments,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * @desc Delete a comment
     */
    async deleteComment(commentId, userId) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            throw new AppError("Comment not found", 404);
        }

        // Authorization check: User can only delete their own comment
        // (Admin could also be checked here if Role exists and is used)
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (comment.userId !== userId && user.role !== 'ADMIN') {
            throw new AppError("You are not authorized to delete this comment", 403);
        }

        await prisma.comment.delete({
            where: { id: commentId }
        });

        return true;
    }
}

module.exports = new CommentService();
