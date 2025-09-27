/**
 * @fileoverview Handles user login logic.
 * Collects login form data, sends it to the API, stores the token + user info in localStorage,
 * and redirects to the profile page.
 */

import { getFormData } from "../../../utils/formUtils.js";
import { showToast } from "../../../ui/shared/showToast.js"
import { loginUser } from "../../../services/authService.js";
import { save } from "../../../utils/storage.js";
import { renderNavbar } from "../../../ui/navbar/navbar.js";
renderNavbar();


const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { email, password } = getFormData(form);

    try {
        const data = await loginUser(email, password);
        save("accessToken", data.data.accessToken);
        save("user", data.data);
        showToast(`✅ Welcome back, ${data.data.name}!`, "success");

        setTimeout(() => {
            window.location.href = "../../../pages/profile/index.html";
        }, 1500);
    } catch (err) {
        console.error(err);
        showToast(`❌ ${err.message}`, "error");
    }
});
