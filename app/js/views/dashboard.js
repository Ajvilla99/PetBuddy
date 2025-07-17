import { api } from '../api.js';
import { auth } from '../auth.js';
import { formatDateTime, getRelativeTime, toggleLike, renderActionButton, toggleInterested } from '../utils.js';

export async function showDashboard() {
    const user = await auth.getUser();
    if (!user) return;

    const contentEl = document.getElementById('app-content');
    if (!contentEl) {
        console.error('Dashboard Error: #app-content element not found in the DOM.');
        return;
    }

    if (user.role === 'admin') {
        const titleEl = document.getElementById('view-title');
        if (titleEl) titleEl.textContent = 'Dashboard';
    }

    const allPosts = await api.get('/posts');
    const filteredPosts = allPosts.filter(post => post.user !== user.name && post.user !== user.email);

    let postsListHtml;

    if (filteredPosts.length === 0) {
        postsListHtml = `
            <div class="no-posts" style="grid-column: 1 / -1; text-align: center; padding: 40px; border: 1px dashed var(--border-color); margin-top: 20px; border-radius: 8px;">
                <div>
                    <i class="fa-solid fa-folder-open" style="font-size: 3em; color: var(--text-muted);"></i>
                    <h3>No hay publicaciones de otros usuarios</h3>
                    <p>Cuando otros usuarios publiquen, aparecerán aquí.</p>
                </div>
            </div>`;
    } else {
        postsListHtml = filteredPosts.map(post => {
            const isLiked = post.likes?.includes(user.email);
            const actionButton = renderActionButton(post, user);
            const imageHtml = post.imageUrl ? `<div class="user-post-images"><img src="${post.imageUrl}" alt="Imagen del post"></div>` : '';

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
        }).join('');
    }

    contentEl.innerHTML = `
        <div class="content-posts">
            <div class="user-post-container">
                <div class="user-post-photo">
                    <img src="https://i.pravatar.cc/150?u=${user.email}" alt="Tu avatar">
                </div>
                <form id="dashboard-create-post-form" class="user-post-form">
                    <textarea name="description" placeholder="¿Qué estás pensando, ${user.name}?" required></textarea>
                    <hr>
                    <button type="submit">Postear</button>
                </form>
            </div>
            <div class="user-posts">
                ${postsListHtml}
            </div>
        </div>
    `;

    if (user.role === 'user') {
        contentEl.querySelectorAll('.interested-btn').forEach(btn => {
            btn.onclick = () => toggleInterested(btn.dataset.id, user.email, showDashboard);
        });
        contentEl.querySelectorAll('.like-btn').forEach(icon => {
            icon.onclick = () => toggleLike(icon.dataset.id, user.email, showDashboard);
        });
    }

    const createPostForm = document.getElementById('dashboard-create-post-form');
    if (createPostForm) {
        createPostForm.onsubmit = (e) => {
            e.preventDefault();
            alert("Para crear un post completo con título, categoría y fecha, serás redirigido.");
            location.hash = '#/dashboard/create-post';
        };
    }
}