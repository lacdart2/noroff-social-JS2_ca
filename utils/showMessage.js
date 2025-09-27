export function showMessage(message, type = "info") {
    const msg = document.getElementById("msg");
    if (!msg) return;

    msg.textContent = message;
    msg.className = "text-center my-2";

    if (type === "err") {
        msg.classList.add("text-red-500");
    } else if (type === "ok" || type === "success") {
        msg.classList.add("text-green-600");
    } else {
        msg.classList.add("text-gray-700");
    }
}
