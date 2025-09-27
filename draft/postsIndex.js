/* import { getAllProfiles } from "../../services/profileServices.js";
import { renderProfileCard } from "../../ui/profiles/renderProfileCard.js";
import { renderNavbar } from "../../ui/navbar/navbar.js";
import { requireAuth } from "../../utils/authGuard.js";
renderNavbar()
requireAuth();
const profilesContainer = document.getElementById("profilesContainer");

function initProfileList() {
    getAllProfiles()
        .then((profiles) => {
            if (!profiles.length) {
                profilesContainer.innerHTML = "<p class='text-center text-gray-500'>No profiles found.</p>";
                return;
            }

            profiles.forEach((profile) => {
                const card = renderProfileCard(profile);
                profilesContainer.appendChild(card);
            });
        })
        .catch((error) => {
            console.error("Error loading profiles:", error);
            profilesContainer.innerHTML = `
        <p class="text-center text-red-500">Something went wrong while loading profiles.</p>`;
        });
}

initProfileList();
 */
import { renderBatteryLoader, showLoader, hideLoader } from "../../ui/shared/batteryLoader.js";

import { getAllProfiles, searchProfiles } from "../../services/profileServices.js";
import { fetchAllPosts } from "../../services/postsService.js";

import { renderNavbar } from "../../ui/navbar/navbar.js";
import { renderUserCard } from "../../ui/renderUserCard.js";
import { renderTrendingUser } from "../../ui/renderTrendingUser.js";
import { renderSearchBar } from "../../ui/shared/renderSearchBar.js";
import { requireAuth } from "../../utils/authGuard.js";
import { showToast } from "../../ui/shared/showToast.js";
import { logoutUser } from "../../utils/logout.js";
import { load } from "../../utils/storage.js";
//const loadMoreBtn = document.getElementById("loadMoreBtn");



renderNavbar();
requireAuth();

const usersGrid = document.getElementById("usersGrid");
const trendingUsersEl = document.getElementById("trendingUsers");
const searchContainer = document.getElementById("profileSearchContainer");


// Search state
let isSearching = false;
let currentQuery = "";


/**
 * Load all profiles
 */
async function loadProfiles() {
    try {
        const profiles = await getAllProfiles();
        renderProfiles(profiles);
        renderTrending(profiles);

    } catch (error) {
        console.error("❌ Failed to load profiles:", error);
        usersGrid.innerHTML = `<p class="text-center text-red-500 col-span-full">Could not load profiles.</p>`;
    }
}
//loadProfiles()

const loadMoreContainer = document.getElementById("loadMoreContainer");
const loadMoreBtn = document.createElement("button");
loadMoreBtn.id = "loadMoreBtn";
loadMoreBtn.textContent = "🔄 Load More Users";
loadMoreBtn.className =
    "px-5 py-2 bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition";
loadMoreContainer?.appendChild(loadMoreBtn);

loadMoreBtn.addEventListener("click", renderNextBatch);

/**
 * Load matching profiles via search
 * @param {string} query
 */
/* async function handleProfileSearch(query) {
    currentQuery = query;
    isSearching = query.trim().length >= 2;

    if (!isSearching) return loadProfiles();

    try {
        const results = await searchProfiles(query);
        renderProfiles(results);
        renderTrending(results);
    } catch (error) {
        console.error("❌ Profile search failed:", error);
        usersGrid.innerHTML = `<p class="text-center text-red-500 col-span-full">No matching users found.</p>`;
    }
} */
async function handleProfileSearch(query) {
    const q = query.trim();
    if (q.length < 2) return initProfilesPage(); // reset

    try {
        const [results, activityMap] = await Promise.all([
            searchProfiles(q),
            buildUserActivityMap(),
        ]);

        const { trending, rest } = splitProfilesByActivity(results, activityMap);

        renderTrending(trending);
        renderProfiles(rest);
    } catch (error) {
        console.error("❌ Profile search failed:", error);
        usersGrid.innerHTML = `<p class="text-center text-red-500 col-span-full">No matching users found.</p>`;
    }
}


// Debounce function like in posts
function debounce(fn, delay = 300) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}

// Utility renderers
/* function renderProfiles(profiles) {
    usersGrid.innerHTML = "";

    const filtered = profiles.filter((user) => {
        const hasPosts = user._count?.posts > 0;
        const hasAvatar = user.avatar?.url && user.avatar.url.trim() !== "";
        return hasPosts && hasAvatar;
    });

    if (!filtered.length) {
        usersGrid.innerHTML = `<p class="text-center text-gray-400 col-span-full">No real users found.</p>`;
        return;
    }

    filtered.forEach((user) => renderUserCard(usersGrid, user));
} */


// load more user initial state
let allProfiles = [];
let currentIndex = 0;
const BATCH_SIZE = 12;// Show 8 users per click

function renderProfiles(profiles) {
    usersGrid.innerHTML = "";
    currentIndex = 0;

    // Relaxed filter (Step 1)
    allProfiles = profiles.filter(u => u.postsCount > 0);

    if (allProfiles.length === 0) {
        usersGrid.innerHTML = `<p class="text-center text-gray-400 col-span-full">No users found.</p>`;
        loadMoreContainer?.classList.add("hidden");
        return;
    }

    renderNextBatch(); // first batch

    // Show/hide button based on remaining items
    if (currentIndex >= allProfiles.length) {
        loadMoreContainer?.classList.add("hidden");
    } else {
        loadMoreContainer?.classList.remove("hidden");
    }
}
function renderNextBatch() {
    const slice = allProfiles.slice(currentIndex, currentIndex + BATCH_SIZE);
    slice.forEach(u => renderUserCard(usersGrid, u));
    currentIndex += BATCH_SIZE;

    if (currentIndex >= allProfiles.length) {
        loadMoreContainer?.classList.add("hidden");
    } else {
        loadMoreContainer?.classList.remove("hidden");
    }
}


/**
 * Build activity map: user -> { reactions, comments }
 */
async function buildUserActivityMap() {
    const res = await fetchAllPosts(100); // fetch more to increase chances
    const posts = Array.isArray(res) ? res : (res?.data || []);
    const map = new Map();

    for (const post of posts) {
        const raw = post.author?.name;
        if (!raw) continue;
        const authorKey = String(raw).trim().toLowerCase();

        // Reactions: support either [{symbol,count}] or flat array
        let reactionCount = 0;
        if (Array.isArray(post.reactions)) {
            const hasCount = post.reactions.some(r => typeof r?.count === "number");
            reactionCount = hasCount
                ? post.reactions.reduce((sum, r) => sum + (r?.count || 0), 0)
                : post.reactions.length;
        }

        const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;

        if (!map.has(authorKey)) map.set(authorKey, { reactions: 0, comments: 0 });
        const prev = map.get(authorKey);
        map.set(authorKey, {
            reactions: prev.reactions + reactionCount,
            comments: prev.comments + commentCount,
        });
    }

    return map;
}

function splitProfilesByActivity(profiles, activityMap) {
    const withStats = profiles.map(user => {
        const key = String(user.name || "").trim().toLowerCase();
        const mapStats = activityMap.get(key) || { reactions: 0, comments: 0 };

        const postsCount = user._count?.posts || 0;
        const reactions = mapStats.reactions || 0;
        const comments = mapStats.comments || 0;

        // Primary measure: pure engagement
        const engagement = reactions + comments;
        // Secondary measure: content volume
        const posts = postsCount;

        return { ...user, postsCount, reactions, comments, engagement, posts };
    });

    // Keep users who have at least 1 post (so they have content)
    const eligible = withStats.filter(u => u.postsCount > 0);

    // 1) Users with real engagement (>= 2)
    const active = eligible.filter(u => u.engagement >= 2);

    // 2) Choose source list: prefer active; if too few, fall back to eligible
    const source = active.length >= 5 ? active : eligible;

    // 3) Sort by engagement desc, then posts desc (tie-breaker)
    const sorted = source.sort((a, b) => {
        if (b.engagement !== a.engagement) return b.engagement - a.engagement;
        return b.posts - a.posts;
    });

    // 4) Take top 5 for trending
    const trending = sorted.slice(0, 5);

    // 5) Rest = eligible minus trending (left grid)
    const trendingNames = new Set(trending.map(u => u.name));
    const rest = eligible.filter(u => !trendingNames.has(u.name));

    return { trending, rest };
}




async function initProfilesPage() {
    try {
        const [profiles, activityMap] = await Promise.all([
            getAllProfiles(),       // has _count.posts
            buildUserActivityMap(), // sums reactions/comments per author
        ]);

        const { trending, rest } = splitProfilesByActivity(profiles, activityMap);

        // Debug (keep for now)
        console.log("Profiles:", profiles.length);
        console.log("Activity map size:", activityMap.size);
        console.log("Trending sample:", trending);

        renderTrending(trending);  // enriched users (have postsCount/reactions/comments)
        renderProfiles(rest);      // left side with Load More
    } catch (err) {
        console.error("❌ Failed to load:", err);
        showToast("❌ Could not load user data", "error");
    }
}





/* function renderTrending(profiles) {
    trendingUsersEl.innerHTML = "";

    const filtered = profiles.filter((user) => {
        const hasPosts = user._count?.posts > 0;
        const hasAvatar = user.avatar?.url && user.avatar.url.trim() !== "";
        return hasPosts && hasAvatar;
    });

    filtered.forEach((user) => renderTrendingUser(trendingUsersEl, user));
} */
function renderTrending(trendingUsers) {
    trendingUsersEl.innerHTML = "";

    if (!Array.isArray(trendingUsers) || trendingUsers.length === 0) {
        trendingUsersEl.innerHTML = `<p class="text-gray-400 text-sm">No trending users found.</p>`;
        return;
    }

    trendingUsers.forEach(user => {
        renderTrendingUser(trendingUsersEl, {
            ...user,
            reactions: user.reactions ?? 0,
            comments: user.comments ?? 0,
        });
    });
}


// Init search bar
renderSearchBar(searchContainer, {
    placeholder: "Search users by name or bio…",
    onInput: debounce(handleProfileSearch, 300),
});

// Load initial list
initProfilesPage();


// Logout support
document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
