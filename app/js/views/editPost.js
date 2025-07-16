import { api } from '../api.js';
import { auth } from '../auth.js';
import { renderForbidden } from './forbidden.js';
import { renderNotFound } from './notFound.js';

/**
 * Displays the form to edit an existing post, fitting the new UI design.
 * Only accessible to users with the 'admin' or 'organizer' role.
 * If the user is not authorized, it renders a forbidden view.
 * If the post does not exist, it renders a not found view.
 */
export async function showEditPost(postId) {
    const user = auth.getUser();
    if (user.role !== 'admin' && user.role !== 'organizer') {
        renderForbidden();
        return;
    }

    document.getElementById('view-title').textContent = 'Edit Post';
    const contentEl = document.getElementById('app-content');
    
    const [post, organizers] = await Promise.all([
        api.get(`/posts/${postId}`),
        api.get('/users?role=organizer')
    ]);

    if (!post) {
        renderNotFound();
        return;
    }
    
    contentEl.innerHTML = `
        <div class="form-container">
            <form id="edit-post-form">
                <div class="form-group">
                    <label for="title">Post Title</label>
                    <input id="title" value="${post.title}" required>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" required>${post.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <input id="category" value="${post.category}" required>
                </div>
                <div class="form-group">
                    <label for="date">Post Date</label>
                    <input type="date" id="date" value="${post.date || ''}" required min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="time">Post Time</label>
                    <input type="time" id="time" value="${post.time || ''}" required>
                </div>
                ${user.role === 'admin' ? `<div class="form-group">
                    <label for="organizer">Organizer</label>
                    <select id="organizer" required>
                        ${organizers.map(i => `<option value="${i.name}" ${i.name === post.organizer ? 'selected' : ''}>${i.name}</option>`).join('')}
                    </select>
                </div>` : ''}
                <div class="form-group">
                    <label for="capacity">Capacity</label>
                    <input type="number" id="capacity" value="${post.capacity}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save Changes</button>
                    <button type="button" id="cancel-btn" class="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('edit-post-form').onsubmit = async (e) => {
        e.preventDefault();
        
        // Validate that the date is in the future
        const postDate = new Date(e.target.date.value + 'T' + e.target.time.value);
        const now = new Date();
        
        if (postDate <= now) {
            alert('Post date and time must be in the future.');
            return;
        }
        
        const updated = {
            title: e.target.title.value,
            description: e.target.description.value,
            category: e.target.category.value,
            date: e.target.date.value,
            time: e.target.time.value,
            organizer: user.role === 'admin' ? e.target.organizer.value : user.name,
            capacity: parseInt(e.target.capacity.value, 10),
        };
        await api.patch(`/posts/${postId}`, updated);
        location.hash = '#/dashboard/posts';
    };

    document.getElementById('cancel-btn').onclick = () => {
        location.hash = '#/dashboard/posts';
    };
}