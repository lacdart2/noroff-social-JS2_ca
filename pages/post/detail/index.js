
/**
 * displays a single post with full details, comments, and reactions.
 */

import { apiClient } from "../../../utils/apiHelpers.js";
import { showToast } from "../../../ui/shared/showToast.js";
import { renderNavbar } from "../../../ui/navbar/navbar.js";
import { renderBatteryLoader, showLoader, hideLoader } from "../../../ui/shared/batteryLoader.js";
import { deletePostById } from "../../../services/postsService.js";
import { showModal } from "../../../ui/shared/modal.js";
import { escapeHTML } from "../../../utils/security.js";
import { setupReactionPicker } from "../../../ui/reactionPicker.js";
import { setupEmojiPicker } from "../../../ui/emojiPicker.js";
import { requireAuth } from "../../../utils/authGuard.js";
renderNavbar();
requireAuth();
const postContainer = document.getElementById("postContainer");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  showToast("⛔ No post ID found in URL", "error");
  throw new Error("Missing post ID");
}

const accessToken = localStorage.getItem("accessToken");
if (!accessToken) {
  window.location.href = "/pages/auth/login/index.html";
}

let currentUser;
try {
  currentUser = JSON.parse(localStorage.getItem("user"));
} catch {
  currentUser = null;
}

async function fetchPostDetails() {
  renderBatteryLoader();
  showLoader();
  try {
    const data = await apiClient(`/social/posts/${postId}?_author=true&_comments=true&_reactions=true`);

    hideLoader();
    renderPost(data);
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    showToast("❌ Could not load post", "error");
  }
}
document.addEventListener("DOMContentLoaded", fetchPostDetails);

function renderPost(post) {

  const {
    title,
    body,
    media,
    created,
    author,
    comments = [],
    reactions = [],
  } = post;
  console.log("Post counts:", post._count);

  postContainer.innerHTML = `
<div class="post-details-card grid grid-cols-1 md:grid-cols-3 pd-1 md:p-2 gap-6 ">
  <div class="post-details-card-left md:col-span-2 space-y-6  ">
    <div class="card-details-content relative text-gray-100 p-6 rounded-xl shadow-md ">
      <h2 class="text-2xl font-bold">${escapeHTML(title)}</h2>
      <p class="text-gray-300 mb-2">${escapeHTML(body)}</p>

      ${media?.url ? `
        <div class="rounded ">
          <img src="${escapeHTML(media.url)}" alt="${escapeHTML(media.alt)}"
            class="post-card-details-img w-full shadow-lg object-cover max-h-96  shadow" />
        </div>` : ""}

      <p class="text-sm text-gray-400">
        By: <a href="/pages/profile/index.html?user=${escapeHTML(author.name)}"
          class="text-blue-400 hover:underline font-medium">
          ${escapeHTML(author.name)}</a> 
        | <span>${new Date(created).toLocaleString()}</span>
      </p>

      <div class="reaction-counts-container flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-300">
        <span>
         <svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg>
        ${reactions.length}</span>
        <span>
        <svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-message"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8" /><path d="M8 13h6" /><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" /></svg>
        ${comments.length}</span>
      </div>

      <div class="post-reactions flex items-center gap-2 mt-4">
        <button id="reactionBtn" class="px-3 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 ring-1 ring-gray-600">
               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
        </button>
       <div id="emojiPicker" class="hidden bg-gray-400 flex gap-2 rounded-full bg-gray-800 px-3 py-1">
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">👍</span>
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">👎</span>
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">❤️</span>
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">🔥</span>
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">🙂</span>
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">😂</span>
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">🎉</span>
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">👀</span>
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">😢</span>
        <span class="emoji cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-full">🙌</span>
      </div>

      </div>

     <form id="commentForm" class="mt-4 flex flex-col sm:flex-row gap-2">
      <div class="relative flex-1 flex gap-2">
      <input type="text" id="commentInput" placeholder="Add a comment..." required
      class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400  focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500" />
      <button type="button" id="commentEmojiBtn"
      class="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
      😀
    </button>

        <div id="commentEmojiPicker"
            class="hidden absolute bottom-full mb-2 right-0 flex gap-2 bg-gray-800 p-2 rounded shadow">
          <span class="emoji cursor-pointer px-2">👍</span>
          <span class="emoji cursor-pointer px-2">😂</span>
          <span class="emoji cursor-pointer px-2">🙂</span>
          <span class="emoji cursor-pointer px-2">❤️</span>
          <span class="emoji cursor-pointer px-2">🔥</span>
          <span class="emoji cursor-pointer px-2">🎉</span>
        </div>
      </div>

      <button type="submit"
        class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-800 transition">
        Comment
      </button>
    </form>

    </div>
  </div>

 <div class="post-details-card-right md:col-span-1 self-start mt-1 md:mt-0 bg-gray-800 rounded-lg p-4">
    <h3 class="font-semibold mb-2 flex gap-1 text-gray-800">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-message">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M8 9h8" />
        <path d="M8 13h6" />
        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
      </svg>
      Comments (${comments.length})
    </h3>
          <ul class="space-y-2">
          ${(() => {
      const sorted = [...comments].sort(
        (a, b) => new Date(a.created) - new Date(b.created)
      );

      const childrenMap = {};
      sorted.forEach(c => {
        if (c.replyToId) {
          childrenMap[c.replyToId] = childrenMap[c.replyToId] || [];
          childrenMap[c.replyToId].push(c);
        }
      });

      function renderComment(c, depth = 0) {
        const isMyComment = currentUser?.name?.toLowerCase() === c.author.name?.toLowerCase();

        return `
                <li class="p-0 ${depth > 0 ? "ml-6 border-l border-gray-600 pl-3" : ""}" data-comment-id="${c.id}">
                  <div class="rounded bg-gray-${depth > 0 ? "800" : "700"} border border-gray-700 text-gray-100">
                    <div class="flex items-start justify-between gap-3 p-2">
                      <div class="flex-1">
                        <a href="/pages/profile/index.html?user=${escapeHTML(c.author.name)}"
                          class="text-purple-400 hover:underline font-light text-medium capitalize">
                          ${escapeHTML(c.author.name)}
                        </a>: ${escapeHTML(c.body)}
                        <button class="ml-2 transition text-xs text-purple-300 hover:underline"
                                data-action="reply-comment"
                                data-comment-id="${c.id}">
                          Reply
                        </button>
                      </div>
                      ${isMyComment ? `
                        <button class="deleteCommentBtn text-gray-400 hover:text-red-500 transition self-start mt-2"
                                title="Delete comment"
                                data-action="delete-comment"
                                data-comment-id="${c.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="18" height="18"
                                  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none">
                                <path stroke="none" d="M0 0h24v24H0z"/>
                                <path d="M4 7h16" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3h6v3" />
                              </svg>
                        </button>
                      ` : ""}
                    </div>
                    <div class="px-2 pb-2" data-reply-slot></div>
                  </div>
                  ${childrenMap[c.id]
            ? `<ul class="mt-2 space-y-2">
                        ${childrenMap[c.id].map(child => renderComment(child, depth + 1)).join("")}
                      </ul>`
            : ""}
                </li>
              `;
      }

      return sorted
        .filter(c => !c.replyToId)
        .map(c => renderComment(c))
        .join("");
    })()}
        </ul>

  </div>
</div>
`;


  setupReactionPicker(postId);
  setupEmojiPicker("commentInput", "commentEmojiBtn", "commentEmojiPicker");


  const commentForm = document.getElementById("commentForm");
  const commentInput = document.getElementById("commentInput");


  if (currentUser?.name?.toLowerCase() === author.name?.toLowerCase()) {
    const actionContainer = document.createElement("div");
    actionContainer.className = "custom-container absolute top-6 right-6 flex gap-2";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="20" height="20"
      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
      <title>Edit Post</title>
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
      <path d="M16 5l3 3" />
    </svg>
  `;
    editBtn.className = "edit-btn ring-1 ring-gray-600 hover:ring-gray-600 text-white p-2 rounded-full shadow-lg transition";

    editBtn.addEventListener("click", () => {
      window.location.href = `/pages/post/update/index.html?id=${postId}`;
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="20" height="20"
      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
      <title>Delete Post</title>
      <path stroke="none" d="M0 0h24v24H0z"/>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3h6v3" />
    </svg>
  `;
    deleteBtn.className = "delete-btn bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition";


    deleteBtn.addEventListener("click", () => {
      showModal({
        message: "Are you sure you want to delete this post?",
        onConfirm: async () => {
          try {
            await deletePostById(postId);
            showToast("🗑️ Post deleted.", "success");
            setTimeout(() => window.location.href = "/pages/posts/index.html", 1000);
          } catch (err) {
            console.error("❌ Failed to delete post:", err);
            showToast("❌ Could not delete post", "error");
          }
        },
      });
    });

    actionContainer.appendChild(editBtn);
    actionContainer.appendChild(deleteBtn);
    postContainer.querySelector(".relative").appendChild(actionContainer);
  }

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = commentInput.value.trim();
    if (!body) return;

    try {
      await apiClient(`/social/posts/${postId}/comment`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });

      showToast("✅ Comment posted", "success");
      commentInput.value = "";
      fetchPostDetails();
    } catch (err) {
      console.error("❌ Error commenting:", err);
      showToast("❌ Could not post comment", "error");
    }
  });

}
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action='reply-comment']");
  if (!btn) return;

  const parentId = btn.getAttribute("data-comment-id");
  const parentLi = btn.closest("li[data-comment-id]");
  if (!parentLi) return;

  const slot = parentLi.querySelector("[data-reply-slot]");
  if (!slot || parentLi.querySelector("form.reply-form")) return;

  const form = document.createElement("form");
  form.className = "reply-form mt-2 w-full";

  form.innerHTML = `
 <textarea id="replyInput-${parentId}" 
  class="w-full px-3 py-2 bg-gray-800 border text-sm border-gray-700 rounded text-white placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
  placeholder="Write a reply..."></textarea>

  <div class="relative flex gap-2 items-center mt-2">
    <button type="button" id="replyEmojiBtn-${parentId}" 
            class="px-2 py-1 bg-gray-700 text-white rounded">😀</button>
            <div id="replyEmojiPicker-${parentId}" 
                class="absolute hidden flex gap-2 bg-gray-800 p-2 rounded shadow">
              <span class="emoji cursor-pointer">👍</span>
              <span class="emoji cursor-pointer">😂</span>
              <span class="emoji cursor-pointer">🙂</span>

              <span class="emoji cursor-pointer">❤️</span>
              <span class="emoji cursor-pointer">🔥</span>
              <span class="emoji cursor-pointer">🎉</span>
              <span class="emoji cursor-pointer">👀</span>
            <span class="emoji cursor-pointer">😢</span>
            <span class="emoji cursor-pointer">🙌</span>
            </div>
  </div>
  <button type="submit" class="mt-2 bg-purple-800 text-white px-3 py-1 rounded text-xs hover:bg-purple-700">
    Reply
  </button>
`;


  const textarea = form.querySelector("textarea");
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });


  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const textarea = form.querySelector("textarea");

    const body = textarea.value.trim();
    if (!body) return;

    try {
      const res = await apiClient(`/social/posts/${postId}/comment`, {
        method: "POST",
        body: JSON.stringify({ body, replyToId: Number(parentId) }),
      });
      showToast("✅ Reply added", "success");
      fetchPostDetails();
    } catch (err) {
      console.error("❌ Error replying to comment:", err);
      showToast("❌ Could not reply", "error");
    }
  });

  slot.innerHTML = "";
  slot.appendChild(form);

  setupEmojiPicker(
    `replyInput-${parentId}`,
    `replyEmojiBtn-${parentId}`,
    `replyEmojiPicker-${parentId}`
  );
});


document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-action='delete-comment']");
  if (!btn) return;

  const commentId = btn.getAttribute("data-comment-id");
  if (!commentId || !postId) return;

  showModal({
    message: "🗑️ Are you sure you want to delete this comment?",
    onConfirm: async () => {
      try {
        await apiClient(`/social/posts/${postId}/comment/${commentId}`, {
          method: "DELETE",
        });

        showToast("🗑️ Comment deleted", "success");
        const li = btn.closest("li[data-comment-id]");
        if (li) li.remove();

      } catch (err) {
        console.error("❌ Error deleting comment:", err);
        showToast("❌ Failed to delete comment", "error");
      }
    },
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (postId) {
    setupReactionPicker(postId);
  }
});


