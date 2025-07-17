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
    let user = await auth.getUser();

    if (isAuthenticated && user) {
        try {
            const verifiedUser = await api.get(`/users?email=${user.email}`);
            if (!verifiedUser.length || verifiedUser[0].role !== user.role) {
                throw new Error()
            }
        } catch {
            localStorage.removeItem('user');
            isAuthenticated = false;
            user = null;
        }
    }

    if (!isAuthenticated && document.querySelector('.app-container')) {
        ui.resetLayout();
    }

    if (path.startsWith('#/dashboard') && !isAuthenticated) {
        location.hash = '#/login';
        return;
    }

    if ((path === '#/login' || path === '#/register') && isAuthenticated) {
        location.hash = '#/dashboard';
        return;
    }

    if (isAuthenticated) {
        await ui.renderAppLayout();
    }

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

    if (view) {
        view(params);
        if (isAuthenticated) {
            ui.updateNavActiveState(path);
        }
    } else {
        renderNotFound();
    }
}