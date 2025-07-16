import './app/js/api.js'; // Implements the API in js/api.js
import './app/js/auth.js'; // Implements authentication in js/auth.js
import { router } from './app/js/router.js'; // Implements the router in js/router.js

// Initialize the router when the page loads and when the hash changes
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

