/**
 * @fileoverview Profile service.
 * Provides API calls for fetching, updating, and listing profiles.
 */

import { apiClient } from "../utils/apiHelpers.js";
/**
 * Fetches all public user profiles.
 * @returns {Promise<Array>} Array of profile objects.
 */
/* export async function getAllProfiles() {
    return apiClient("/social/profiles");
} */


/* export async function fetchProfile(username, token) {
    const res = await fetch(`${BASE_URL}/social/profiles/${username}`, {
        headers: buildHeaders(token),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.errors?.[0]?.message || "Failed to fetch profile");
    return data.data;
} */

/**
 * Fetch a single profile by username.
 * @param {string} username - The username to fetch.
 * @returns {Promise<Object>} Profile object.
 */
export async function fetchProfile(username) {
    return apiClient(`/social/profiles/${username}`);
}
/**
 * Update a profile by username
 * @param {string} username - The profile username
 * @param {string} token - Access token
 * @param {Object} payload - Fields to update
 * @returns {Promise<Object>} Updated profile
 */
/* export async function updateProfile(username, token, payload) {
    const res = await fetch(`${BASE_URL}/social/profiles/${username}`, {
        method: "PUT",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.errors?.[0]?.message || "Failed to update profile");
    return data.data;
} */
/* export async function updateProfile(username, payload) {
    return apiClient(`/social/profiles/${username}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}
 */
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

export async function followUser(username) {
    return apiClient(`/social/profiles/${username}/follow`, {
        method: "PUT",
    });
}

/**
 * Unfollow a user.
 */
export async function unfollowUser(username) {
    return apiClient(`/social/profiles/${username}/unfollow`, {
        method: "PUT",
    });
}
/**
 * @returns {Promise<Array>}
 */
export function getAllProfiles() {
    return apiClient("/social/profiles?_count=true");

}
export async function getProfileByName(username) {
    try {
        const res = await apiClient(`/social/profiles/${username}?_count=true`);
        return res?.data;
    } catch (e) {
        console.warn("Failed to fetch profile for:", username);
        return null;
    }
}

/* export function getAllProfiles() {
    const res = await apiClient("/social/profiles?_count=true");
    return res?.data || [];

} */

/**
 * @param {string} query
 * @returns {Promise<Array>}
 */
export function searchProfiles(query) {
    return apiClient(`/social/profiles/search?q=${encodeURIComponent(query)}`);
}

/**
 * Build a "profile-like" object directly from engagementMap.
 * @param {string} name
 * @param {{comments: number, reactions: number}} stats
 */
/* export function buildProfileFromMap(name, stats) {
    return {
        name,
        avatar: {
            url: `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(name)}`,
            alt: `${name}'s avatar`
        },
        comments: stats.comments,
        reactions: stats.reactions,
        bio: "Generated from engagement stats",
        _count: {
            posts: 0,
            followers: 0,
            following: 0
        }
    };
} */
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

