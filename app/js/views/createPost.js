import { api } from '../api.js';
import { auth } from '../auth.js';
import { renderForbidden } from './forbidden.js';

/**
 * Displays the form to create a new post, fitting the new UI design.
 * Only accessible to users with the 'admin' or 'user' role.
 * If the user is not authorized, it renders a forbidden view.
 */
export async function showCreatePost() {
    const user = auth.getUser();
    if (user.role !== 'admin' && user.role !== 'user') {
        renderForbidden();
        return;
    }

    user.role === 'admin' ? document.getElementById('view-title').textContent = 'Create a New Post' : '';

    const contentEl = document.getElementById('app-content');

    const users = await api.get('/users?role=user');
    if (!users || users.length === 0) {
        alert('There are no users available. Please create an user first.');
        location.hash = '#/dashboard/users/create';
        return;
    }

    contentEl.innerHTML = `
        <div class="form-container">
            <form id="create-post-form">
                <div class="form-group">
                    <label for="title">Título</label>
                    <input id="title" placeholder="Ej: Cachorro en adopción" required>
                </div>
                <div class="form-group">
                    <label for="description">Descripción</label>
                    <textarea id="description" placeholder="Describe tu publicación..." required></textarea>
                </div>
                <div class="form-group">
                    <label for="category">Categoría</label>
                    <input id="category" placeholder="Ej: Adopción, Perdido, Consejo" required>
                </div>
                <div class="form-group">
                    <label for="imageUrl">URL de la Imagen (Opcional)</label>
                    <input type="url" id="imageUrl" placeholder="https://ejemplo.com/imagen.jpg">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Publicar</button>
                    <button type="button" id="cancel-btn" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>`;
    
    document.getElementById('create-post-form').onsubmit = async (e) => {
        e.preventDefault();
        
        // EVIDENCIA: Se crea el timestamp en el momento del envío.
        const data = {
            title: e.target.title.value,
            description: e.target.description.value,
            category: e.target.category.value,
            imageUrl: e.target.imageUrl.value,
            user: auth.getUser().name,
            createdAt: new Date().toISOString(), // Timestamp automático
            likes: [],
            interested: []
        };
        await api.post('/posts', data);
        location.hash = '#/dashboard/my-posts';
    };

    document.getElementById('cancel-btn').onclick = () => location.hash = '#/dashboard/my-posts';
}