// utils/footerYear.js
export function setFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
