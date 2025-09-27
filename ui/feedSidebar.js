import { getAllProfiles } from "../services/profileServices.js";

/**
 * Render the latest posts (top 5).
 * @param {Array} posts - Array of post objects.
 */
export function renderLatestPosts(posts) {
    const latestContainer = document.getElementById("latestPosts");
    latestContainer.innerHTML = `
        <h2 class="flex gap-1 text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-planet"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18.816 13.58c2.292 2.138 3.546 4 3.092 4.9c-.745 1.46 -5.783 -.259 -11.255 -3.838c-5.47 -3.579 -9.304 -7.664 -8.56 -9.123c.464 -.91 2.926 -.444 5.803 .805" /><path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /></svg>
        Latest Posts</h2>
    `;

    posts.slice(0, 5).forEach(post => {
        const latestPost = document.createElement("div");
        latestPost.className = "flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-700 rounded p-2 transition";
        latestPost.innerHTML = `
        <img src="${post.media?.url || 'https://www.pexels.com/nb-no/bilde/29506610/'} "
        class="w-12 h-12 object-cover rounded" alt = "" >
            <div>
                <p class="font-medium text-sm truncate">${post.title}</p>
                <p class="text-xs text-gray-400">${post.author.name}</p>
            </div>
        `;
        latestContainer.appendChild(latestPost);

        latestPost.addEventListener("click", () => {
            window.location.href = `/ pages / post / detail / index.html ? id = ${post.id} `;
        });
        latestPost.classList.add();
    });

}


/**
 * Render trending tags (top 8 by frequency).
 * @param {Array} posts - Array of post objects.
 */
export function renderTrendingTags(posts) {
    const trendingContainer = document.getElementById("trendingTags");
    trendingContainer.innerHTML = ` <h2 class="flex gap-1 text-lg font-semibold mb-3 border-b border-gray-700 pb-2" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-hash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 9l14 0" /><path d="M5 15l14 0" /><path d="M11 4l-4 16" /><path d="M17 4l-4 16" /></svg>
                Trending Tags</h2>`;

    const tagCounts = {};
    posts.forEach(p => {
        (p.tags || []).forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    const trending = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    if (trending.length === 0) {
        trendingContainer.innerHTML = `< p class="text-gray-400 text-sm" > No tags yet.</ > `;
        return;
    }

    trending.forEach(([tag]) => {
        const btn = document.createElement("button");
        btn.className =
            "inline-block bg-purple-800 text-white text-xs px-3 py-1 rounded-full mr-2 mb-2 hover:bg-blue-700 transition";
        btn.innerText = `#${tag} `;
        trendingContainer.appendChild(btn);
    });
}

/**
 * Render suggested users (5 profiles).
 */

export async function renderPeopleYouMayKnow(containerId = "peopleYouMayKnow") {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const profiles = await getAllProfiles();

        const currentUser = JSON.parse(localStorage.getItem("user"))?.name;
        const suggestions = profiles.filter(p => p.name !== currentUser).slice(0, 5);

        if (!suggestions.length) {
            container.innerHTML = `
            <p class="text-gray-400 text-sm" > No suggestions right now.</p >
                `;
            return;
        }

        container.innerHTML = `
                <h2 class="flex items-center gap-2 text-lg font-semibold mb-3 border-b border-gray-700 pb-2" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-users"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
        People You May Know
      </h2 >
            <ul class="space-y-3">
                ${suggestions.map(user => `
          <li class="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded transition"
              onclick="window.location.href='/pages/profile/index.html?user=${user.name}'">
            <img src="${user.avatar?.url || "https://placehold.co/40x40"}" 
                 alt="${user.avatar?.alt || user.name}" 
                 class="w-10 h-10 rounded-full border border-gray-600" />
            <span class="font-medium">${user.name}</span>
          </li>
        `).join("")}
            </ul>
        `;
    } catch (err) {
        console.error("❌ Failed to fetch people you may know:", err);
        container.innerHTML = `< p class="text-red-500" > Error loading suggestions.</ > `;
    }
}

