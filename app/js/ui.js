import { auth } from './auth.js';

let isAppLayoutRendered = false;

export const ui = {
    renderAppLayout() {
        if (isAppLayoutRendered) return;

        const user = auth.getUser();
        if (!user) return;

        // EVIDENCIA: Se define el contenido del header. Será un string vacío si el usuario no es admin.
        const adminHeader = user.role === 'admin'
            ? `
            <header class="main-header">
                <h1 id="view-title">Admin Dashboard</h1>
            </header>`
            : '';

        let navLinks = `
            <a href="#/dashboard" class="nav-btn" data-link><i class="fa-solid fa-house"></i> <span>Dashboard</span></a>
            <a href="#/dashboard/interested-posts" class="nav-btn" data-link><i class="fa-solid fa-heart"></i> <span>Interesados</span></a>
            <a href="#/dashboard/my-posts" class="nav-btn" data-link><i class="fa-solid fa-user"></i> <span>Mis Posts</span></a>
            <a href="#/dashboard/my-posts/create-post" class="nav-btn create-post-main-btn" data-link><i class="fa-solid fa-plus-circle"></i> <span>Crear Post</span></a>
        `;

        if (user.role === 'admin') {
            navLinks += `
                <a href="#/dashboard/users" class="nav-btn" data-link><i class="fa-solid fa-users-cog"></i> <span>Gestionar Usuarios</span></a>
            `;
        }

        // EVIDENCIA: Se rediseña el HTML de #app para un layout de 3 columnas con un contenedor principal de 1300px.
        document.getElementById('app').innerHTML = `
            <div class="app-container">
                <!-- Columna Izquierda: Navegación -->
                <aside class="left-column">
                    <div class="sidebar-sticky-content">
                        <div class="user-profile">
                            <img src="https://i.pravatar.cc/150?u=${user.email}" alt="User" class="profile-img">
                            <div class="user-info">
                                <h3>${user.name}</h3>
                                <p>${user.role}</p>
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

                <!-- Columna Central: Contenido Principal -->
                <main class="main-column">
                    ${adminHeader}
                    <div id="app-content"></div>
                </main>

                <!-- Columna Derecha: Contenido Adicional -->
                <aside class="right-column">
                    <div class="sidebar-sticky-content">
                        <h3>Tendencias</h3>
                        <p>Contenido a pensar...</p>
                        <!-- Aquí podrías poner hashtags populares, usuarios sugeridos, etc. -->
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

        isAppLayoutRendered = true;
    },

    // ... resto de las funciones de ui.js (resetLayout, updateNavActiveState) sin cambios ...
    resetLayout() {
        isAppLayoutRendered = false;
        document.getElementById('app').innerHTML = '';
    },
    
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