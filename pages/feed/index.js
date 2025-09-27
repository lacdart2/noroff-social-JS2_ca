
import { renderNavbar } from "../../ui/navbar/navbar.js";
import { requireAuth } from "../../utils/authGuard.js";
import { fetchAllPosts } from "../../services/postsService.js";
import { renderPosts } from "../../utils/domPosts.js";
import { createFeedCard } from "../../ui/feedCard.js";
import { renderBatteryLoader, showLoader, hideLoader } from "../../ui/shared/batteryLoader.js";
import { renderLatestPosts, renderTrendingTags, renderPeopleYouMayKnow } from "../../ui/feedSidebar.js";
import { load } from "../../utils/storage.js";
import { showToast } from "../../ui/shared/showToast.js";

const listViewBtn = document.getElementById("listViewBtn");
const gridViewBtn = document.getElementById("gridViewBtn");
const highlightsContainer = document.getElementById("feed");
const postsContainer = document.getElementById("allPosts");
const seeMoreBtn = document.getElementById("seeMoreBtn");

renderNavbar();
requireAuth();


let offset = 0;
const limit = 30;

/**
 * render top highlight section
 */
async function renderHighlights() {
    try {
        const posts = await fetchAllPosts(20);
        const highlights = posts.slice(0, 8);
        hideLoader();

        highlightsContainer.innerHTML = "";

        [...highlights, ...highlights].forEach(post => {
            const card = createFeedCard(post);
            card.classList.add("min-w-[250px]");
            highlightsContainer.appendChild(card);
        });

    } catch (err) {
        console.error("❌ Failed to load highlights", err);
        highlightsContainer.innerHTML = `<p class="text-red-500">Could not load highlights.</p>`;
    }
}

/**
 * render sidebar widgets
 */
async function renderSidebar() {
    try {
        const posts = await fetchAllPosts();
        renderLatestPosts(posts);
        renderTrendingTags(posts);
        renderPeopleYouMayKnow();
    } catch (err) {
        console.error("❌ Failed to load sidebar widgets", err);
    }
}

/**
 * load and render all posts
 */

async function loadPosts() {
    const token = load("accessToken");
    if (!token) {
        showToast("⛔ You must be logged in to view posts.", "error");
        window.location.href = "/pages/auth/login/index.html";
        return;
    }

    renderBatteryLoader();
    showLoader();
    try {
        const posts = await fetchAllPosts(20, 1);
        hideLoader();

        postsContainer.innerHTML = "";
        renderPosts(posts, postsContainer);
        seeMoreBtn.addEventListener("click", () => {
            window.location.href = "/pages/posts/index.html";
        });

    } catch (err) {
        console.error("❌ Error loading posts:", err);
        showToast("❌ Failed to load posts", "error");
    }
}

renderHighlights();
renderSidebar();
loadPosts();

listViewBtn.addEventListener("click", () => {
    postsContainer.classList.remove("md:grid-cols-2");
    postsContainer.classList.add("grid-cols-1");
});

gridViewBtn.addEventListener("click", () => {
    postsContainer.classList.remove("grid-cols-1");
    postsContainer.classList.add("md:grid-cols-2");
});

