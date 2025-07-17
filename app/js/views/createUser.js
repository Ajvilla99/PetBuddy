import { api } from '../api.js';
import { auth } from '../auth.js';
import { renderForbidden } from './forbidden.js';

/**
 * Displays the form to create a new user, fitting the new UI design.
 * Only accessible to users with the 'admin' role.
 * If the user is not authorized, it renders a forbidden view.
 */
export async function showCreateUser() {
    const user = auth.getUser();
    if (user.role !== 'admin') {
        renderForbidden();
        return;
    }

    user.role === 'admin' ? document.getElementById('view-title').textContent = 'Create a New User' : '';

    const contentEl = document.getElementById('app-content');
    
    const users = await api.get('/users');
    const roles = [...new Set(users.map(u => u.role))];
    if (!roles.includes('user')) roles.push('user');
    if (!roles.includes('user')) roles.push('user');


    contentEl.innerHTML = `
        <div class="form-container">
            <form id="create-user-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" type="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                <div class="form-group">
                    <label for="role">Role</label>
                    <select id="role" required>
                        <option value="" disabled selected>Select a role</option>
                        ${roles.map(role => `<option value="${role}">${role}</option>`).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Create User</button>
                    <button type="button" id="cancel-btn" class="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('create-user-form').onsubmit = async (e) => {
        e.preventDefault();
        const existingUser = await api.get(`/users?email=${e.target.email.value}`);
        if(existingUser.length > 0) {
            alert('Error: This email is already interested.');
            return;
        }

        const hashedPassword = await auth.hashText(e.target.password.value);
        const newUser = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: hashedPassword,
            role: e.target.role.value,
        };
        await api.post('/users', newUser);
        location.hash = '#/dashboard/users';
    };

    document.getElementById('cancel-btn').onclick = () => {
        location.hash = '#/dashboard/users';
    };
}