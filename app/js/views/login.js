import { auth } from '../auth.js';
import { router } from '../router.js';

/**
 * Displays the login form for existing users.
 * If the user is already authenticated, it redirects to the dashboard.
 * On successful login, it redirects to the dashboard.
 * If login fails, it shows an error message.
 * The form includes fields for email and password.
 * It also includes a link to switch to the registration form.
 */
export function showLogin() {
    document.getElementById('app').innerHTML = `
    <div class="login-page-container">
      <div class="login-form-container">
        <h2>Bienvenido!</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn-primary">Iniciar Sesión</button>
          <a href="#/register" class="switch-form-link" data-link>No tienes una cuenta? Regístrate</a>
        </form>
      </div>
    </div>`;

    document.getElementById('login-form').onsubmit = async (e) => {
        e.preventDefault();
        try {
            await auth.login(e.target.email.value, e.target.password.value);
            location.hash = '#/dashboard';
            router(); // Trigger router to render the new layout
        } catch (error) {
            alert(error.message);
        }
    };

    document.querySelector('[data-link]').onclick = (e) => {
        e.preventDefault();
        location.hash = '#/register';
    }
}