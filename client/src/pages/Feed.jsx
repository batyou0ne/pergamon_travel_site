import { useState, useEffect, useRef } from "react";
import api from "../lib/api";
import { getImageUrl } from "../lib/imageUrl";
import { Heart, MessageCircle, MapPin, Trash2, Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Feed.css";

const PostSkeleton = () => (
    <div className="post skeleton-post">
        <div className="skeleton-image shimmer" />
        <div className="skeleton-overlay">
            <div className="skeleton-line shimmer" style={{ width: '40%' }} />
            <div className="skeleton-actions">
                <div className="skeleton-circle shimmer" />
                <div className="skeleton-circle shimmer" />
            </div>
        </div>
    </div>
);

const PostItem = ({ post, onPostDeleted }) => {
    const [liked, setLiked] = useState(post.isLiked || false);
    const [likesCount, setLikesCount] = useState(post.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [isSaved, setIsSaved] = useState(post.isSaved || false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/posts/${post.id}`);
            if (onPostDeleted) onPostDeleted(post.id);
        } catch (err) {
            console.error("Failed to delete post", err);
            alert("Failed to delete post.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error("Failed to delete comment", err);
            alert("Failed to delete comment.");
        }
    };

    const handleLike = async () => {
        const previousLiked = liked;
        const previousCount = likesCount;

        // Optimistic UI
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);

        try {
            const res = await api.post(`/posts/${post.id}/like`);
            setLiked(res.data.data.liked);
            setLikesCount(res.data.data.likesCount);
        } catch (err) {
            console.error("Failed to toggle like", err);
            setLiked(previousLiked);
            setLikesCount(previousCount);
        }
    };

    const handleSave = async () => {
        setIsSaved(!isSaved); // Optimistic UI
        try {
            const res = await api.post(`/posts/${post.id}/save`);
            setIsSaved(res.data.data.saved);
        } catch (err) {
            console.error("Failed to toggle save", err);
            setIsSaved(!isSaved); // Revert on failure
        }
    };

    const fetchComments = async () => {
        if (comments.length > 0) return;
        setLoadingComments(true);
        try {
            const res = await api.get(`/comments/post/${post.id}`);
            setComments(res.data.data.comments || []);
        } catch (err) {
            console.error("Failed to fetch comments", err);
        } finally {
            setLoadingComments(false);
        }
    };

    const toggleComments = () => {
        const nextState = !showComments;
        setShowComments(nextState);
        if (nextState) fetchComments();
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await api.post("/comments", {
                postId: post.id,
                content: newComment
            });
            setComments([...comments, res.data.data.comment]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment", err);
            alert("Failed to post comment. Please try again.");
        }
    };

    const userAvatar = post.user?.avatar || post.user?.name?.charAt(0).toUpperCase() || "U";

    return (
        <article className="post card">
            <div className="post__image-wrapper">
                {post.imageUrl ? (
                    <img src={getImageUrl(post.imageUrl)} alt={post.locationName || "Travel post"} loading="lazy" className="post__image" />
                ) : (
                    <div className="post__image" style={{ height: '300px', backgroundColor: '#e0e0e0' }} />
                )}

                <div className="post__always-visible-top" style={{ position: 'absolute', top: 16, left: 16, zIndex: 2, pointerEvents: 'none' }}>
                    {post.locationName && (
                        <div className="post__location" style={{ pointerEvents: 'auto' }}>
                            <MapPin size={14} />
                            <span>{post.locationName}</span>
                        </div>
                    )}
                </div>

                <div className="post__overlay">
                    <div className="post__overlay-top">
                        <div className="post__top-left-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', marginTop: post.locationName ? '40px' : '0' }}>
                            {post.badgeEarned && (
                                <span className="post__badge" title="Verified Location Badge">
                                    {post.badgeEarned}
                                </span>
                            )}
                            <button className={`post__save-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave} title={isSaved ? "Unsave" : "Save"}>
                                <Bookmark size={20} fill={isSaved ? "white" : "none"} stroke="white" />
                            </button>
                        </div>
                    </div>

                    <div className="post__overlay-bottom">
                        <div className="post__user">
                            <div className="avatar avatar-sm">{userAvatar}</div>
                            <div>
                                <div className="post__user-name">{post.user?.name}</div>
                                {post.caption && <div className="post__caption">{post.caption}</div>}
                            </div>
                        </div>

                        <div className="post__actions">
                            <button className={`post__action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                                <Heart size={24} fill={liked ? "currentColor" : "rgba(0,0,0,0.3)"} stroke={"white"} />
                                <span>{likesCount}</span>
                            </button>
                            <button className="post__action-btn" onClick={toggleComments}>
                                <MessageCircle size={24} stroke={"white"} fill="rgba(0,0,0,0.3)" />
                                <span>{post.commentCount || 0}</span>
                            </button>
                            {isAdmin && (
                                <button className="post__action-btn" onClick={handleDeletePost} style={{ marginLeft: 'auto' }}>
                                    <Trash2 size={24} stroke={"white"} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Comments Dropdown ── */}
            {showComments && (
                <div className="post__comments-dropdown">
                    <div className="post__comments-list">
                        {loadingComments ? (
                            <div className="post__comments-loading"></div>
                        ) : (
                            <>
                                {comments.length > 0 ? (
                                    comments.map(comment => (
                                        <div key={comment.id} className="post__comment" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{comment.user?.name}</strong> {comment.content}
                                            </div>
                                            {(isAdmin || user?.id === comment.userId) && (
                                                <button onClick={() => handleDeleteComment(comment.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', color: 'inherit' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="post__no-comments">No comments yet.</div>
                                )}
                            </>
                        )}
                    </div>

                    <form className="post__comment-form" onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" disabled={!newComment.trim()}>Post</button>
                    </form>

                    <button className="close-comments-btn" onClick={() => setShowComments(false)}>
                        Close Comments
                    </button>
                </div>
            )}
        </article>
    );
};

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    const fetchPosts = async (pageNum, isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setLoadingMore(true);

            const res = await api.get(`/posts?page=${pageNum}&limit=10`);
            const newPosts = res.data.data.posts || [];

            if (newPosts.length < 10) {
                setHasMore(false);
            }

            if (isInitial) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load posts.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchPosts(1, true);
    }, []);

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        if (loading) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        fetchPosts(nextPage);
                        return nextPage;
                    });
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loading, hasMore, loadingMore]);

    return (
        <div className="feed-container">
            <div className="feed__header">
                <h1 className="text-h1">Explore the World</h1>
            </div>

            {/* Posts Grid */}
            <div className="feed__posts">
                {loading && posts.length === 0 ? (
                    // Show skeletons for initial load
                    Array(6).fill(0).map((_, i) => <PostSkeleton key={i} />)
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <PostItem
                            key={post.id}
                            post={post}
                            onPostDeleted={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
                        />
                    ))
                ) : !loading && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <h2 className="text-h2">No Posts Yet</h2>
                        <p>Be the first to share an adventure!</p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && <div className="feed__error" style={{ textAlign: 'center', color: '#dc2626', padding: '1rem' }}>{error}</div>}

            {/* Infinite Scroll Trigger & Loading More Indicator */}
            <div ref={loadMoreRef} className="feed__load-more">
                {loadingMore && <div className="spinner"></div>}
                {!hasMore && posts.length > 0 && (
                    <p className="text-secondary text-sm">✨ You've seen all posts!</p>
                )}
            </div>
        </div>
    );
};

export default Feed;
