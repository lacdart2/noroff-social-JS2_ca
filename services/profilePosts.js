import { apiClient } from "../utils/apiHelpers.js";

/**
 * fetch posts by a specific user
 * @param {string} username
 * @returns {Promise<Array>} User's posts
 */
export async function fetchUserPosts(username) {
    return apiClient(`/social/profiles/${username}/posts?_author=true&_comments=true&_reactions=true`);
}
