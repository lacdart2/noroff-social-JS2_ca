/**
 * @fileoverview Profile service.
 * Provides API calls for fetching, updating, following, and searching profiles.
 * Also includes utilities for building synthetic profile-like objects
 * (e.g. from engagement maps).
 */


import { apiClient } from "../utils/apiHelpers.js";

/**
 * Fetch a single profile by username.
 * @param {string} username - The username to fetch.
 * @returns {Promise<Object>} Profile object.
 */
export async function fetchProfile(username) {
    return apiClient(`/social/profiles/${username}`);
}


/**
 * update a profile by username.
 * @param {string} username - Profile username.
 * @param {Object} payload - Fields to update.
 * @returns {Promise<Object>} Updated profile.
 */
export async function updateProfile(username, payload) {
    return apiClient(`/social/profiles/${username}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

/**
 * Fetch posts by a specific user
 * @param {string} username
 * @returns {Promise<Array>} User's posts
 */
export async function fetchUserPosts(username) {
    return apiClient(`/social/profiles/${username}/posts?_author=true&_comments=true&_reactions=true`);
}

/**
 * Follow a user.
 * @param {string} username - The profile username to follow
 * @returns {Promise<Object>} - Follow response
 */
export async function followUser(username) {
    return apiClient(`/social/profiles/${username}/follow`, {
        method: "PUT",
    });
}

/**
 * Unfollow a user.
 * @param {string} username - The profile username to unfollow
 * @returns {Promise<Object>} - Unfollow response
 */
export async function unfollowUser(username) {
    return apiClient(`/social/profiles/${username}/unfollow`, {
        method: "PUT",
    });
}

/**
 * Fetch all user profiles with counts.
 * @returns {Promise<Array>} - Array of profile objects, each including _count (posts, followers, following)
 */

export function getAllProfiles() {
    return apiClient("/social/profiles?_count=true");

}

/**
 * Update a profile by username.
 * @param {string} username - Profile username
 * @param {Object} payload - Fields to update
 * @returns {Promise<Object>} - Updated profile
 */

export async function getProfileByName(username) {
    try {
        const res = await apiClient(`/social/profiles/${username}?_count=true`);
        return res?.data;
    } catch (e) {
        console.warn("Failed to fetch profile for:", username);
        return null;
    }
}

/**
 * Search for profiles by query string.
 * @param {string} query - Search string
 * @returns {Promise<Array>} - Array of matching profiles
 */

export function searchProfiles(query) {
    return apiClient(`/social/profiles/search?q=${encodeURIComponent(query)}`);
}


/**
* Build a "profile-like" object directly from engagementMap.
* @param {string} name
* @param {{comments: number, reactions: number}} stats
*/
export function buildProfileFromMap(name, stats) {
    return {
        name,
        avatar: {
            url: `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(name)}`,
            alt: `${name}'s avatar`,
        },
        comments: stats.comments || 0,
        reactions: stats.reactions || 0,
        bio: "Generated from engagement stats",
        _count: {
            posts: 0,
            followers: 0,
            following: 0,
        },
    };
}

