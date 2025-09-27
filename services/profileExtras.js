/**
 * @fileoverview profile extras service.
 * fetch posts, followers, and following for a profile.
 */

import { apiClient } from "../utils/apiHelpers.js";

/**
 * fetch posts, followers, and following for a profile.
 * @param {string} username
 * @returns {Promise<{posts: any[], followers: any[], following: any[]}>}
 */


export async function fetchProfileExtras(username) {
    try {
        const [posts, profile] = await Promise.all([
            apiClient(`/social/profiles/${encodeURIComponent(username)}/posts?_author=true&_comments=true&_reactions=true`),
            apiClient(`/social/profiles/${encodeURIComponent(username)}?_followers=true&_following=true`),
        ]);

        return {
            posts: posts ?? [],
            followers: profile.followers ?? [],
            following: profile.following ?? [],
        };
    } catch (error) {
        console.error("❌ Failed to load profile extras:", error);
        return {
            posts: [],
            followers: [],
            following: [],
        };
    }
}

// optional alias to avoid breakage if i imported the old name somewhere:
export { fetchProfileExtras as preloadProfileExtras };
