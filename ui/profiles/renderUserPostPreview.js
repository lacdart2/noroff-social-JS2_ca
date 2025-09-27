import { BASE_URL } from "../../utils/constants.js";

export async function renderUserPostPreview(username) {
  const res = await fetch(`${BASE_URL}/social/profiles/${username}/posts`);
  const { data } = await res.json();

  const previewHTML = data.slice(0, 3).map(post => `
    <div class="bg-white rounded shadow p-4">
      <h3 class="font-semibold text-lg">${post.title}</h3>
      ${post.media?.url ? `<img src="${post.media.url}" class="my-2 rounded w-full max-h-48 object-cover" />` : ""}
      <p class="text-gray-600 text-sm">${post.body.slice(0, 80)}...</p>
      <a href="/pages/post/detail/index.html?id=${post.id}" class="text-blue-600 text-sm mt-2 inline-block">View Post →</a>
    </div>
  `).join("");

  document.getElementById("profileContentPreview").innerHTML = `
    <h2 class="text-xl font-bold mb-2">📝 Recent Posts</h2>
    ${previewHTML}
    <a href="/pages/posts/mine/index.html" class="text-blue-600 mt-4 inline-block">→ View All My Posts</a>
  `;
}
