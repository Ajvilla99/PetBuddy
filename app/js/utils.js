import { api } from './api.js';
// Utility functions for the application

/**
 * Formats a date and time for display
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @returns {string} - Formatted date and time string
 */
export function formatDateTime(timestamp) {
    if (!timestamp) return 'Date TBD';
    try {
        const dateObj = new Date(timestamp);
        return dateObj.toLocaleString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid date';
    }
}


export function getRelativeTime(timestamp) {
    if (!timestamp) return '';
    try {
        const now = new Date();
        const postDate = new Date(timestamp);
        const seconds = Math.round((now - postDate) / 1000);

        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 5) {
            return "justo ahora";
        } else if (seconds < 60) {
            return `${seconds}s`;
        } else if (minutes < 60) {
            return `${minutes}m`;
        } else if (hours < 24) {
            return `${hours}h`;
        } else if (days === 1) {
            return "ayer";
        } else {
            return postDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        }
    } catch (error) {
        return '';
    }
}

/**
 * Toggle like for a post by a user. Calls callback after update.
 * @param {string} postId
 * @param {string} userEmail
 * @param {function} callback
 */
export async function toggleLike(postId, userEmail, callback) {
    const post = await api.get(`/posts/${postId}`);
    if (!post.likes) post.likes = [];
    const isLiked = post.likes.includes(userEmail);
    if (isLiked) {
        post.likes = post.likes.filter(email => email !== userEmail);
    } else {
        post.likes.push(userEmail);
    }
    await api.patch(`/posts/${postId}`, { likes: post.likes });
    if (typeof callback === 'function') callback();
}

/**
 * Toggle interested for a post by a user. Calls callback after update.
 * @param {string} postId
 * @param {string} userEmail
 * @param {function} callback
 */
export async function toggleInterested(postId, userEmail, callback) {
    const post = await api.get(`/posts/${postId}`);
    if (!post.interested) post.interested = [];
    const isInterested = post.interested.includes(userEmail);
    if (isInterested) {
        post.interested = post.interested.filter(email => email !== userEmail);
        await api.patch(`/posts/${postId}`, { interested: post.interested });
        alert('You are no longer interested.');
    } else {
        post.interested.push(userEmail);
        await api.patch(`/posts/${postId}`, { interested: post.interested });
        alert('Registration successful!');
    }
    if (typeof callback === 'function') callback();
}

export function renderActionButton(post, user) {
    if (user.role !== 'user') return '';
    
    const isInterested = Array.isArray(post.interested) && post.interested.includes(user.email);
    if (isInterested) {
        return `<button class="btn-danger interested-btn" data-id="${post.id}">Ya no me interesa</button>`;
    } else {
        return `<button class="btn-primary interested-btn" data-id="${post.id}">¡Me interesa!</button>`;
    }
}
