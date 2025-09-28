/**
 * @fileoverview Create Post Page Logic
 * Handles form submission to create a new post using Noroff Social API.
 * Injects the navbar and handles user feedback.
 *
 * Expected HTML:
 * - Form with ID #createPostForm
 * - Message container with ID #msg
 * - Navbar container with ID #navbarContainer
 */

import { load } from "../../../utils/storage.js";
import { showToast } from "../../../ui//shared/showToast.js";
import { apiClient } from "../../../utils/apiHelpers.js";
import { renderNavbar } from "../../../ui/navbar/navbar.js";
import { requireAuth } from "../../../utils/authGuard.js";

renderNavbar()
requireAuth();
const form = document.querySelector("#createPostForm");

form.addEventListener("submit", handleFormSubmit);

/**
 * handles form submission to create a new post.
 * @param {SubmitEvent} event
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    const title = form.title.value.trim();
    const body = form.body.value.trim();
    const media = form.media.value.trim();

    if (!title || !body) {
        showToast("⚠️ Title and Body are required.", "error");
        return;
    }

    const token = load("accessToken");

    if (!token) {
        showToast("❌ You must be logged in.", "error");
        return;
    }

    const postData = {
        title,
        body,
        media: media ? { url: media, alt: "Post media" } : null,
        tags,
    };

    try {
        const result = await createPost(postData);

        console.log("Post created successfully. API response:", result);

        showToast("✅ Post created successfully!", "success");
        form.reset();
        tags = [];
        renderTags();

        setTimeout(() => {
            window.location.href = "../../posts/index.html";
        }, 1500);
    } catch (error) {
        showToast("❌ Failed to create post: " + error.message, "error");
        console.error("Create Post Error:", error);
    }
}


/**
 * sends a POST request to create a new post.
 * @param {Object} postData - Contains title, body, and optional media URL
 * @param {string} token - Auth token
 * @returns {Promise<Object>} The created post object
 * @throws {Error} If API call fails
 */
async function createPost(postData) {
    const result = apiClient(`/social/posts`, {
        method: "POST",
        body: JSON.stringify(postData),
    });
    console.log("🔼 Submitting postData:", postData);

    return result;
}

const tagInput = document.querySelector("#tagInput");
const tagsContainer = document.querySelector("#tagsContainer");
let tags = [];

tagInput.addEventListener("keydown", (e) => {
    const tag = tagInput.value.trim();

    if ((e.key === "Enter" || e.key === ",") && tag) {
        e.preventDefault();

        if (tags.length >= 3) return showToast("⚠️ Max 3 tags allowed", "error");
        if (tags.includes(tag)) return showToast("⚠️ Tag already added", "error");

        tags.push(tag);
        renderTags();
        tagInput.value = "";
    }
});

function renderTags() {
    tagsContainer.innerHTML = "";

    tags.forEach((tag, index) => {
        const el = document.createElement("span");
        el.className = "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2";
        el.innerHTML = `${tag} <button type="button" data-index="${index}" class="text-red-500 hover:text-red-700 font-bold">×</button>`;
        tagsContainer.appendChild(el);
    });
}

tagsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const index = e.target.dataset.index;
        tags.splice(index, 1);
        renderTags();
    }
});
