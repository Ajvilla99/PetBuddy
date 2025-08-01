import { auth } from './auth.js';

let isAppShellRendered = false;

export const ui = {
    /**
     * Renderiza el "cascarón" principal de la aplicación (sidebars, contenedores).
     * Está diseñado para ejecutarse solo una vez por sesión de login.
     */
    async renderAppShell() {
        if (isAppShellRendered) return;

        const user = await auth.getUser();
        if (!user) return;

        const adminHeader = user.role === 'admin'
            ? `<header class="main-header"><h1 id="view-title">Admin Dashboard</h1></header>`
            : '';

        let navLinks = `
            <a href="#/dashboard" class="nav-btn" data-link><i class="fa-solid fa-house"></i> <span>Dashboard</span></a>
            <a href="#/dashboard/interested-posts" class="nav-btn" data-link><i class="fa-solid fa-heart"></i> <span>Interesados</span></a>
            <a href="#/dashboard/my-profile" class="nav-btn" data-link><i class="fa-solid fa-user"></i> <span>Mi perfil</span></a>
            <a href="#/dashboard/create-post" class="nav-btn create-post-main-btn" data-link><i class="fa-solid fa-plus-circle"></i> <span>Crear Post</span></a>
        `;

        if (user.role === 'admin') {
            navLinks += `<a href="#/dashboard/users" class="nav-btn" data-link><i class="fa-solid fa-users-cog"></i> <span>Gestionar Usuarios</span></a>`;
        }

        document.getElementById('app').innerHTML = `
            <div class="app-container">
                <!-- Columna Izquierda: Navegación (Estática) -->
                <aside class="left-column">
                    <div class="sidebar-sticky-content">
                        <div class="user-profile">
                            <img src="https://i.pravatar.cc/150?u=${user.email}" alt="User" class="profile-img">
                            <div class="user-info">
                                <h3>${user.name}</h3>
                                <p>${user.email}</p>
                            </div>
                        </div>
                        <nav class="sidebar-nav">${navLinks}</nav>
                        <div class="sidebar-footer">
                            <button id="logout-btn" class="nav-btn logout-btn">
                                <i class="fa-solid fa-sign-out-alt"></i> <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- Columna Central: Contenido Principal (Dinámico) -->
                <main class="main-column">
                    ${adminHeader}
                    <div id="app-content"></div>
                </main>

                <!-- Columna Derecha: Contenido Adicional (Estática) -->
                <aside class="right-column">
                    <div class="sidebar-sticky-content">
                        <h3>Tendencias</h3>
                        <p>Contenido a pensar...</p>
                    </div>
                </aside>
            </div>
        `;

        document.getElementById('logout-btn').onclick = auth.logout;
        document.querySelectorAll('[data-link]').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                location.hash = link.getAttribute('href');
            };
        });

        isAppShellRendered = true;
    },

    /**
     * Resetea completamente el layout, usualmente al hacer logout.
     */
    resetLayout() {
        isAppShellRendered = false;
        document.getElementById('app').innerHTML = '';
    },
    
    /**
     * Actualiza el estado activo del botón de navegación actual.
     */
    async updateNavActiveState(path) {
        if (!isAppShellRendered) return;
        
        document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
            btn.classList.remove('active');
            const routeBase = btn.getAttribute('href');
            if (path === routeBase || (routeBase !== '#/dashboard' && path.startsWith(routeBase))) {
                btn.classList.add('active');
            }
        });

        if (path === '#/dashboard') {
            const user = await auth.getUser();
            if (user && user.role === 'admin') {
                document.querySelector('.nav-btn[href="#/dashboard"]').classList.add('active');
            }
        }
    }
};