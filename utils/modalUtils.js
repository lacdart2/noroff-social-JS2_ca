
/**
 * Open the unified Edit Profile modal with all fields
 * @param {Object} profile - Current user profile
 */

let currentProfile = null;

export function openEditProfileModal(profile) {
  currentProfile = profile;

  const modal = document.getElementById("editModal");
  document.getElementById("modalTitle").textContent = "Edit Profile";
  modal.classList.remove("hidden");

  const fieldsContainer = document.getElementById("modalFields");
  fieldsContainer.innerHTML = `
    <div class="mb-4">
      <label for="modalBioInput" class="block text-sm font-medium text-gray-700">Bio</label>
      <textarea id="modalBioInput" class="border border-gray-300 p-2 w-full mt-1 rounded resize-none" rows="3">${(profile.bio || "").trim()}</textarea>
    </div>
        <div class="mb-4">
          <label for="modalAvatarUrl" class="block text-sm font-medium text-gray-700">Avatar URL</label>
          <input id="modalAvatarUrl" class="border border-gray-300 p-2 w-full mt-1 rounded" 
                value="${profile.avatar?.url || ""}" />

          <label for="modalAvatarAlt" class="block text-sm font-medium text-gray-700 mt-2">Avatar Alt Text</label>
          <input id="modalAvatarAlt" class="border border-gray-300 p-2 w-full mt-1 rounded" 
                value="${profile.avatar?.alt || ""}" />
        </div>
        <div class="mb-4">
          <label for="modalBannerUrl" class="block text-sm font-medium text-gray-700">Banner URL</label>
          <input id="modalBannerUrl" class="border border-gray-300 p-2 w-full mt-1 rounded" 
                value="${profile.banner?.url || ""}" />

          <label for="modalBannerAlt" class="block text-sm font-medium text-gray-700 mt-2">Banner Alt Text</label>
          <input id="modalBannerAlt" class="border border-gray-300 p-2 w-full mt-1 rounded" 
                value="${profile.banner?.alt || ""}" />
        </div>
  `;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/**
 * Collects all updated fields from the modal
 * @returns {Object} Updated profile payload
 */
export function getEditPayload() {
  return {
    bio: document.getElementById("modalBioInput").value.trim(),
    avatar: {
      url: document.getElementById("modalAvatarUrl").value.trim(),
      alt: document.getElementById("modalAvatarAlt").value.trim(),
    },
    banner: {
      url: document.getElementById("modalBannerUrl").value.trim(),
      alt: document.getElementById("modalBannerAlt").value.trim(),
    },
  };
}

/**
* Close the modal
 */
export function closeModal() {
  const modal = document.getElementById("editModal");
  if (modal) {
    modal.classList.add("hidden");
    document.getElementById("modalFields").innerHTML = "";
  }
  currentProfile = null;
}
document.getElementById("closeModalBtn")?.addEventListener("click", closeModal);
document.getElementById("cancelBtn")?.addEventListener("click", closeModal);
