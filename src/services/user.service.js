const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const userService = {
    async followUser(followerId, followingId) {
        if (followerId === followingId) {
            throw new AppError("You cannot follow yourself", 400);
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: followingId }
        });

        if (!targetUser) {
            throw new AppError("User not found", 404);
        }

        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        if (existingFollow) {
            throw new AppError("You are already following this user", 400);
        }

        await prisma.follow.create({
            data: {
                followerId,
                followingId
            }
        });

        return { success: true };
    },

    async unfollowUser(followerId, followingId) {
        if (followerId === followingId) {
            throw new AppError("You cannot unfollow yourself", 400);
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: followingId }
        });

        if (!targetUser) {
            throw new AppError("User not found", 404);
        }

        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        if (!existingFollow) {
            throw new AppError("You are not following this user", 400);
        }

        await prisma.follow.delete({
            where: { id: existingFollow.id }
        });

        return { success: true };
    },

    async getFollowers(userId) {
        const follows = await prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: { id: true, name: true, avatar: true, bio: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return follows.map(f => f.follower);
    },

    async getFollowing(userId) {
        const follows = await prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: { id: true, name: true, avatar: true, bio: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return follows.map(f => f.following);
    }
};

module.exports = userService;
