/**
 * @fileoverview Checks for new followers and returns notification objects.
 */

import { apiClient } from "../../utils/apiHelpers.js";
import { load, save } from "../../utils/storage.js";

/**
 * Check if any new users have followed the current user since last check.
 * @param {string} username - Your current logged-in username
 * @returns {Array} - List of new follower notification objects
 */
export async function checkFollowNotifications(username) {
    const seen = load("seenFollowers") || [];

    const profile = await apiClient(`/social/profiles/${username}?_followers=true`);
    const currentFollowers = profile.followers?.map(f => f.name) || [];

    const newFollowers = currentFollowers.filter(name => !seen.includes(name));

    save("seenFollowers", currentFollowers);

    return newFollowers.map(name => ({
        type: "follow",
        user: name,
        message: `🎉 ${name} started following you`,
    }));
}
