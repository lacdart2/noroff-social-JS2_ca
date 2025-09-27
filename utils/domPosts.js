
export function renderPosts(posts, container) {
  if (!container) {
    console.warn("⚠️ postsContainer not found in DOM.");
    return;
  }

  container.innerHTML = "";
  if (!posts.length) {
    container.innerHTML = "<p class='text-center text-gray-400'>No posts to show.</p>";
    return;
  }

  posts.forEach((post) => {
    const {
      title,
      body,
      media,
      _count,
      created,
      author: { name, avatar },
    } = post;

    const card = document.createElement("div");
    card.className =
      "post-card bg-gray-900 text-gray-200 shadow-md rounded-xl  p-5 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition";

    card.innerHTML = `
      <!-- Header -->
      <div class="flex items-center gap-3">
        <img src="${avatar?.url || 'https://placehold.co/40x40'}" 
             alt="${avatar?.alt || 'avatar'}" 
             class="w-10 h-10 rounded-full border border-gray-700" />
        <a href="/pages/profile/index.html?user=${name}" 
           class="font-semibold text-purple-400 hover:underline">
          ${name}
        </a>  
      </div>

      <!-- Title & Body -->
      <h2 class="text-lg font-bold text-white">${title}</h2>
      <p class="text-sm text-gray-400 truncate-multiline">${body}</p>

      <!-- Media -->
      ${media?.url
        ? `<img src="${media.url}" 
                 alt="${media.alt || "post image"}" 
                 class="post-card-img rounded-lg shadow-lg h-48 w-full object-cover " />`
        : ""
      }

      <!-- Stats -->
      <div class="post-stats flex justify-between text-xs text-gray-500 mt-3">
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" 
               viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
               class="icon icon-tabler icon-tabler-message">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M8 9h8" /><path d="M8 13h6" />
            <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
          </svg>
          ${_count.comments}
        </div>
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" 
               viewBox="0 0 24 24" fill="currentColor" 
               class="icon icon-tabler icon-tabler-heart-filled text-red-500">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
          </svg>
          ${_count.reactions}
        </div>
        <div>
          ${new Date(created).toLocaleDateString()}
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `../post/detail/index.html?id=${post.id}`;
    });

    container.appendChild(card);
  });
}
