/**
 * @fileoverview Edit Post Page - Handles loading, displaying, and updating a specific post.
 * 
 * - fetches post data by ID from the URL (`?id=postId`)
 * - pre-fills form fields with the current post content
 * - submits updated data using the `updatePost()` service (PUT request)
 * - redirects to the detail page after successful update
 * 
 * dependencies:
 * - getPostById, updatePost from `services/postsService.js`
 * - load from `utils/storage.js` (optional for future improvements)
 * - showToast from `components/toast.js` (UI feedback)
 * 
 * note:
 * - tags are entered as a comma-separated string and converted to array
 * - post ID is passed via URL parameters
 */


import { showToast } from "../../../ui/shared/showToast.js";
import { renderNavbar } from "../../../ui/navbar/navbar.js";
import { fetchPostById, updatePost } from "../../../services/postsService.js";

renderNavbar();

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
if (!postId) {
    showToast("Missing post ID in URL", "error")
    throw new Error("Missing post ID");
}

const form = document.querySelector("#updatePostForm");
const titleInput = document.querySelector("#title");
const bodyInput = document.querySelector("#body");
const mediaInput = document.querySelector("#media");
const tagsInput = document.querySelector("#tagInput");


async function loadPostData() {
    try {
        const post = await fetchPostById(postId);
        if (!post) showToast("Post not found", "error");

        titleInput.value = post.title || "";
        bodyInput.value = post.body || "";
        mediaInput.value = post.media?.url || "";
        tagsInput.value = post.tags?.join(", ") || "";

    } catch (error) {
        console.error("Error loading post:", error);
        showToast("Could not load post", "error");
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    const mediaUrl = mediaInput.value.trim();
    const tagsRaw = tagsInput.value.trim();

    if (!title || !body) {
        alert("Title and body are required");
        return;
    }

    const updatedPost = {
        title,
        body,
        ...(mediaUrl && { media: { url: mediaUrl } }),
        tags: tagsRaw
            ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean)
            : [],
    };
    try {
        await updatePost(postId, updatedPost);
        showToast("✅ Post updated", "success");
        console.log(updatePost)
        setTimeout(() => {
            window.location.href = `/pages/post/detail/index.html?id=${postId}`;
        }, 1000);

    } catch (error) {
        console.error("❌ Failed to update post:", error);
        showToast("❌ Could not update post", "error");
    }
});


document.addEventListener("DOMContentLoaded", loadPostData);

loadPostData();
