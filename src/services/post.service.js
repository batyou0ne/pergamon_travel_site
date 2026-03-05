const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { getDistanceFromLatLonInM } = require("../utils/geo");

class PostService {
    async createPost(userId, data) {
        const { imageUrl, caption, locationName, latitude, longitude } = data;

        if (!imageUrl) {
            throw new AppError("Image is required to create a post", 400);
        }

        const post = await prisma.post.create({
            data: {
                userId,
                imageUrl,
                caption,
                locationName,
                latitude,
                longitude,
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

        return post;
    }

    async verifyLocationForBadge(userId, latitude, longitude) {
        if (!latitude || !longitude) {
            throw new AppError("Latitude and longitude are required for verification", 400);
        }

        // Get all badges
        const badges = await prisma.badge.findMany();
        const earnedBadges = [];

        for (const badge of badges) {
            const distance = getDistanceFromLatLonInM(latitude, longitude, badge.targetLat, badge.targetLng);

            // If user is within the badge's radius
            if (distance <= badge.radiusMeters) {
                // Check if user already has this badge
                const existingUserBadge = await prisma.userBadge.findUnique({
                    where: {
                        userId_badgeId: {
                            userId,
                            badgeId: badge.id,
                        },
                    },
                });

                if (!existingUserBadge) {
                    // Award the badge
                    await prisma.userBadge.create({
                        data: {
                            userId,
                            badgeId: badge.id,
                        },
                    });
                    earnedBadges.push(badge);
                }
            }
        }

        return earnedBadges; // Returns array of newly earned badges
    }

    async getFeedPosts(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const posts = await prisma.post.findMany({
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

        if (!userId) {
            return posts.map(post => ({ ...post, isSaved: false }));
        }

        const savedPosts = await prisma.savedPost.findMany({
            where: {
                userId,
                postId: { in: posts.map(p => p.id) }
            }
        });
        const savedPostIds = new Set(savedPosts.map(sp => sp.postId));

        return posts.map(post => ({
            ...post,
            isSaved: savedPostIds.has(post.id)
        }));
    }

    async getUserPosts(userId) {
        const posts = await prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return posts;
    }

    async deletePost(postId, userId) {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (post.userId !== userId && user.role !== 'ADMIN') {
            throw new AppError("You are not authorized to delete this post", 403);
        }

        await prisma.post.delete({
            where: { id: postId }
        });

        return true;
    }

    async toggleSavePost(postId, userId) {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) throw new AppError("Post not found", 404);

        const existingSave = await prisma.savedPost.findUnique({
            where: { userId_postId: { userId, postId } }
        });

        if (existingSave) {
            await prisma.savedPost.delete({
                where: { id: existingSave.id }
            });
            return { saved: false };
        } else {
            await prisma.savedPost.create({
                data: { userId, postId }
            });
            return { saved: true };
        }
    }
}

module.exports = new PostService();
