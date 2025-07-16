import { api } from '../api.js';
import { auth } from '../auth.js';
import { formatDateTime, isPostPast, getRelativeTime, toggleLike, renderActionButton, toggleInterested } from '../utils.js';
/**
 * Displays the dashboard view for authenticated users.
 */
export async function showDashboard() {
    const user = auth.getUser();
    document.getElementById('view-title').textContent = 'All Posts';
    const contentEl = document.getElementById('app-content');
    contentEl.innerHTML = `<div class="posts-list"></div>`;

    // Show all posts except those created by the logged-in user
    let posts = await api.get('/posts');
    const filtered = posts.filter(post => post.user !== user.name && post.user !== user.email);
    const postsListEl = contentEl.querySelector('.posts-list');
    if (filtered.length === 0) {
        postsListEl.innerHTML = `
            <div class="no-posts">
                <div>
                    <i class="fa-solid fa-folder-open no-posts-icon"></i>
                    <h3>No posts Found</h3>
                    <p>There are no posts to display at the moment.</p>
                </div>
            </div>`;
        return;
    }

    postsListEl.innerHTML = filtered.map(post => {
        const isInterested = post.interested && post.interested.includes(user.email);
        const isLiked = post.likes && post.likes.includes(user.email);
        const isPast = isPostPast(post.date, post.time);
        
        const actionButton = renderActionButton(post, user, isPast);

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
                    <span title="user"><i class="fa-solid fa-chalkboard-user"></i> ${post.user || 'N/A'}</span>
                    <span title="Likes"><i class="fa-solid fa-heart like-btn ${isLiked ? 'liked' : ''}" data-id="${post.id}"></i> ${post.likes ? post.likes.length : 0}</span>
                    <span title="Interested"><i class="fa-solid fa-user-check"></i> ${post.interested ? post.interested.length : 0}</span>
                </div>
            </div>
            ${user.role === 'user' ? `<div class="post-footer">${actionButton}</div>` : ''}
        </div>
    `}).join('');

    // --- Add Post Listeners ---
    if (user.role === 'user') {
        postsListEl.querySelectorAll('.interested-btn').forEach(btn => {
            btn.onclick = () => {
                toggleInterested(btn.dataset.id, user.email, showDashboard);
            };
        });
        postsListEl.querySelectorAll('.like-btn').forEach(icon => {
            icon.onclick = () => {
                toggleLike(icon.dataset.id, user.email, showDashboard);
            };
        });
    }
}



