
/**
 * @fileoverview Profile page logic.
 * loads the logged-in user's profile OR another user's public profile.
 * handles modal form updates, profile extras (posts, followers, following), and UI display.
 */
import { showToast } from "../../ui/shared/showToast.js";
import { fetchProfile, updateProfile } from "../../services/profileServices.js";
import { preloadProfileExtras } from "../../services/profileExtras.js";
import { displayProfile } from "../../utils/domUtils.js";
import { logoutUser } from "../../utils/logout.js";
import { requireAuth } from "../../utils/authGuard.js";
import { renderNavbar } from "../../ui/navbar/navbar.js";
import { load } from "../../utils/storage.js";
import {
    togglePreview,
    renderPostsPreview,
    renderFollowersPreview,
    renderFollowingPreview,
} from "../../ui/profiles/profileUi.js";
//import { fetchUserPosts } from "../../services/profilePosts.js";
import { fetchUserPosts } from "../../services/profileServices.js";
import { renderPosts } from "../../utils/domPosts.js";
import { apiClient } from "../../utils/apiHelpers.js";
import { openEditProfileModal, getEditPayload, closeModal } from "../../utils/modalUtils.js";


requireAuth();
renderNavbar();


const token = load("accessToken");
const loggedInUser = load("user");
const queryParams = new URLSearchParams(window.location.search);
const viewedProfileName = queryParams.get("user") || loggedInUser?.name;
const isViewingOwnProfile = viewedProfileName === loggedInUser?.name;


window.addEventListener("DOMContentLoaded", async () => {
    if (!token || !viewedProfileName) {
        showToast("⛔ You are not logged in", "error");
        return;
    }

    try {
        const profile = await fetchProfile(viewedProfileName);
        displayProfile(profile);
        fetchUserPosts(profile.name)
            .then(posts => {
                const cardContainer = document.getElementById("profilePostsContainer");
                renderPosts(posts, cardContainer);
            })

            .catch(error => {
                console.error("Error loading profile posts:", error);
                showToast("Failed to load user posts", "error")
            });

        const editBtn = document.getElementById("editProfileBtn");
        if (isViewingOwnProfile && editBtn) {
            editBtn.classList.remove("hidden");
        } else if (editBtn) {
            editBtn.classList.add("hidden");
        }

        const { posts, followers, following } = await preloadProfileExtras(viewedProfileName);
        let isFollowing = followers.some(f => f.name === loggedInUser?.name);

        if (!isViewingOwnProfile) {
            const followBtn = document.createElement("button");
            followBtn.className = `btn-follow flex items-center gap-2 mt-4 px-4 py-2 rounded text-white transition ${isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                }`;
            followBtn.innerHTML = isFollowing
                ? `
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-minus" width="20" height="20"
                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                    <path d="M16 19h6" />
                    <path d="M12 21v-2a4 4 0 0 0 -4 -4h-4" />
                    </svg>
                    <span class="ml-2">Unfollow</span>`
                : `
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-plus" width="20" height="20"
                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                    <path d="M16 19h6" />
                    <path d="M19 16v6" />
                    <path d="M12 21v-2a4 4 0 0 0 -4 -4h-4" />
                    </svg>
                    <span class="ml-2">Follow</span>`;

            followBtn.addEventListener("click", async () => {
                try {
                    const action = isFollowing ? "unfollow" : "follow";
                    await apiClient(`/social/profiles/${viewedProfileName}/${action}`, {
                        method: "PUT"
                    });

                    isFollowing = !isFollowing;
                    showToast(
                        `✅ ${isFollowing ? "Followed" : "Unfollowed"} ${viewedProfileName}`,
                        "success"
                    );

                    followBtn.innerHTML = isFollowing
                        ? `
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-minus" width="20" height="20"
                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                            <path d="M16 19h6" />
                            <path d="M12 21v-2a4 4 0 0 0 -4 -4h-4" />
                            </svg>
                            <span class="ml-2">Unfollow</span>`
                        : `
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-plus" width="20" height="20"
                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                            <path d="M16 19h6" />
                            <path d="M19 16v6" />
                            <path d="M12 21v-2a4 4 0 0 0 -4 -4h-4" />
                            </svg>
                            <span class="ml-2">Follow</span>`;

                    followBtn.className = `btn-follow flex items-center gap-2 mt-4 px-4 py-2 rounded text-white transition ${isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                        }`;
                } catch (err) {
                    console.error(err);
                    showToast("❌ Failed to update follow status", "error");
                }
            });
            document.getElementById("profileHeader")?.appendChild(followBtn);
        }

        document.getElementById("myPostsStat")?.addEventListener("click", async () => {
            togglePreview("previewPosts");

            try {
                const freshPosts = await fetchUserPosts(viewedProfileName);
                renderPostsPreview(freshPosts);
            } catch (error) {
                console.error("❌ Could not reload posts preview", error);
                showToast("Failed to load posts", "error");
            }
        });

        document.getElementById("followersStat")?.addEventListener("click", async () => {
            try {
                togglePreview("previewFollowers");
                const { followers } = await preloadProfileExtras(viewedProfileName);
                renderFollowersPreview(followers);
            } catch (err) {
                console.error("❌ Failed to reload followers:", err);
                showToast("❌ Failed to reload followers", "error");
            }
        });

        document.getElementById("followingStat")?.addEventListener("click", async () => {
            try {
                togglePreview("previewFollowing");
                const { following } = await preloadProfileExtras(viewedProfileName);
                renderFollowingPreview(following);
            } catch (err) {
                console.error("❌ Failed to reload following:", err);
                showToast("❌ Failed to reload following", "error");
            }
        });

        document.addEventListener("click", (event) => {
            const previews = ["previewPosts", "previewFollowers", "previewFollowing"];
            const isStatButton = event.target.closest("#myPostsStat, #followersStat, #followingStat");
            const isInsidePreview = event.target.closest("#previewPosts, #previewFollowers, #previewFollowing");

            if (!isStatButton && !isInsidePreview) {
                previews.forEach(id => document.getElementById(id)?.classList.add("hidden"));
            }
        });

    } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
        showToast("❌ " + err.message, "error");
    }
});

document.getElementById("editProfileBtn")?.addEventListener("click", async () => {
    try {
        const freshProfile = await fetchProfile(viewedProfileName);
        openEditProfileModal(freshProfile);
    } catch (error) {
        showToast("❌ Failed to load profile info", "error");
        console.error("Profile fetch failed:", error);
    }
});

document.getElementById("modalForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = load("user");
    if (!user) return;

    try {
        const payload = getEditPayload();
        const updatedProfile = await updateProfile(user.name, payload);

        displayProfile(updatedProfile);

        const { posts, followers, following } = await preloadProfileExtras(updatedProfile.name);
        renderPosts(posts, document.getElementById("profilePostsContainer"));

        document.getElementById("countPosts").textContent = posts.length;
        document.getElementById("countFollowers").textContent = followers.length;
        document.getElementById("countFollowing").textContent = following.length;


        localStorage.setItem("user", JSON.stringify(updatedProfile));
        console.log(localStorage.getItem("user"));
        closeModal();
        showToast("✅ Profile updated successfully!", "success");

    } catch (err) {
        console.error("❌ Update failed:", err);
        const msg = err?.message?.includes("Image is not accessible")
            ? "❌ One of your image URLs is not accessible. Please use a valid image link."
            : err.message || "❌ Could not update profile";

        showToast(msg, "error");
    }

});

document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
