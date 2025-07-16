import { api } from '../api.js';
import { auth } from '../auth.js';
import { renderForbidden } from './forbidden.js';
import { renderNotFound } from './notFound.js';

/**
 * Displays the form to edit an existing user, fitting the new UI design.
 */
export async function showEditUser(userId) {
    const currentUser = auth.getUser();
    if (currentUser.role !== 'admin') {
        renderForbidden();
        return;
    }

    // Set the title in the main header
    document.getElementById('view-title').textContent = 'Edit User';
    const contentEl = document.getElementById('app-content');
    
    // Fetch user to edit and all users to get the available roles
    const [userData, allUsers] = await Promise.all([
        api.get(`/users/${userId}`),
        api.get('/users')
    ]);

    // If the user to edit doesn't exist, show not found page
    if (!userData) {
        renderNotFound();
        return;
    }
    
    // Get a unique list of roles from all users
    const roles = [...new Set(allUsers.map((user) => user.role))];

    // Render the form using the new CSS classes
    contentEl.innerHTML = `
        <div class="form-container">
            <form id="edit-user-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input id="name" value="${userData.name}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" type="email" value="${userData.email}" required>
                </div>
                <div class="form-group">
                    <label for="password">New Password</label>
                    <input type="password" id="password" placeholder="Leave blank to keep current password">
                </div>
                <div class="form-group">
                    <label for="role">Role</label>
                    <select id="role" required>
                        ${roles.map(role => `
                            <option value="${role}" ${role === userData.role ? 'selected' : ''}>
                                ${role}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save Changes</button>
                    <button type="button" id="cancel-btn" class="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    `;

    // Handle form submission
    document.getElementById('edit-user-form').onsubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            name: e.target.name.value,
            email: e.target.email.value,
            role: e.target.role.value,
        };
        
        // Only update the password if a new one is provided
        const newPassword = e.target.password.value;
        if (newPassword && newPassword.trim() !== '') {
            updatedData.password = await auth.hashText(newPassword);
        }

        try {
            await api.patch(`/users/${userId}`, updatedData);
            alert('User updated successfully!');
            location.hash = '#/dashboard/users';
        } catch (error) {
            alert('Failed to update user. Please try again.');
            console.error('Error updating user:', error);
        }
    };

    // Handle cancel button click
    document.getElementById('cancel-btn').onclick = () => {
        location.hash = '#/dashboard/users';
    };
}