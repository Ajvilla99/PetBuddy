import { api } from '../api.js';
import { auth } from '../auth.js';
import { renderForbidden } from './forbidden.js';
import { formatDateTime, isPostPast, getRelativeTime } from '../utils.js';

/**
 * Displays the user's interested posts.
 * Only accessible to users with the 'user' role.
 * If the user is not a user, it renders a forbidden view.
 */
export async function showMyPosts() {
    const user = auth.getUser();
    if (user.role !== 'user') {
        renderForbidden();
        return;
    }
    
    document.getElementById('view-title').textContent = 'My posts';
    const contentEl = document.getElementById('app-content');
    contentEl.innerHTML = `<div class="posts-list"></div>`; // Placeholder

    let posts = await api.get('/posts');
    posts = posts.filter(a => Array.isArray(a.interested) && a.interested.includes(user.email));

    const postsListEl = contentEl.querySelector('.posts-list');
    if (posts.length === 0) {
        postsListEl.innerHTML = `
            <div class="no-posts">
                <div>
                    <i class="fa-solid fa-book-open-reader no-posts-icon"></i>
                    <h3>You're Not interested in Any posts</h3>
                    <p>Visit the 'View posts' page to find something new to discover!</p>
                </div>
            </div>`;
        return;
    }

    postsListEl.innerHTML = posts.map(post => {
        const isPast = isPostPast(post.date, post.time);
        
        return `
        <div class="post-item ${isPast ? 'past-post' : ''}">
            <div class="post-header">
                <span class="post-category">${post.category || 'General'}</span>
                ${isPast ? '<span class="post-status past">Past Post</span>' : ''}
            </div>
            <div class="post-content">
                <h3 class="post-name">${post.title || 'No Title'}</h3>
                <p class="post-description">${post.description || 'No description available.'}</p>
                <div class="post-datetime">
                    <span class="post-date" title="Post Date and Time">
                        <i class="fa-solid fa-calendar-days"></i> ${formatDateTime(post.date, post.time)}
                    </span>
                    <span class="post-relative-time">${getRelativeTime(post.date, post.time)}</span>
                </div>
                <div class="post-meta">
                    <span title="organizer"><i class="fa-solid fa-chalkboard-user"></i> ${post.organizer || 'N/A'}</span>
                </div>
            </div>
        </div>
    `}).join('');
}