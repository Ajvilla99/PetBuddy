import { auth } from '../auth.js';

/**
 * Displays the dashboard view for authenticated users.
 */
export function showDashboard() {
    const user = auth.getUser();
    document.getElementById('view-title').textContent = 'Dashboard';
    
    const contentEl = document.getElementById('app');
    contentEl.innerHTML = `
        <div class="dashboard-container">
            <aside class="sidebar_left">
                <div>[LOGO]</div>
                <nav>
                <a href="#home">[ICON] <span class="achor-link">Home</span></a>
                <a href="#profile">[ICON] <span class="achor-link">Profile</span></a>
                <a href="#settings"
                    >[ICON] <span class="achor-link">Settings</span></a
                >
                <a href="#logout">[ICON] <span class="achor-link">Logout</span></a>
                </nav>

                <div>[MI PERFIL]</div>
            </aside>

            <div class="content-posts">
                <div class="user-post-container">
                    <div class="user-post-photo">
                        <img src="https://i.pravatar.cc/150?u=${user.email}" alt="">
                    </div>
                    <form class="user-post-form">
                        <textarea placeholder="¿Qué estás pensando?"></textarea>
                        <hr>
                        <button>Postear</button>
                    </form>
                </div>

                <div class="user-posts">
                    ${
                        Array(5).fill().map((_, i) => `
                        <div class="user-post">
                            <div class="user-post-header">
                                <img src="https://i.pravatar.cc/?u=${user.email}" alt="">
                            </div>
                            <div class="user-post-content">
                                <div class="user-post-title">
                                    <h3>${user.name} - Post ${i + 1}</h3>
                                    <button class="">...</button>
                                </div>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus, quos!</p>
                                <div class="user-post-images">
                                    <img src="https://place.dog/300/300" alt="">
                                </div>
                                <div class="user-post-actions">
                                    <button class="">
                                        <span title="Likes"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        `
                        
                    ).join('')}
                </div>
            </div>
            <aside class="aside-right">[CONTENIDO A PENSAR]</aside>
        </div>
    `;
}