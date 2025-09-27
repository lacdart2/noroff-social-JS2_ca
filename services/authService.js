import { buildHeaders } from "../utils/apiHelpers.js";
import { BASE_URL } from "../utils/constants.js";
const REGISTER_ENDPOINT = "/auth/register";
const LOGIN_ENDPOINT = "/auth/login";

//register
export async function registerUser(payload) {
    const res = await fetch(BASE_URL + REGISTER_ENDPOINT, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(payload)
    });
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json() : null;

    console.log("API response:", data);

    if (!res.ok) {
        const message = data?.errors?.[0]?.message || data?.message || "Unknown error occurred";
        throw new Error(message);
    }
    return data;
}


//login
export async function loginUser(email, password) {
    const res = await fetch(BASE_URL + LOGIN_ENDPOINT, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ email, password }),

    });

    const data = await res.json();

    if (!res.ok) {
        const message = data?.errors?.[0]?.message || "Login failed";
        throw new Error(message);
    }

    return data;
}