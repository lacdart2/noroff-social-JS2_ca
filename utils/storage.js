/**
 * @fileoverview Storage utilities for localStorage
 * Provides helper functions to load and save data
 */

/**
 * Load an item from localStorage and parse it as JSON
 * @param {string} key - The localStorage key
 * @returns {any} - Parsed value or null
 */
export function load(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error("❌ Failed to load from localStorage:", error);
        return null;
    }
}

/**
 * Save a value to localStorage (as JSON string)
 * @param {string} key
 * @param {any} value
 */
export function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("❌ Failed to save to localStorage:", error);
    }
}

/**
 * Remove a key from localStorage
 * @param {string} key
 */
export function remove(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("❌ Failed to remove from localStorage:", error);
    }
}
