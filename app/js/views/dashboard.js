// app/js/views/dashboard.js

// EVIDENCIA: Se mantienen todas las importaciones necesarias de la versión `HEAD` y `utils.js`
// para la funcionalidad de datos, formato de fechas e interactividad.
import { api } from '../api.js';
import { auth } from '../auth.js';
import { formatDateTime, getRelativeTime, toggleLike, renderActionButton, toggleInterested } from '../utils.js';

/**
 * Muestra el dashboard principal: un feed con los posts de otros usuarios.
 * FUSIONADO: Utiliza la estructura del contenido central de Abraham (formulario + lista de posts)
 * y la llena con la lógica de datos y funcionalidad de la versión HEAD.
 */
export async function showDashboard() {
    // EVIDENCIA: Se obtiene el usuario actual para personalizar la UI y filtrar posts.
    const user = auth.getUser();
    if (!user) return; // Salvaguarda.

    // EVIDENCIA: De acuerdo a la arquitectura en `router.js` y `ui.js`, las vistas
    // actualizan el título y renderizan su contenido en `#app-content`, no en `#app`.
    user.role === 'admin' ? document.getElementById('view-title').textContent = 'Dashboard' : ''
    const contentEl = document.getElementById('app-content');
    contentEl.innerHTML = ''; // Limpiar el contenido previo para evitar duplicados.

    // EVIDENCIA: Lógica de `HEAD` para obtener todos los posts y filtrarlos para
    // no mostrar los del propio usuario, creando el "feed principal".
    const allPosts = await api.get('/posts');
    const filteredPosts = allPosts.filter(post => post.user !== user.name && post.user !== user.email);

    let postsListHtml;

    // EVIDENCIA: Se mantiene la lógica de `HEAD` para el caso de no encontrar posts,
    // pero se adapta para mostrar un mensaje más amigable dentro del layout.
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
        // EVIDENCIA: Se usa el `.map()` de `HEAD` para generar los posts dinámicamente.
        postsListHtml = filteredPosts.map(post => {
    const isInterested = post.interested?.includes(user.email);
    const isLiked = post.likes?.includes(user.email);
    const actionButton = renderActionButton(post, user); // Ya no se necesita isPast

    // EVIDENCIA: Condicional para renderizar la imagen si existe.
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
                    <!-- EVIDENCIA: Se llama a la nueva función getRelativeTime -->
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
    
    // EVIDENCIA: Se renderiza el layout del contenido central de Abraham, que incluye
    // el formulario para crear un post y el contenedor para la lista de posts.
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
        <aside class="aside-right">[CONTENIDO A PENSAR]</aside>
    `;

    // EVIDENCIA: Se adjuntan los listeners de eventos de `HEAD` después de renderizar el HTML.
    // Esto asegura que los botones de 'like' e 'interesado' sean funcionales.
    if (user.role === 'user') {
        contentEl.querySelectorAll('.interested-btn').forEach(btn => {
            btn.onclick = () => toggleInterested(btn.dataset.id, user.email, showDashboard);
        });
        contentEl.querySelectorAll('.like-btn').forEach(icon => {
            icon.onclick = () => toggleLike(icon.dataset.id, user.email, showDashboard);
        });
    }

    // EVIDENCIA: Se añade la lógica para el formulario de creación rápida de post.
    // Al no tener todos los campos, podríamos redirigir a la vista de creación completa.
    const createPostForm = document.getElementById('dashboard-create-post-form');
    if(createPostForm) {
        createPostForm.onsubmit = (e) => {
            e.preventDefault();
            // Opción 1: Crear un post simple (requeriría ajustar la API/DB).
            // Opción 2 (Recomendada): Redirigir a la vista de creación completa.
            alert("Para crear un post completo con título, categoría y fecha, serás redirigido.");
            location.hash = '#/dashboard/my-posts/create-post';
        };
    }
}