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
