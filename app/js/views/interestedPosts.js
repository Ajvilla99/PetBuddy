import { api } from '../api.js';
import { auth } from '../auth.js';
import {
    formatDateTime,
    isPostPast,
    getRelativeTime,
    toggleLike,
    renderActionButton,
    toggleInterested,
} from '../utils.js';

/**
 * Displays the user's liked/interested posts.
 * Only accessible to users with the 'user' role.
 */
export async function showInterestedPosts() {
    const user = auth.getUser();
    document.getElementById('view-title').textContent = 'Interested Posts';
    const contentEl = document.getElementById('app-content');

    contentEl.innerHTML = `<div class="posts-list"></div>`;

    let posts = await api.get('/posts');
    posts = posts.filter(
        (post) =>
            Array.isArray(post.interested) &&
            post.interested.includes(user.email)
    );

    const postsListEl = contentEl.querySelector('.posts-list');
    if (posts.length === 0) {
        postsListEl.innerHTML = `
            <div class="no-posts">
                <div>
                    <i class="fa-solid fa-heart-broken no-posts-icon"></i>
                    <h3>No interested Posts</h3>
                    <p>You haven't shown interest in any posts yet.</p>
                </div>
            </div>`;
        return;
    }

    postsListEl.innerHTML = posts
        .map((post) => {
            const isPast = isPostPast(post.date, post.time);
            const isLiked = post.likes && post.likes.includes(user.email);
            const actionButton = renderActionButton(post, user, isPast);
            return `
        <div class="post-item ${isPast ? 'past-post' : ''}">
            <div class="post-header">
                <span class="post-category">${post.category || 'General'}</span>
                ${
                    isPast
                        ? '<span class="post-status past">Past Post</span>'
                        : ''
                }
            </div>
            <div class="post-content">
                <h3 class="post-name">${post.title || 'No Title'}</h3>
                <p class="post-description">${
                    post.description || 'No description available.'
                }</p>
                <div class="post-datetime">
                    <span class="post-date" title="Post Date and Time">
                        <i class="fa-solid fa-calendar-days"></i> ${formatDateTime(
                            post.date,
                            post.time
                        )}
                    </span>
                    <span class="post-relative-time">${getRelativeTime(
                        post.date,
                        post.time
                    )}</span>
                </div>
                <div class="post-meta">
                    <span title="user"><i class="fa-solid fa-chalkboard-user"></i> ${
                        post.user || 'N/A'
                    }</span>
                    <span title="Likes"><i class="fa-solid fa-heart like-btn ${
                        isLiked ? 'liked' : ''
                    }" data-id="${post.id}"></i> ${
                post.likes ? post.likes.length : 0
            }</span>
                </div>
            </div>
            ${
                user.role === 'user'
                    ? `<div class="post-footer">${actionButton}</div>`
                    : ''
            }
        </div>
    `;
        })
        .join('');

    // Add event listeners for like and interested actions
    if (user.role === 'user') {
        postsListEl.querySelectorAll('.interested-btn').forEach((btn) => {
            btn.onclick = () => {
                toggleInterested(btn.dataset.id, user.email, showInterestedPosts);
            };
        });
        postsListEl.querySelectorAll('.like-btn').forEach((icon) => {
            icon.onclick = () => {
                toggleLike(icon.dataset.id, user.email, showInterestedPosts);
            };
        });
    }
}
