import { api } from '../api.js';
import { auth } from '../auth.js';
import { renderForbidden } from './forbidden.js';
import { formatDateTime, getRelativeTime, toggleLike} from '../utils.js';

/**
 * Displays the posts created by the logged-in user.
 * Only accessible to users with the 'user' or 'admin' role.
 */
export async function showMyPosts() {
    const user = auth.getUser();
    if (user.role !== 'user' && user.role !== 'admin') {
        renderForbidden();
        return;
    }
    user.role === 'admin' ? document.getElementById('view-title').textContent = 'My Posts' : '';

    const contentEl = document.getElementById('app-content');
    contentEl.innerHTML = `<div class="posts-list"></div>`;

    let posts = await api.get('/posts');
    posts = posts.filter(post => post.user === user.name || post.user === user.email);

    const postsListEl = contentEl.querySelector('.posts-list');
    if (posts.length === 0) {
        postsListEl.innerHTML = `
            <div class="no-posts">
                <div>
                    <i class="fa-solid fa-book-open-reader no-posts-icon"></i>
                    <h3>You haven't created any posts</h3>
                    <p>Use 'Create Post' to add your first post!</p>
                </div>
            </div>`;
        return;
    }

    postsListEl.innerHTML = posts.map(post => {
        const isLiked = post.likes && post.likes.includes(user.email);
        return `
        <div class="post-item">
            <div class="post-header">
                <span class="post-category">${post.category || 'General'}</span>
                <div class="post-actions">
                    <button class="edit-btn" title="Edit post" data-id="${post.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="delete-btn" title="Delete post" data-id="${post.id}"><i class="fa-solid fa-trash"></i></button>
                    <button class="view-liked-btn" title="View likes" data-id="${post.id}"><i class="fa-solid fa-heart"></i></button>
                </div>
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
                </div>
            </div>
        </div>
    `}).join('');

    postsListEl.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = () => location.hash = `#/dashboard/my-posts/edit/${btn.dataset.id}`;
    });
    postsListEl.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async () => {
            if (confirm('Are you sure you want to delete this post?')) {
                await api.delete(`/posts/${btn.dataset.id}`);
                showMyPosts(); // Reload list
            }
        };
    });
    postsListEl.querySelectorAll('.view-liked-btn').forEach(btn => {
        btn.onclick = async () => {
            const post = await api.get(`/posts/${btn.dataset.id}`);
            const likedList = post.likes && post.likes.length > 0
                ? post.likes.join('\n')
                : 'There are no users who liked this post.';
            alert(`Liked by:\n\n${likedList}`);
        };
    });

    if (user.role === 'user') {
        postsListEl.querySelectorAll('.like-btn').forEach((icon) => {
            icon.onclick = () => {
                toggleLike(icon.dataset.id, user.email, showMyPosts);
            };
        });
    }
}




