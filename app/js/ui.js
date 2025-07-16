import { auth } from './auth.js';

let isAppLayoutRendered = false;

export const ui = {
    /**
     * Renders the main application layout if it hasn't been rendered yet.
     */
    renderAppLayout() {
        if (isAppLayoutRendered) {
            return; // Do nothing if already rendered
        }

        const user = auth.getUser();
        if (!user) {
            console.error("Attempted to render layout without a user.");
            return;
        }

        // Define navigation links based on user role
        let navLinks = `
            <a href="#/dashboard" class="nav-btn" data-link><i class="fa-solid fa-house"></i> Dashboard</a>
            <a href="#/dashboard/interested-posts" class="nav-btn" data-link><i class="fa-solid fa-heart"></i> Interested Posts</a>
            <a href="#/dashboard/my-posts" class="nav-btn" data-link><i class="fa-solid fa-user"></i> My Posts</a>
            <a href="#/dashboard/my-posts/create-post" class="nav-btn" data-link><i class="fa-solid fa-plus-circle"></i> Create Post</a>
        `;
        if (user.role === 'admin') {
            navLinks += `
                <a href="#/dashboard/users" class="nav-btn" data-link><i class="fa-solid fa-users-cog"></i> Manage Users</a>
            `;
        }

        document.getElementById('app').innerHTML = `
            <aside class="sidebar">
                <div class="user-profile">
                    <img src="https://i.pravatar.cc/150?u=${user.email}" alt="User" class="profile-img">
                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p>${user.role}</p>
                    </div>
                </div>
                <nav class="sidebar-nav">${navLinks}</nav>
                <div class="sidebar-footer">
                    <button id="logout-btn" class="nav-btn">
                        <i class="fa-solid fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </aside>
            <main class="main-content">
                <header class="main-header">
                    <h1 id="view-title"></h1>
                </header>
                <div id="app-content" class="dashboard-content"></div>
            </main>
        `;

        document.getElementById('logout-btn').onclick = auth.logout;
        // Post listeners to handle navigation links
        document.querySelectorAll('[data-link]').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                location.hash = link.getAttribute('href');
            };
        });

        isAppLayoutRendered = true;
    },

    /**
     * Resets the entire application UI, typically on logout.
     */
    resetLayout() {
        isAppLayoutRendered = false;
        document.getElementById('app').innerHTML = '';
    },
    
    /**
     * Updates the active state of the sidebar navigation.
     * @param {string} path - The current URL hash path.
     */
    updateNavActiveState(path) {
        if (!isAppLayoutRendered) return;
        
        document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
            btn.classList.remove('active');
            const routeBase = btn.getAttribute('href');
            if (path === routeBase || (routeBase !== '#/dashboard' && path.startsWith(routeBase))) {
                btn.classList.add('active');
            }
        });
        if (path === '#/dashboard') {
            document.querySelector('.nav-btn[href="#/dashboard"]').classList.add('active');
        }
    }
};