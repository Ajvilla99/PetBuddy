import { api } from './api.js'; // Implements and exports API functions in api.js

export const auth = {
    // Implements the login function
    login: async (email, pass) => {
        // Query the API to find the user by email
        // If the password matches, store the user in localStorage
        // Throw an error if the credentials are invalid
        const users = await api.get(`/users?email=${email}`);
        if (users.length === 0) {
            throw new Error('Invalid credentials');
        }
        const hashed = await auth.hashText(pass);
        if (users[0].password !== hashed) {
            throw new Error('Invalid credentials');
        }
        const user = users[0];
        // Exclude the password before saving to localStorage
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword)); // Store the user in localStorage
    },
    // Implements the register function
    register: async (name, email, pass) => {
        // Query the API to check if the email already exists
        // If it doesn't exist, register the user and store in localStorage
        // Throw an error if the email is already interested
        const existingUser = await api.get(`/users?email=${email}`);
        if (existingUser.length > 0) {
            throw new Error('Email is already interested');
        }
        const hashed = await auth.hashText(pass);
        const newUser = { name, email, password: hashed, role: 'user' }; // Assign a default role
        await api.post('/users', newUser); // Register the new user
        await auth.login(email, pass);
    },
    // Implements the logout function
    logout: () => {
        // Remove the user from localStorage and redirect to login
        localStorage.removeItem('user'); // Remove the stored user
        location.hash = '#/login';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    },
    // Returns true if a user is authenticated
    isAuthenticated: () => {
        const user = localStorage.getItem('user');
        if (!user) return false;
        try {
            const parsed = JSON.parse(user);
            // Validate that the user has the required fields
            if (!parsed.email || !parsed.role) throw new Error();
            // Validate the user against the database
            return true;
        } catch {
            localStorage.removeItem('user');
            return false;
        }
    },
    // Returns the authenticated user
    getUser: () => {
        const user = localStorage.getItem('user');
        if (!user) return null;
        try {
            const parsed = JSON.parse(user);
            if (!parsed.email || !parsed.role) throw new Error();
            return parsed;
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    },
    // Hashes a text using SHA-256
    hashText: async (text) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
};
