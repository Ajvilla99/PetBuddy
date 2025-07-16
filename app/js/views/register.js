import { auth } from '../auth.js';
import { router } from '../router.js';

/**
 * Displays the registration form for new users.
 * If the user is already authenticated, it redirects to the dashboard.
 * On successful registration, it logs in the user and redirects to the dashboard.
 * If registration fails, it shows an error message.
 * The form includes fields for name, email, and password.
 * It also includes a link to switch to the login form.
 */
export function showRegister() {
    document.getElementById('app').innerHTML = `
    <div class="login-page-container">
        <div class="login-form-container register-form">
            <h2>Create an Account</h2>
            <form id="register-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" placeholder="Juan Perez" required>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" placeholder="you@example.com" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn-primary">Register</button>
                <a href="#/login" class="switch-form-link" data-link>Already have an account? Login</a>
            </form>
        </div>
    </div>`;

    document.getElementById('register-form').onsubmit = async e => {
        e.preventDefault();
        try {
            await auth.register(e.target.name.value, e.target.email.value, e.target.password.value);
            location.hash = '#/dashboard';
            router();
        } catch (error) {
            alert(error.message);
        }
    };

    document.querySelector('[data-link]').onclick = (e) => {
        e.preventDefault();
        location.hash = '#/login';
    };
}