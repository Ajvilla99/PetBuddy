import { api } from '../api.js';
import { auth } from '../auth.js';
import {
    formatDateTime,
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
    const user = await auth.getUser();
    user.role === 'admin' ? document.getElementById('view-title').textContent = 'Interested Posts' : '';

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
    const isLiked = post.likes?.includes(user.email);
    const actionButton = renderActionButton(post, user); 

    const imageHtml = post.imageUrl
        ? `<div class="user-post-images"><img src="${post.imageUrl}" alt="Imagen del post"></div>`
        : '';

    return `
    <div class="user-post">
        <div class="user-post-header">
            <img src="https://i.pravatar.cc/150?u=${post.user}" alt="Avatar de ${post.user}">
        </div>
        <div class="user-post-content">
            <div class="user-post-title">
                <div>
                    <strong>${post.user}</strong>
                    <small class="post-relative-time" title="${formatDateTime(post.createdAt)}"> · ${getRelativeTime(post.createdAt)}</small>
                </div>
            </div>
            
            <h3>${post.title}</h3>
            <p>${post.description}</p>
            
            ${imageHtml}
            
            <div class="user-post-actions">
                <div class="post-meta">
                    <span title="Likes" class="like-btn-container">
                       <i class="fa-solid fa-heart like-btn ${isLiked ? 'liked' : ''}" data-id="${post.id}"></i> 
                       ${post.likes?.length || 0}
                    </span>
                    <span title="Interesados">
                       <i class="fa-solid fa-user-check"></i> 
                       ${post.interested?.length || 0}
                    </span>
                </div>
                ${user.role === 'user' ? `<div class="post-footer">${actionButton}</div>` : ''}
            </div>
        </div>
    </div>`;
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
