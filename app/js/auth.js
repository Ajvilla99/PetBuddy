import { api } from './api.js';
import { ui } from './ui.js';

export const auth = {
    login: async (email, pass) => {
        const users = await api.get(`/users?email=${email}`);
        if (users.length === 0) {
            throw new Error('Invalid credentials');
        }
        const hashed = await auth.hashText(pass);
        if (users[0].password !== hashed) {
            throw new Error('Invalid credentials');
        }
        const user = users[0];
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    },
    register: async (name, email, pass) => {
        const existingUser = await api.get(`/users?email=${email}`);
        if (existingUser.length > 0) {
            throw new Error('Email is already interested');
        }
        const hashed = await auth.hashText(pass);
        const newUser = { name, email, password: hashed, role: 'user' };
        await api.post('/users', newUser);
        await auth.login(email, pass);
    },
    logout: () => {
        localStorage.removeItem('user');
        ui.resetLayout();
        location.hash = '#/login';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    },
    isAuthenticated: () => {
        const user = localStorage.getItem('user');
        if (!user) return false;
        try {
            const parsed = JSON.parse(user);
            if (!parsed.email || !parsed.role) throw new Error();
            return true;
        } catch {
            localStorage.removeItem('user');
            return false;
        }
    },
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
    hashText: async (text) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
};