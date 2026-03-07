// Returns the full image URL, prepending the backend base in production.
// In development, Vite's proxy handles /uploads/* so relative paths work fine.

const API_URL = import.meta.env.VITE_API_URL || "";

// Extract backend base from API_URL (remove trailing /api if present)
const BACKEND_BASE = API_URL.replace(/\/api\/?$/, "");

export function getImageUrl(imageUrl) {
    if (!imageUrl) return "";

    // If it's already a full URL (e.g. https://...), return as-is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
    }

    // In production, prepend the Render backend URL
    if (BACKEND_BASE) {
        return `${BACKEND_BASE}${imageUrl}`;
    }

    // In local development, return as-is (Vite proxy handles it)
    return imageUrl;
}
