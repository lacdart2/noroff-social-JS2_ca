/**
 * logs out the current user by clearing localStorage
 * and redirecting to the login page.
 */
import { redirectToLogin } from "./navigation.js";

export function logoutUser() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/index.html";

    redirectToLogin();
}
