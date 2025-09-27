/**
 * @fileoverview Security helpers for preventing XSS.
 * Provides escapeHTML and safe rendering utilities.
 */

/**
 * Escape user input to prevent XSS.
 * Converts <script> and other HTML tags into plain text.
 *
 * @param {string} str - The string to escape
 * @returns {string} - Escaped safe string
 */
export function escapeHTML(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Create a safe element with escaped textContent.
 *
 * @param {string} tag - The HTML tag name (e.g. "p", "li")
 * @param {string} text - The user-provided text
 * @param {object} [attrs={}] - Optional attributes to set
 * @returns {HTMLElement}
 */
export function createSafeElement(tag, text, attrs = {}) {
    const el = document.createElement(tag);
    el.textContent = text || "";
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}
