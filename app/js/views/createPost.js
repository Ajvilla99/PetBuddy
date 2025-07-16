import { api } from '../api.js';
import { auth } from '../auth.js';
import { renderForbidden } from './forbidden.js';

/**
 * Displays the form to create a new post, fitting the new UI design.
 * Only accessible to users with the 'admin' or 'organizer' role.
 * If the user is not authorized, it renders a forbidden view.
 */
export async function showCreatePost() {
    const user = auth.getUser();
    if (user.role !== 'admin' && user.role !== 'organizer') {
        renderForbidden();
        return;
    }

    document.getElementById('view-title').textContent = 'Create a New Post';
    const contentEl = document.getElementById('app-content');

    const organizers = await api.get('/users?role=organizer');
    if (!organizers || organizers.length === 0) {
        alert('There are no organizers available. Please create an organizer first.');
        location.hash = '#/dashboard/users/create';
        return;
    }

    contentEl.innerHTML = `
        <div class="form-container">
            <form id="create-post-form">
                <div class="form-group">
                    <label for="title">Post Title</label>
                    <input id="title" placeholder="ex: Conference 2025" required>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" placeholder="A brief summary of the post content." required></textarea>
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <input id="category" placeholder="ex: Workshop" required>
                </div>
                <div class="form-group">
                    <label for="date">Post Date</label>
                    <input type="date" id="date" required min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="time">Post Time</label>
                    <input type="time" id="time" required>
                </div>
                ${user.role === 'admin' ? `<div class="form-group">
                    <label for="organizer">Organizer</label>
                    <select id="organizer" required>
                        ${organizers.map(i => `<option value="${i.name}">${i.name}</option>`).join('')}
                    </select>
                </div>` : ''}
                <div class="form-group">
                    <label for="capacity">Capacity</label>
                    <input type="number" id="capacity" placeholder="e.g., 25" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save post</button>
                    <button type="button" id="cancel-btn" class="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>`;
    
    document.getElementById('create-post-form').onsubmit = async (e) => {
        e.preventDefault();
        
        // Validate that the date is in the future
        const postDate = new Date(e.target.date.value + 'T' + e.target.time.value);
        const now = new Date();
        
        if (postDate <= now) {
            alert('Post date and time must be in the future.');
            return;
        }
        
        const data = {
            title: e.target.title.value,
            description: e.target.description.value,
            category: e.target.category.value,
            date: e.target.date.value,
            time: e.target.time.value,
            organizer: user.role === 'admin' ? e.target.organizer.value : user.name,
            capacity: parseInt(e.target.capacity.value, 10),
            interested: []
        };
        await api.post('/posts', data);
        location.hash = '#/dashboard/posts';
    };

    document.getElementById('cancel-btn').onclick = () => {
        location.hash = '#/dashboard/posts';
    };
}