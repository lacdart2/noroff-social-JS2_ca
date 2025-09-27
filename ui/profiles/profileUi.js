/**
 * @fileoverview UI rendering helpers for profile previews.
 */

/**
 * Toggle visibility between posts, followers, following previews
 * @param {string} idToShow - The section to show
 */
/* export function togglePreview(idToShow) {
  const all = ["previewPosts", "previewFollowers", "previewFollowing"];
  all.forEach(id => {
    document.getElementById(id).classList.toggle("hidden", id !== idToShow);
  });
} */
export function togglePreview(idToShow) {
  const all = ["previewPosts", "previewFollowers", "previewFollowing"];

  all.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (id === idToShow) {
      // Toggle instead of always showing
      el.classList.toggle("hidden");
    } else {
      el.classList.add("hidden"); // Always hide the others
    }
  });
}

/**
 * Render posts preview
 */
export function renderPostsPreview(posts) {
  const container = document.getElementById("previewPosts");
  container.innerHTML = posts.slice(0, 3).map(post => `
    <div class="bg-white rounded p-2 shadow mb-2">
      <h3 class="font-semibold">${post.title}</h3>
      <p class="text-sm text-gray-600">${post.body?.slice(0, 60) || "No content"}...</p>
      <a href="/pages/post/detail/index.html?id=${post.id}" class="text-blue-500 text-xs">View more</a>
    </div>
  `).join("") || "<p>No posts yet.</p>";
}

export function renderFollowersPreview(followers) {
  const container = document.getElementById("previewFollowers");
  container.innerHTML = followers.map(f => `
    <div class="bg-white rounded p-2 shadow mb-2 flex items-center gap-2">
      <img src="${f.avatar?.url || "https://placekitten.com/40/40"}" class="w-8 h-8 rounded-full" />
      <a href="/pages/profile/index.html?user=${f.name}" class="font-semibold">@${f.name}</a>
    </div>
  `).join("") || "<p>No followers yet.</p>";
}

export function renderFollowingPreview(following) {
  const container = document.getElementById("previewFollowing");
  container.innerHTML = following.map(f => `
    <div class="bg-white rounded p-2 shadow mb-2 flex items-center gap-2">
      <img src="${f.avatar?.url || "https://placekitten.com/40/40"}" class="w-8 h-8 rounded-full" />
      <a href="/pages/profile/index.html?user=${f.name}" class="font-semibold">@${f.name}</a>
    </div>
  `).join("") || "<p>You are not following anyone.</p>";
}
