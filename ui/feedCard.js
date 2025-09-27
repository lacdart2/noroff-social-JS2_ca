/**
 * @fileoverview UI component: Feed preview card
 * Used in the feed page highlights grid.
 */

/**
 * Create a feed preview card element.
 * @param {Object} post - Post object from API
 * @returns {HTMLElement}
 */

export function createFeedCard(post) {
  const card = document.createElement("div");
  card.className =
    "feed-card flex items-start gap-4 bg-gray-900 rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition";

  card.innerHTML = `
    ${post.media?.url
      ? `<img src="${post.media.url}" 
                 alt="${post.media.alt || "post media"}"
                 class="w-20 h-20 object-cover rounded-lg flex-shrink-0">`
      : `<div class="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">No Img</div>`
    }

    <div class="flex-1">
      <div class="flex items-center justify-between mb-1 gap-2">
        <span class="text-sm font-medium text-gray-300">${post.author?.name || "Unknown"}</span>
        <span class="text-xs text-gray-500">${new Date(post.created).toLocaleDateString()}</span>
      </div>

      <p class="text-gray-400 text-sm mb-2 line-clamp-2">${post.body?.slice(0, 40) || "No content..."}</p>

      <div class=" flex flex-wrap gap-1">
        ${post.tags && post.tags.length > 0
      ? post.tags.map(tag => `<span class="bg-purple-800 text-xs text-white px-2 py-0.5 rounded-full">#${tag}</span>`).join("")
      : `<span class="text-xs text-gray-500">#untagged</span>`
    }
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `/pages/post/detail/index.html?id=${post.id}`;
  });

  return card;
}
