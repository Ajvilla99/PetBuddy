import { auth } from '../auth.js';

/**
 * Displays a styled 'page not found' message that adapts based on authentication status.
 */
export function renderNotFound() {
    const isAuthenticated = auth.isAuthenticated();
    const targetEl = isAuthenticated ? document.getElementById('app-content') : document.getElementById('app');
    
    // If the element is not found, do nothing (prevents errors during logout transitions)
    if (!targetEl) return;

    const buttonText = isAuthenticated ? 'Back to Dashboard' : 'Back to Login';
    const targetHash = isAuthenticated ? '#/dashboard' : '#/login';

    targetEl.innerHTML = `
    <div class="status-page-container">
        <div class="status-content">
            <i class="fa-solid fa-compass status-icon"></i>
            <h2>404 - Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
            <button id="status-back-btn" class="btn-primary">${buttonText}</button>
        </div>
    </div>
  `;

    document.getElementById('status-back-btn').onclick = () => {
        location.hash = targetHash;
    };
}