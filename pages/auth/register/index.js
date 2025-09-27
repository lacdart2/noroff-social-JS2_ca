import { registerUser } from "../../../services/authService.js";
import { getFormData } from "../../../utils/formUtils.js";
import { showToast } from "../../../ui/shared/showToast.js";
const form = document.getElementById("registerForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("form submitted!");
    if (!form) {
        console.error("Form element not found");
        return;
    }
    const formData = new FormData(form);

    const {
        name,
        email,
        password,
        bio,
        avatarUrl,
        avatarAlt,
        bannerUrl,
        bannerAlt,
        venueManager
    } = getFormData(form);

    // build payload — include required + only non-empty optional fields
    const payload = {
        name,
        email,
        password,
    };
    // only add optional fields if not empty
    if (bio) payload.bio = bio;

    if (avatarUrl || avatarAlt) {
        payload.avatar = {};
        if (avatarUrl) payload.avatar.url = avatarUrl;
        if (avatarAlt) payload.avatar.alt = avatarAlt;
    }
    if (bannerAlt || bannerUrl) {
        payload.banner = {};
        if (bannerUrl) payload.banner.url = bannerUrl;
        if (bannerAlt) payload.banner.alt = bannerAlt;
    }
    if (venueManager) {
        payload.venueManager = true;
    }

    try {
        const result = await registerUser(payload);
        console.log("✅ Registration successful", result);

        // show message to ui helper 
        showToast("Account created successfully! ✅ You can now log in.", "success");
        setTimeout(() => {
            window.location.href = "../login/index.html";
        }, 2000);

    } catch (err) {
        console.error("❌ Registration failed:", err.message);
        // show message to ui helper 
        showToast("❌ " + err.message, "error");
    }

    console.log("Payload to send:", payload);
})
