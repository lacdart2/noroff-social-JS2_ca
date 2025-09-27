/* export function displayProfile(profile) {

    document.querySelectorAll(".profile-name").forEach(name => {
        name.textContent = profile.name
    })
    //document.getElementById("name").textContent = profile.name;
    document.getElementById("email").textContent = profile.email;

    // Bio
    const bioText = document.getElementById("bioText");
    bioText.textContent = profile.bio || "—";

    // Banner
    const bannerImg = document.getElementById("bannerImg");
    //const bannerText = document.getElementById("bannerText");

    if (profile.banner?.url) {
        bannerImg.src = profile.banner.url;
        bannerImg.alt = profile.banner.alt || "Profile banner";
        //bannerText.textContent = profile.banner.url;
        bannerImg.style.display = "block";
    } else {
        bannerImg.style.display = "none";
        bannerText.textContent = "—";
    }

    // Avatar
    const avatarImg = document.getElementById("avatarImg");
    const avatarText = document.getElementById("avatarText");

    // Check if avatar exists
    if (profile.avatar?.url) {
        avatarImg.src = profile.avatar.url;
        avatarImg.alt = profile.avatar.alt || "Avatar";
        avatarImg.style.display = "block";
  

        if (avatarText) {
            avatarText.textContent = profile.avatar.url;
        }
    } else {
        avatarImgs.forEach(img => {
            img.style.display = "none";
        });

        if (avatarText) {
            avatarText.textContent = "—";
        }
    }
    // counts 
    document.getElementById("countPosts").textContent = profile._count?.posts ?? 0;
    document.getElementById("countFollowers").textContent = profile._count?.followers ?? 0;
    document.getElementById("countFollowing").textContent = profile._count?.following ?? 0;


}
 */
/**
 * Render profile info into the DOM
 * @param {Object} profile - Profile object from API
 */
export function displayProfile(profile) {
    // Name
    const nameEl = document.getElementById("name");
    if (nameEl) nameEl.textContent = profile.name;

    // Email
    const emailEl = document.getElementById("email");
    if (emailEl) emailEl.textContent = profile.email;

    // Bio
    const bioText = document.getElementById("bioText");
    if (bioText) bioText.textContent = profile.bio || "—";

    // Banner
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

    // Avatar
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

    // Stats counts
    const postsEl = document.getElementById("countPosts");
    const followersEl = document.getElementById("countFollowers");
    const followingEl = document.getElementById("countFollowing");

    if (postsEl) postsEl.textContent = profile._count?.posts ?? 0;
    if (followersEl) followersEl.textContent = profile._count?.followers ?? 0;
    if (followingEl) followingEl.textContent = profile._count?.following ?? 0;
}
