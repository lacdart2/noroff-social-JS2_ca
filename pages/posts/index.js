

/**
 * @fileoverview index.js (Posts Page)
 * entry point for displaying all posts.
 * uses services/postsService.js and utils/domPosts.js to fetch and render posts.
 */

import { fetchAllPosts } from "../../services/postsService.js";
import { renderPosts } from "../../utils/domPosts.js";
import { renderNavbar } from "../../ui/navbar/navbar.js";
import { requireAuth } from "../../utils/authGuard.js";
import { logoutUser } from "../../utils/logout.js";
import { load } from "../../utils/storage.js";
import { renderBatteryLoader, showLoader, hideLoader } from "../../ui/shared/batteryLoader.js";
import { showToast } from "../../ui/shared/showToast.js";
import { smartSearchPosts } from "../../services/postsService.js";
import { renderSearchBar } from "../../ui/shared/renderSearchBar.js";

const searchContainer = document.getElementById("postSearchContainer");

renderSearchBar(searchContainer, {
    placeholder: "🔍 Search posts by title or tag…",
    onInput: debounce(handlePostSearch, 300),
});


renderNavbar();
requireAuth();

const postsContainer = document.getElementById("postsContainer");

const nextBtn = document.getElementById("nextPageBtn");
const prevBtn = document.getElementById("prevPageBtn");
const pageIndicator = document.getElementById("currentPage");

let offset = 0;
const limit = 10;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    const urlQ = new URLSearchParams(window.location.search).get("q");

    if (urlQ && urlQ.trim().length >= 2) {
        currentQuery = urlQ.trim();
        isSearching = true;
        currentPage = 1;
        offset = 0;
        if (searchInput) searchInput.value = currentQuery;
        loadSmartSearch(1);
    } else {
        isSearching = false;
        currentQuery = "";
        currentPage = 1;
        offset = 0;
        loadPosts(offset);
    }
});


nextBtn?.addEventListener("click", () => {
    if (isSearching) {
        currentPage++;
        loadSmartSearch(currentPage);
    } else {
        offset += limit;
        currentPage++;
        loadPosts(offset);
    }
});
prevBtn?.addEventListener("click", () => {
    if (isSearching) {
        if (currentPage > 1) {
            currentPage--;
            loadSmartSearch(currentPage);
        }
    } else {
        if (offset >= limit) {
            offset -= limit;
            currentPage--;
            loadPosts(offset);
        }
    }
});

/**
 * loads and renders paginated posts
 * @param {number} offset - The number of posts to skip
 */

async function loadPosts(offset = 0) {
    const token = load("accessToken");

    if (!token) {
        showToast("⛔ You must be logged in to view posts.", "error");
        window.location.href = "/pages/auth/login/index.html";
        return;
    }
    renderBatteryLoader();
    showLoader();
    try {
        const posts = await fetchAllPosts(limit, currentPage);

        hideLoader();
        renderPosts(posts, postsContainer);

        pageIndicator.textContent = `Page ${currentPage}`;
        prevBtn.disabled = offset === 0;
        nextBtn.disabled = posts.length < limit;

    } catch (err) {
        console.error("❌ Error loading posts:", err);
        showToast("❌ Failed to load posts: ", "error");
    }
}

async function loadSmartSearch(page = 1) {
    const token = load("accessToken");
    if (!token) {
        showToast("⛔ You must be logged in to view posts.", "error");
        window.location.href = "/pages/auth/login/index.html";
        return;
    }
    if (!currentQuery || currentQuery.trim().length < 1) {
        isSearching = false;
        return loadPosts(0);
    }

    renderBatteryLoader();
    showLoader();
    try {
        const posts = await smartSearchPosts(currentQuery.trim(), { limit, page });
        hideLoader();
        renderPosts(posts, postsContainer);

        pageIndicator.textContent = `Page ${currentPage}`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = posts.length < limit;
    } catch (err) {
        console.error("❌ Error in smart search:", err);
        showToast("❌ Failed to search posts", "error");
    }
}
async function handlePostSearch(query) {
    currentQuery = query.trim();
    isSearching = currentQuery.length >= 2;

    updateURLQuery(currentQuery);

    if (isSearching) {
        loadSmartSearch(1);
    } else {
        loadPosts(0);
    }
}

document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);

let isSearching = false;
let currentQuery = "";

function debounce(fn, delay = 300) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}


const searchInput = document.getElementById("postSearch");

function updateURLQuery(q) {
    const url = new URL(window.location.href);
    if (q && q.trim()) url.searchParams.set("q", q.trim());
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
}


searchInput?.addEventListener("input", debounce((e) => {
    const q = e.target.value || "";
    currentQuery = q;
    isSearching = q.trim().length >= 2;
    currentPage = 1;
    offset = 0;
    updateURLQuery(q);

    if (isSearching) {
        loadSmartSearch(1);
    } else {
        loadPosts(0);
    }
}, 300));


