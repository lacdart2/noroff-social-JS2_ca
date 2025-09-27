/**
 * @fileoverview UI component: Trending user card
 * Used in the trending sidebar on the profiles page
 * Styled like a mini feed card
 */

/**
 * Render a trending user card
 * @param {HTMLElement} container
 * @param {{ name: string, avatar?: { url?: string, alt?: string }, comments?: number, reactions?: number }} user
 */
export function renderTrendingUser(container, user) {
  const avatarUrl = user.avatar?.url || `https://api.dicebear.com/9.x/identicon/svg?seed=${user.name}`;
  const card = document.createElement("div");
  card.className = "feed-card flex items-center justify-between bg-gray-900 rounded-lg p-3 shadow-md hover:shadow-lg transition cursor-pointer";

  card.innerHTML = `
    <div class="flex items-center gap-3">
      <img src="${avatarUrl}" alt="${user.name}" class="w-10 h-10 rounded-full object-cover ring-2 ring-brand-600" />
      <div>
        <span class="font-medium text-sm text-gray-300">@${user.name}</span>
        <p class="flex items-start justify-start gap-1 mt-1 text-xs text-gray-400">${user.comments} 
        <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-message"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8" /><path d="M8 13h6" /><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" /></svg>
        </p>
      </div>
    </div>
    <span class="flex flex-col items-center text-sm font-semibold text-brand-400">
    ${user.reactions} 
    <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg>
    </span>
  `;

  card.addEventListener("click", () => {
    window.location.href = `/pages/profile/index.html?user=${user.name}`;
  });

  container.appendChild(card);
}
