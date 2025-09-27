
/**
 * Generic API client to handle GET/POST/PUT/DELETE requests to the Noroff Social API.
 * Automatically includes API key and access token in headers.
 * @param {string} endpoint - Relative API endpoint (e.g. /social/posts)
 * @param {Object} [options={}] - Optional fetch config: method, body, etc.
 * @returns {Promise<Object>} JSON response data
 */

import { load } from "./storage.js";
import { API_KEY } from "./constants.js";
export function buildHeaders() {
    const token = load("accessToken");

    const headers = {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}



/* 
export async function apiClient(endpoint, options = {}) {
    const headers = buildHeaders();
    const config = {
        method: options.method || "GET",
        headers,
    };

    if (options.body) {
        config.body = options.body;
    }

    const BASE_URL = "https://v2.api.noroff.dev";
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    let data;
    const text = await response.text();
    if (text && response.status !== 204) {
        data = JSON.parse(text);
    }

    if (!response.ok) {
        throw new Error(data?.errors?.[0]?.message || "API request failed");
    }

    return data?.data || data;
} */

export async function apiClient(endpoint, options = {}) {
    const BASE_URL = "https://v2.api.noroff.dev";
    const headers = {
        "Content-Type": "application/json",
        ...buildHeaders(),
        ...(options.headers || {}),
    };

    const config = {
        method: options.method || "GET",
        headers,
        ...options,
    };

    if (config.body && typeof config.body === "object") {
        config.body = JSON.stringify(config.body);
    }


    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    let data;
    const text = await response.text();
    if (text && response.status !== 204) {
        data = JSON.parse(text);
    }

    if (!response.ok) {
        throw new Error(data?.errors?.[0]?.message || "API request failed");
    }

    return data?.data || data;
}

