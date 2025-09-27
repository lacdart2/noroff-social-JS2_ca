
/**
 * Render profile info into the DOM
 * @param {Object} profile - Profile object from API
 */
export function displayProfile(profile) {
    const nameEl = document.getElementById("name");
    if (nameEl) nameEl.textContent = profile.name;

    const emailEl = document.getElementById("email");
    if (emailEl) emailEl.textContent = profile.email;

    const bioText = document.getElementById("bioText");
    if (bioText) bioText.textContent = profile.bio || "—";

    const bannerImg = document.getElementById("bannerImg");
    if (bannerImg) {
        if (profile.banner?.url) {
            bannerImg.src = profile.banner.url;
            bannerImg.alt = profile.banner.alt || "Profile banner";
            bannerImg.style.display = "block";
        } else {
            bannerImg.style.display = "none";
        }
    }

    const avatarImg = document.getElementById("avatarImg");
    if (avatarImg) {
        if (profile.avatar?.url) {
            avatarImg.src = profile.avatar.url;
            avatarImg.alt = profile.avatar.alt || "Avatar";
            avatarImg.style.display = "block";
        } else {
            avatarImg.style.display = "none";
        }
    }

    const postsEl = document.getElementById("countPosts");
    const followersEl = document.getElementById("countFollowers");
    const followingEl = document.getElementById("countFollowing");

    if (postsEl) postsEl.textContent = profile._count?.posts ?? 0;
    if (followersEl) followersEl.textContent = profile._count?.followers ?? 0;
    if (followingEl) followingEl.textContent = profile._count?.following ?? 0;
}
