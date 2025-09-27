import { registerUser } from "../../../services/authService.js";
import { getFormData } from "../../../utils/formUtils.js";
import { showMessage } from "../../../utils/showMessage.js";

const form = document.getElementById("registerForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("form submitted!");

    if (!form) {
        console.error("Form element not found");
        return;
    }

    const formData = new FormData(form);


    /*  //required fields 
     const name = formData.get("name")?.trim();
     const email = formData.get("email")?.trim();
     const password = formData.get("password").trim();
 
 
     // optional fields 
     const bio = formData.get("bio")?.trim();
     const avatarUrl = formData.get("avatarUrl")?.trim();
     const avatarAlt = formData.get("avatarAlt")?.trim();
     const bannerUrl = formData.get("bannerUrl")?.trim();
     const bannerAlt = formData.get("bannerAlt")?.trim();
     const venueManager = formData.get("venueManager") === "on"; */
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
        showMessage("Account created successfully! ✅ You can now log in.", "ok");
        setTimeout(() => {
            window.location.href = "../login/index.html";
        }, 2000);

    } catch (err) {
        console.error("❌ Registration failed:", err.message);
        // show message to ui helper 
        showMessage("❌ " + err.message, "err");
    }

    console.log("Payload to send:", payload);
})
