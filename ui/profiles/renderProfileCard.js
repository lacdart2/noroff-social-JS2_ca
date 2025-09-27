/**
 * @fileoverview UI component to render a single user profile card.
 */

/**
 * Creates and returns a profile card element.
 * @param {Object} profile - The profile data object.
 * @param {string} profile.name - The user's name.
 * @param {string} [profile.email] - The user's email.
 * @param {Object} [profile.avatar] - Optional avatar object.
 * @returns {HTMLElement} A div element with profile card layout.
 */
export function renderProfileCard(profile) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-lg shadow p-4 hover:bg-gray-100 transition";

  card.innerHTML = `
    <div class="flex items-center gap-4">
      <img src="${profile.avatar?.url || 'https://placehold.co/60'}"
           alt="${profile.avatar?.alt || profile.name}"
           class="w-16 h-16 rounded-full object-cover border" />
      <div>
        <h2 class="font-semibold text-lg">${profile.name}</h2>
        <p class="text-sm text-gray-600">${profile.email || "—"}</p>
        <a href="/pages/profile/index.html?user=${profile.name}"
           class="text-blue-600 hover:underline text-sm mt-1 inline-block">
          View Profile
        </a>
      </div>
    </div>
  `;

  return card;
}
