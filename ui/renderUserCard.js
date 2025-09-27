/**
 * Render a user profile card (clickable whole card)
 * @param {HTMLElement} container
 * @param {{ name: string, avatar?: { url?: string, alt?: string }, bio?: string, _count?: { posts: number } }} user
 */
export function renderUserCard(container, user) {
  const avatarUrl =
    user.avatar?.url ||
    `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(user.name)}`;
  const postCount = user._count?.posts ?? 0;

  const card = document.createElement("div");
  card.className =
    "feed-card flex items-start gap-4 bg-gray-900 rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition ";

  card.innerHTML = `
    <img src="${avatarUrl}"
         alt="${user.avatar?.alt || user.name}"
         class="w-20 h-20 object-cover rounded-lg flex-shrink-0 ring-2 ring-brand-800" />
    <div class="flex-1">
      <div class="flex flex-col items-start justify-start mb-1 ">
        <span class="username text-sm font-medium text-gray-300 truncate-multiline">@${user.name}</span>
        <span class="text-xs text-gray-500 mt-2">${postCount} post${postCount !== 1 ? "s" : ""}</span>
      </div>
      <p class="text-gray-400 text-xs line-clamp-2 truncate-multiline">${user.bio || "No bio provided..."}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `/pages/profile/index.html?user=${user.name}`;
  });

  container.appendChild(card);
}
