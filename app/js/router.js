// === SPA posts ROUTER ===
// Responsibilities:
// 1. Map URL hash to a view function.
// 2. Protect routes based on authentication.
// 3. Delegate UI rendering to the 'ui' module.

import { auth } from './auth.js';
import { ui } from './ui.js'; // Import the new UI manager
import { api } from './api.js'

// Import all view functions
import { showLogin } from './views/login.js';
import { showRegister } from './views/register.js';
import { showDashboard } from './views/dashboard.js';
import { showPosts } from './views/posts.js';
import { showCreatePost } from './views/createPost.js';
import { showEditPost } from './views/editPost.js';
import { renderNotFound } from './views/notFound.js';
import { showManageUsers } from './views/manageUsers.js';
import { showEditUser } from './views/editUser.js';
import { showCreateUser } from './views/createUser.js';
import { showMyPosts } from './views/myPosts.js';


// Define your SPA routes here
const routes = {
    '#/login': showLogin,
    '#/register': showRegister,
    '#/dashboard': showDashboard,
    '#/dashboard/posts': showPosts,
    '#/dashboard/posts/create': showCreatePost,
    '#/dashboard/posts/edit/': showEditPost, // Note: Prefix for dynamic route
    '#/dashboard/users': showManageUsers,
    '#/dashboard/users/edit/': showEditUser,   // Note: Prefix for dynamic route
    '#/dashboard/users/create': showCreateUser,
    '#/dashboard/my-posts': showMyPosts,
    '#/not-found': renderNotFound,
};

/**
 * Main routing function. Triggered on page load and hash changes.
 */
export async function router() {
    const path = location.hash || '#/login';
    let isAuthenticated = auth.isAuthenticated();
    let user = auth.getUser();

    // Verify if the user is authenticated and exists in the database
    if (isAuthenticated && user) {
        try {
            const verifiedUser = await api.get(`/users?email=${user.email}`);
            if (!verifiedUser.length || verifiedUser[0].role !== user.role) {
                // Invalid user
                throw new Error()
            } 
        } catch {
            localStorage.removeItem('user');
            isAuthenticated = false;
            user = null;
        }
    }

    // On logout, the 'user' is removed from localStorage.
    // The next time router() runs, it will see !isAuthenticated and reset the layout.
    // This check ensures we clear the UI if a logout happens.
    if (!isAuthenticated && document.querySelector('.sidebar')) {
        ui.resetLayout();
    }

    // --- Route Protection ---
    // If trying to access a protected route without being logged in, redirect to login.
    if (path.startsWith('#/dashboard') && !isAuthenticated) {
        location.hash = '#/login';
        return; // Stop further execution
    }

    // If trying to access login/register while already logged in, redirect to dashboard.
    if ((path === '#/login' || path === '#/register') && isAuthenticated) {
        location.hash = '#/dashboard';
        return; // Stop further execution
    }

    // Delegate layout rendering to the UI module
    if (isAuthenticated) {
        ui.renderAppLayout();
    }

    // --- Route Matching ---
    let view;
    let params = null;

    // Prioritize dynamic routes since they are more specific
    if (path.startsWith('#/dashboard/posts/edit/')) {
        view = showEditPost;
        params = path.split('/').pop();
    } else if (path.startsWith('#/dashboard/users/edit/')) {
        view = showEditUser;
        params = path.split('/').pop();
    } else {
        // Fallback to static routes
        view = routes[path];
    }
    
    // --- View Rendering ---
    if (view) {
        // Execute the view function (which will populate #app-content)
        view(params);
        
        // After rendering the view, tell the UI module to update the nav state
        // if (isAuthenticated) {
        //     ui.updateNavActiveState(path);
        // }
    } else {
        // If no route matched, render the not found view
        renderNotFound();
    }
}