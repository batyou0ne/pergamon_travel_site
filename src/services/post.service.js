const prisma = require("../config/prisma");
const supabase = require("../config/supabase");
const AppError = require("../utils/AppError");
const { getDistanceFromLatLonInM } = require("../utils/geo");
const crypto = require("crypto");

class PostService {
    async createPost(userId, data) {
        let { imageUrl, caption, locationName, latitude, longitude } = data;

        if (!imageUrl) {
            throw new AppError("Image is required to create a post", 400);
        }

        console.log("== Incoming Post Creation ==");
        console.log("imageUrl starts with data:image?", String(imageUrl).startsWith("data:image"));
        console.log("imageUrl length:", String(imageUrl).length);

        // Upload base64 image to Supabase Storage
        if (imageUrl.startsWith("data:image")) {
            const matches = imageUrl.match(/^data:image\/([a-zA-Z0-9-+\/]+);base64,(.+)$/);

            if (!matches || matches.length !== 3) {
                console.error("Regex failed. Match output:", matches);
                throw new AppError("Invalid image format - Regex parsing failed", 400);
            }

            const extension = matches[1].replace("jpeg", "jpg");
            const base64Data = matches[2];
            const mimeType = `image/${matches[1]}`;

            console.log(`Extracted extension: ${extension}, Base64 length: ${base64Data.length}`);

            const buffer = Buffer.from(base64Data, "base64");
            const fileName = `${crypto.randomUUID()}.${extension}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("post-images")
                .upload(fileName, buffer, {
                    contentType: mimeType,
                    upsert: false,
                });

            if (uploadError) {
                console.error("Supabase Storage upload error:", uploadError);
                throw new AppError("Failed to upload image to cloud storage", 500);
            }

            console.log("Uploaded to Supabase Storage:", uploadData.path);

            // Get the public URL
            const { data: publicUrlData } = supabase.storage
                .from("post-images")
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
            console.log("Public image URL:", imageUrl);
        }

        console.log("Final imageUrl pointing to DB:", imageUrl);

        // Remove ANY null byte from all string fields (deep clean for Postgres)
        const sanitize = (str) => {
            if (typeof str !== 'string') return str;
            // Remove actual null bytes \x00, \u0000 and PostgreSQL incompatible characters
            return str.replace(/[\x00\u0000]/g, '');
        };

        const sanitizedCaption = sanitize(caption);
        const sanitizedLocationName = sanitize(locationName);
        const sanitizedImageUrl = sanitize(imageUrl);

        console.log("Sanitized variables:", {
            caption: sanitizedCaption,
            locationName: sanitizedLocationName,
            imageUrl: sanitizedImageUrl
        });

        const post = await prisma.post.create({
            data: {
                userId,
                imageUrl: sanitizedImageUrl,
                caption: sanitizedCaption,
                locationName: sanitizedLocationName,
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
                postLikes: {
                    where: { userId: userId || -1 },
                    select: { id: true }
                },
                savedBy: {
                    where: { userId: userId || -1 },
                    select: { id: true }
                },
                _count: {
                    select: { comments: true }
                }
            },
        });

        return posts.map(post => {
            const isLiked = post.postLikes?.length > 0;
            const isSaved = post.savedBy?.length > 0;
            const commentCount = post._count?.comments || 0;
            const { postLikes, savedBy, _count, ...rest } = post;
            return { ...rest, isLiked, isSaved, commentCount };
        });
    }

    async getUserPosts(userId) {
        const posts = await prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { comments: true }
                }
            }
        });
        return posts.map(post => {
            const commentCount = post._count?.comments || 0;
            const { _count, ...rest } = post;
            return { ...rest, commentCount };
        });
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

    async toggleLikePost(postId, userId) {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) throw new AppError("Post not found", 404);

        const existingLike = await prisma.postLike.findUnique({
            where: { userId_postId: { userId, postId } }
        });

        if (existingLike) {
            // Unlike
            const [_, updatedPost] = await prisma.$transaction([
                prisma.postLike.delete({ where: { id: existingLike.id } }),
                prisma.post.update({
                    where: { id: postId },
                    data: { likes: { decrement: 1 } }
                })
            ]);
            return { liked: false, likesCount: updatedPost.likes };
        } else {
            // Like
            const [_, updatedPost] = await prisma.$transaction([
                prisma.postLike.create({ data: { userId, postId } }),
                prisma.post.update({
                    where: { id: postId },
                    data: { likes: { increment: 1 } }
                })
            ]);
            return { liked: true, likesCount: updatedPost.likes };
        }
    }
}

module.exports = new PostService();
