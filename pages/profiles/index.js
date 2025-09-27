
import { getAllProfiles } from "../../services/profileServices.js";
import { fetchAllPosts } from "../../services/postsService.js";
import { searchProfiles } from "../../services/profileServices.js";
import { renderBatteryLoader, showLoader, hideLoader } from "../../ui/shared/batteryLoader.js";
import { renderNavbar } from "../../ui/navbar/navbar.js";
import { renderUserCard } from "../../ui/renderUserCard.js";
import { renderTrendingUser } from "../../ui/renderTrendingUser.js";
import { renderSearchBar } from "../../ui/shared/renderSearchBar.js";
import { requireAuth } from "../../utils/authGuard.js";
import { showToast } from "../../ui/shared/showToast.js";
import { logoutUser } from "../../utils/logout.js";
import { buildProfileFromMap } from "../../services/profileServices.js";

const usersGrid = document.getElementById("usersGrid");
const trendingUsersEl = document.getElementById("trendingUsers");
const searchContainer = document.getElementById("profileSearchContainer");
const loadMoreContainer = document.getElementById("loadMoreContainer");

renderNavbar();
requireAuth();

renderBatteryLoader("#batteryLoader");
hideLoader();


function debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}
// load more visible page 
let visibleCount = 10;
const PAGE_SIZE = 10;

async function init() {
    try {
        showLoader();
        console.log("🔵 Step 1: Fetching profiles...");

        const profilesRes = await getAllProfiles();
        const profiles = Array.isArray(profilesRes)
            ? profilesRes
            : profilesRes.data || [];

        window.BASE_PROFILES = profiles;

        renderProfiles(profiles);

        await testPostsFetch();

    } catch (err) {
        console.error("❌ Failed to load profiles:", err);
        showToast("❌ Could not load users", "error");
    } finally {
        hideLoader();
    }
    renderSearchBar(searchContainer, {
        placeholder: "Search users by name or bio…",
        onInput: debounce(onSearch, 300),
    });
}

init();


// Step 2: fetch posts including comments + reactions

async function testPostsFetch() {
    showLoader();
    try {
        hideLoader();
        const postsRes = await fetchAllPosts(100, 1, null);
        const posts = Array.isArray(postsRes) ? postsRes : postsRes.data || [];

        const engagementMap = buildEngagementMap(posts);
        window.ENGAGEMENT_MAP = engagementMap;

        const enriched = enrichProfiles(window.BASE_PROFILES, engagementMap);
        window.ENRICHED_PROFILES = enriched;

        const trendingProfiles = await buildTrendingFromMap(engagementMap);
        window.TRENDING = trendingProfiles;

        renderTrending(trendingProfiles);

    } catch (err) {
        console.error("❌ Failed to fetch posts:", err);
    }
}

function renderTrending(trendingProfiles) {
    trendingUsersEl.innerHTML = "";

    if (!Array.isArray(trendingProfiles) || trendingProfiles.length === 0) {
        trendingUsersEl.innerHTML = `<p class="text-gray-400 text-sm">No trending users yet.</p>`;
        return;
    }

    trendingProfiles.forEach((profile) => {
        renderTrendingUser(trendingUsersEl, profile);
    });
}

// render sorted users,for better UI

function renderProfiles(list) {
    usersGrid.innerHTML = "";

    // sort active users first
    const sorted = [...list].sort((a, b) => {
        const scoreA =
            (a._count?.posts || 0) +
            (a.engagement?.comments || 0) +
            (a.engagement?.reactions || 0);

        const scoreB =
            (b._count?.posts || 0) +
            (b.engagement?.comments || 0) +
            (b.engagement?.reactions || 0);

        return scoreB - scoreA;
    });

    const toShow = sorted.slice(0, visibleCount);

    toShow.forEach((user) => renderUserCard(usersGrid, user));


    renderLoadMore(sorted.length);
}


// step 3,building the map object,to collect engagements(reactions,comments=> i need it to show trending users)
function buildEngagementMap(posts) {
    const map = {};

    for (const post of posts) {
        const author = post?.author?.name?.trim().toLowerCase();
        if (!author) continue;

        if (!map[author]) {
            map[author] = { comments: 0, reactions: 0 };
        }

        if (Array.isArray(post.comments)) {
            map[author].comments += post.comments.length;
        }

        if (Array.isArray(post.reactions)) {
            for (const r of post.reactions) {
                map[author].reactions += r?.count || 0;
            }
        }
    }

    console.log("📊 Engagement map built:");
    console.table(map);
    return map;
}

// step 4,now i create a new array of profiles using .map to store a new object (engagement) containing all engagements types 
function enrichProfiles(profiles, engagementMap) {
    return profiles.map((profile) => {
        const key = profile.name?.trim().toLowerCase();
        const stats = engagementMap[key] || { comments: 0, reactions: 0 };

        return {
            ...profile,
            engagement: {
                posts: profile._count?.posts || 0,
                followers: profile._count?.followers || 0,
                following: profile._count?.following || 0,
                comments: stats.comments,
                reactions: stats.reactions,
            },
        };
    });
}


// after failing way to grab the top5 from the fetch ,maybe name mismatch ,im trying 
// to map throw the map object 
// the solution 

async function buildTrendingFromMap(engagementMap) {
    const entries = Object.entries(engagementMap).map(([name, stats]) => ({
        name,
        comments: stats.comments,
        reactions: stats.reactions,
        engagementScore: stats.comments + stats.reactions,
    }));

    const sorted = entries.sort((a, b) => b.engagementScore - a.engagementScore);

    const top5 = sorted.slice(0, 5);

    // build "profile-like" objects directly
    return top5.map((user) => buildProfileFromMap(user.name, user));
}

async function onSearch(query) {
    const q = (query || "").trim().toLowerCase();

    if (q.length === 0) {
        updateSearchFeedback("", 0);
        visibleCount = PAGE_SIZE;
        window.CURRENT_LIST = window.ENRICHED_PROFILES || window.BASE_PROFILES || [];
        renderProfiles(window.CURRENT_LIST);
        return;
    }

    if (q.length < 2) {
        updateSearchFeedback("", 0);
        return;
    }

    try {
        showLoader();

        const results = await searchProfiles(q);
        const profiles = Array.isArray(results) ? results : results.data || [];

        updateSearchFeedback(query, profiles.length);

        visibleCount = PAGE_SIZE;
        window.CURRENT_LIST = profiles;
        renderProfiles(window.CURRENT_LIST);
    } catch (err) {
        console.error("❌ Search failed:", err);
        showToast("❌ Could not search users", "error");
    } finally {
        hideLoader();
    }
}

// extra ui ux experience ,show total results

function updateSearchFeedback(query, count) {
    const feedbackEl = document.getElementById("searchFeedback");
    if (!feedbackEl) return;

    if (!query || query.trim() === "") {
        feedbackEl.textContent = "";
        return;
    }

    if (count > 0) {
        feedbackEl.textContent = `${count} result${count !== 1 ? "s" : ""} found`;
    } else {
        feedbackEl.textContent = `No users found for "${query}"`;
    }
}

function renderLoadMore(totalCount) {
    loadMoreContainer.innerHTML = "";

    if (visibleCount >= totalCount) return;

    const btn = document.createElement("button");
    btn.textContent = "Load More";
    btn.className =
        "load-more-btn px-4 py-2 bg-brand-600 hover:bg-purple-400 rounded-lg text-white font-medium transition";
    btn.addEventListener("click", () => {
        visibleCount += PAGE_SIZE;
        renderProfiles(window.CURRENT_LIST || window.ENRICHED_PROFILES || window.BASE_PROFILES || []);
    });

    loadMoreContainer.appendChild(btn);
}

document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);