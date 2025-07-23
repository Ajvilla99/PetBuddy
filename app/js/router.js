import { auth } from './auth.js';
import { ui } from './ui.js';
import { api } from './api.js'
import { showLogin } from './views/login.js';
import { showRegister } from './views/register.js';
import { showDashboard } from './views/dashboard.js';
import { showCreatePost } from './views/createPost.js';
import { showEditPost } from './views/editPost.js';
import { renderNotFound } from './views/notFound.js';
import { showManageUsers } from './views/manageUsers.js';
import { showEditUser } from './views/editUser.js';
import { showCreateUser } from './views/createUser.js';
import { showMyPosts } from './views/myPosts.js';
import { showInterestedPosts } from './views/interestedPosts.js';

const routes = {
    '#/login': showLogin,
    '#/register': showRegister,
    '#/dashboard': showDashboard,
    '#/dashboard/interested-posts': showInterestedPosts,
    '#/dashboard/create-post': showCreatePost,
    '#/dashboard/users': showManageUsers,
    '#/dashboard/users/edit/': showEditUser,
    '#/dashboard/users/create': showCreateUser,
    '#/dashboard/my-posts': showMyPosts,
    '#/not-found': renderNotFound,
};

export async function router() {
    const path = location.hash || '#/login';
    let isAuthenticated = auth.isAuthenticated();
    
    if (isAuthenticated) {
        // En lugar de llamar a ui.renderAppLayout() aquí,
        // lo hacemos de forma más inteligente.
        // Verificamos si el cascarón ya está en el DOM.
        const appContainer = document.querySelector('.app-container');
        if (!appContainer) {
            // Si no existe, lo renderizamos. Esto solo pasará al loguearse
            // o al refrescar la página estando logueado.
            await ui.renderAppShell();
        }
    }

    // --- Lógica de Protección de Rutas (sin cambios) ---
    if (path.startsWith('#/dashboard') && !isAuthenticated) {
        location.hash = '#/login';
        return;
    }
    if ((path === '#/login' || path === '#/register') && isAuthenticated) {
        location.hash = '#/dashboard';
        return;
    }

    // --- Route Matching (sin cambios) ---
    let view;
    let params = null;

    if (path.startsWith('#/dashboard/my-posts/edit/')) {
        view = showEditPost;
        params = path.split('/').pop();
    } else if (path.startsWith('#/dashboard/users/edit/')) {
        view = showEditUser;
        params = path.split('/').pop();
    } else {
        view = routes[path];
    }
    
    // --- Renderizado de Vistas ---
    if (view) {
        // Ahora, la función de vista se ejecuta sabiendo que #app-content ya existe.
        view(params); 
        
        if (isAuthenticated) {
            ui.updateNavActiveState(path);
        }
    } else {
        // Si la ruta no autenticada no existe, renderiza el not found dentro de #app
        const targetEl = isAuthenticated ? document.getElementById('app-content') : document.getElementById('app');
        renderNotFound(targetEl);
    }
}