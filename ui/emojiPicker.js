
export function setupEmojiPicker(inputId, btnId, pickerId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    const picker = document.getElementById(pickerId);

    if (!input || !btn || !picker) return;

    // toggle show/hide
    btn.addEventListener("click", () => {
        picker.classList.toggle("hidden");
    });

    // add emoji on click
    picker.querySelectorAll(".emoji").forEach(emoji => {
        emoji.addEventListener("click", () => {
            input.value += emoji.textContent;
            picker.classList.add("hidden");
            input.focus();
        });
    });
}
