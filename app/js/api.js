// public/js/api.js
const BASE_URL = 'http://localhost:3000';

/**
 * API module for making HTTP requests to the backend.
 * Provides methods for GET, POST, PUT, PATCH, and DELETE requests.
 * @param {string} method - HTTP method to use (GET, POST, etc.)
 * @param {string} url - The endpoint URL
 * @param {Object|null} body - The request body for POST/PUT/PATCH requests
 * @returns {Promise<Object>} - The response data as a JSON object
 * @throws {Error} - If the HTTP request fails or returns an error status
 */
async function httpRequest(method, url, body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null,
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`❌ HTTP request error [${method}] ${url}:`, error);
        throw error;
    }
}

/**
 * Provides methods to interact with the API.
 * Each method corresponds to an HTTP verb and can be used to make requests to the backend.
 */
export const api = {
    get: async (param) => httpRequest('GET', `${BASE_URL}${param}`),
    post: async (param, data) => httpRequest('POST', `${BASE_URL}${param}`, data),
    put: async (param, data) => httpRequest('PUT', `${BASE_URL}${param}`, data),
    patch: async (param, data) => httpRequest('PATCH', `${BASE_URL}${param}`, data),
    delete: async (param) => httpRequest('DELETE', `${BASE_URL}${param}`),
};
