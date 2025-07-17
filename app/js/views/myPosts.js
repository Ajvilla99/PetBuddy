import { api } from '../api.js';
import { auth } from '../auth.js';
import { renderForbidden } from './forbidden.js';
import { formatDateTime, getRelativeTime, toggleLike, renderActionButton} from '../utils.js';

/**
 * Displays the posts created by the logged-in user.
 * Only accessible to users with the 'user' or 'admin' role.
 */
export async function showMyPosts() {
    const user = await auth.getUser();
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
        const isLiked = post.likes?.includes(user.email);
        const actionButton = renderActionButton(post, user); 
    
        const imageHtml = post.imageUrl
            ? `<div class="user-post-images"><img src="${post.imageUrl}" alt="Imagen del post"></div>`
            : '';
    
        return `
        <div class="user-post">
            <div class="user-post-header">
                <img src="https://i.pravatar.cc/150?u=${user.email}" alt="Avatar de ${post.user}">
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
        </div>
    `;}).join('');

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




