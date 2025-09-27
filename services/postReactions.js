/**
 * @fileoverview service for handling emoji reactions on posts.
 */
import { apiClient } from "../utils/apiHelpers.js";

/**
 * react to a post with an emoji.
 * always sends an empty JSON body (required by Noroff API for PUT).
 *
 * @param {number|string} postId - The ID of the post to react to.
 * @param {string} symbol - Emoji symbol (👍, 👎, ❤️, etc.)
 * @returns {Promise<any>} API response object
 */
export async function reactToPost(postId, symbol) {
    try {
        const endpoint = `/social/posts/${postId}/react/${encodeURIComponent(symbol)}`;
        const response = await apiClient(endpoint, {
            method: "PUT",
            body: {},
        });

        return response;
    } catch (error) {
        console.error(`❌ Reaction failed: ${symbol}`, error);
        throw error;
    }
}
