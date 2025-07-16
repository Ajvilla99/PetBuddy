import { auth } from '../auth.js';

/**
 * Displays the dashboard view for authenticated users.
 */
export function showDashboard() {
    const user = auth.getUser();
    document.getElementById('view-title').textContent = 'Dashboard';
    
    const contentEl = document.getElementById('app-content');
    contentEl.innerHTML = `
        <h2>Welcome back, ${user.name}!</h2>
        <p>You are logged in as <strong>${user.role}</strong>.</p>
        <p>Select an option from the sidebar to get started.</p>
    `;
}