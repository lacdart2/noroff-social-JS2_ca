
/**
 * Toggle visibility between posts, followers, following previews
 * @param {string} idToShow - The section to show
 */

export function togglePreview(idToShow) {
  const all = ["previewPosts", "previewFollowers", "previewFollowing"];

  all.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (id === idToShow) {
      el.classList.toggle("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
}


export function renderPostsPreview(posts) {
  const container = document.getElementById("previewPosts");

  if (!posts.length) {
    container.innerHTML = "<p class='text-gray-400'>No posts yet.</p>";
    return;
  }

  container.innerHTML = posts.map(post => `
    <div class="bg-gray-800 rounded-lg p-3 shadow mb-2 hover:bg-gray-700 transition">
      <h3 class="font-semibold text-purple-400">${post.title}</h3>
      <p class="text-sm text-gray-300">${post.body?.slice(0, 60) || "No content"}...</p>
      <a href="/pages/post/detail/index.html?id=${post.id}" 
         class="text-xs text-purple-400 hover:underline transition">View more</a>
    </div>
  `).join("");
}
export function renderFollowersPreview(followers) {
  const container = document.getElementById("previewFollowers");

  if (!followers.length) {
    container.innerHTML = "<p class='text-gray-400'>No followers yet.</p>";
    return;
  }

  container.innerHTML = followers.map(f => `
    <div class="bg-gray-800 rounded-lg p-2 shadow mb-2 flex items-center gap-3 hover:bg-gray-700 transition">
      <img src="${f.avatar?.url || "https://placekitten.com/40/40"}" 
           alt="${f.avatar?.alt || f.name}" 
           class="w-8 h-8 rounded-full border border-gray-600" />
      <a href="/pages/profile/index.html?user=${f.name}" 
         class="font-medium text-purple-400 hover:text-purple-600 transition">@${f.name}</a>
    </div>
  `).join("");
}

export function renderFollowingPreview(following) {
  const container = document.getElementById("previewFollowing");

  if (!following.length) {
    container.innerHTML = "<p class='text-gray-400'>You are not following anyone.</p>";
    return;
  }

  container.innerHTML = following.map(f => `
    <div class="bg-gray-800 rounded-lg p-2 shadow mb-2 flex items-center gap-3 hover:bg-gray-700 transition">
      <img src="${f.avatar?.url || "https://placekitten.com/40/40"}" 
           alt="${f.avatar?.alt || f.name}" 
           class="w-8 h-8 rounded-full border border-gray-600" />
      <a href="/pages/profile/index.html?user=${f.name}" 
         class="font-medium text-purple-400 hover:text-purple-600 transition">@${f.name}</a>
    </div>
  `).join("");
}
