
import { fetchUserPosts } from "../profilePosts.js";
import { load, save } from "../../utils/storage.js";
import { checkFollowNotifications } from "./followNotifications.js";
/**
 * Check for new comments and reactions on the user's posts.
 * @param {string} username
 * @returns {Array} list of new notification objects
 */


export async function checkNotifications(username) {
    const seen = load("notifications") || {};
    const posts = await fetchUserPosts(username);
    const notes = [];

    for (const post of posts) {
        const postSeen = seen[post.id] || { comments: [], reactionsCount: {} };

        const newComments = (post.comments || []).filter(c => !postSeen.comments.includes(c.id));
        for (const c of newComments) {
            const commenter = c.owner?.name || c.author?.name || "Someone";
            notes.push({
                type: "comment",
                message: `💬 ${commenter} commented on your post`,
                user: commenter,
                postId: post.id
            });
        }

        const prevCounts = postSeen.reactionsCount || {};
        for (const r of (post.reactions || [])) {
            const prev = prevCounts[r.symbol] || 0;
            const curr = r.count || 0;
            if (curr > prev) {
                notes.push({
                    type: "reaction",
                    message: `❤️ ${r.symbol} reaction on your post`,
                    postId: post.id
                });
            }
        }
    }

    const followNotes = await checkFollowNotifications(username);
    const allNotes = [...notes, ...followNotes];

    save("unseenNotifications", allNotes.length);
    return allNotes;
}


/**
 * Render notification messages inside dropdown list.
 * @param {Array} notifications
 */

export function renderNotificationsList(notifications = []) {

    const list = document.getElementById("notificationList");
    const badge = document.getElementById("notificationCount");
    const bellIcon = document.getElementById("notificationBellIcon");
    if (!list || !badge || !bellIcon) return;

    list.classList.add("flex", "flex-col");

    list.innerHTML = "";

    if (notifications.length === 0) {
        list.innerHTML = `<div class="p-3 text-gray-500 text-center">No new notifications</div>`;
        badge.classList.add("hidden");
        bellIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-bell">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
      </svg>`;
        return;
    }

    bellIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="currentColor"
      class="icon icon-tabler icon-tabler-bell-filled">
      <path d="M10 2a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
      <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
    </svg>`;

    const frag = document.createDocumentFragment();

    notifications.forEach(note => {
        const item = document.createElement("div");
        item.classList.add(
            "notif-div",
            "p-2",
            "hover:bg-gray-100",
            "cursor-pointer",
            "border-b",
            "text-sm"
        );
        item.innerHTML = note.message;

        item.addEventListener("click", () => {
            setTimeout(() => {
                if (note.type === "comment" || note.type === "reaction") {
                    window.location.href = `/pages/post/detail/index.html?id=${note.postId}`;
                } else if (note.type === "follow") {
                    window.location.href = `/pages/profile/index.html?user=${note.user}`;
                }
            }, 100);
        });

        list.appendChild(item);
    });

    list.appendChild(frag);

    badge.textContent = notifications.length;
    badge.classList.remove("hidden");
}


export async function markAllAsSeen(username) {
    const posts = await fetchUserPosts(username);
    const seen = load("notifications") || {};

    for (const post of posts) {
        const commentIds = (post.comments || []).map(c => c.id);
        const reactionsCount = {};
        for (const r of (post.reactions || [])) {
            reactionsCount[r.symbol] = r.count || 0;
        }
        seen[post.id] = { comments: commentIds, reactionsCount };
    }

    save("notifications", seen);
}



