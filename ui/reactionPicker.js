
/**
 * wire up the reaction picker for a single post detail view.
 * @param {string|number} postId
 * expects:
 *  - button:  #reactionBtn
 *  - picker:  #emojiPicker  with children having class ".emoji"
 */

import { reactToPost } from "../services/postReactions.js";
import { showToast } from "./shared/showToast.js";
export function setupReactionPicker(postId) {
    const btn = document.getElementById("reactionBtn");
    const picker = document.getElementById("emojiPicker");
    if (!btn || !picker) return;

    let currentReaction = null;

    btn.addEventListener("click", () => {
        picker.classList.toggle("hidden");
    });

    picker.querySelectorAll(".emoji").forEach((emoji) => {
        emoji.addEventListener("click", async () => {
            const symbol = emoji.textContent?.trim();
            if (!symbol) return;

            const prev = btn.textContent;
            btn.textContent = symbol;
            currentReaction = symbol;
            picker.classList.add("hidden");

            btn.disabled = true;

            try {
                const result = await reactToPost(postId, symbol);
                showToast(`You reacted with ${symbol}`, "success");
            } catch (error) {
                console.warn(`⚠️ Backend error for ${symbol}`, error);
                showToast("❌ Reaction failed. Please try again.", "error");
                btn.textContent = prev || "😀 React";
            } finally {
                btn.disabled = false;
            }
        });
    });
}
