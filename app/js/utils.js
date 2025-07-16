import { api } from './api.js';
// Utility functions for the application

/**
 * Formats a date and time for display
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @returns {string} - Formatted date and time string
 */
export function formatDateTime(date, time) {
    if (!date || !time) return 'Date TBD';
    
    try {
        const dateObj = new Date(date + 'T' + time);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return dateObj.toLocaleDateString('en-EN', options);
    } catch (error) {
        return 'Invalid date';
    }
}

/**
 * Checks if an post is in the past
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @returns {boolean} - True if the post is in the past
 */
export function isPostPast(date, time) {
    if (!date || !time) return false;
    
    try {
        const postDate = new Date(date + 'T' + time);
        return postDate <= new Date();
    } catch (error) {
        return false;
    }
}

/**
 * Gets a relative time description (e.g., "In 2 days", "Yesterday")
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @returns {string} - Relative time description
 */
export function getRelativeTime(date, time) {
    if (!date || !time) return '';
    
    try {
        const postDate = new Date(date + 'T' + time);
        const now = new Date();
        const diffMs = postDate - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return diffDays === -1 ? 'Yesterday' : `${Math.abs(diffDays)} days ago`;
        } else if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Tomorrow';
        } else {
            return `In ${diffDays} days`;
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
    if (isPostPast(post.date, post.time)) {
        alert('Cannot change interest for past posts.');
        return;
    }
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

/**
 * Render the interested button HTML for a post and user.
 * @param {object} post
 * @param {object} user
 * @param {boolean} isPast
 * @returns {string}
 */
export function renderActionButton(post, user, isPast) {
    if (user.role !== 'user') return '';
    if (isPast) {
        return `<button class="btn-secondary" disabled>Post Finished</button>`;
    }
    const isInterested = Array.isArray(post.interested) && post.interested.includes(user.email);
    if (isInterested) {
        return `<button class="btn-danger interested-btn" data-id="${post.id}" data-interested="true">Not interested</button>`;
    } else {
        return `<button class="btn-primary interested-btn" data-id="${post.id}" data-interested="false">I'm interested!</button>`;
    }
}
