/**
 * Redirect to login if user is not authenticated
 */

export function requireAuth() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "/pages/auth/login/index.html";
    }
}
