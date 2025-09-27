/**
 * @fileoverview Handles rendering and interactions for emoji reaction picker (posts).
 */
import { reactToPost } from "../services/postReactions.js";

/**
 * Wire up the reaction picker for a single post detail view.
 * @param {string|number} postId
 * Expects:
 *  - Button:  #reactionBtn
 *  - Picker:  #emojiPicker  with children having class ".emoji"
 */
export function setupReactionPicker(postId) {
    const btn = document.getElementById("reactionBtn");
    const picker = document.getElementById("emojiPicker");
    if (!btn || !picker) return;

    let currentReaction = null;

    // Toggle emoji list
    btn.addEventListener("click", () => {
        picker.classList.toggle("hidden");
    });

    // Select an emoji
    picker.querySelectorAll(".emoji").forEach((emoji) => {
        emoji.addEventListener("click", async () => {
            const symbol = emoji.textContent?.trim();
            if (!symbol) return;

            // Optimistic UI: show chosen emoji on the button
            const prev = btn.textContent;
            btn.textContent = symbol;
            currentReaction = symbol;
            picker.classList.add("hidden");

            btn.disabled = true;

            try {
                const result = await reactToPost(postId, symbol);
                console.log(`✅ Reacted with ${symbol}`, result);
                // Optional: refresh counts here if you display them
                // await fetchPostDetails();
            } catch (error) {
                console.warn(`⚠️ Backend error for ${symbol}`, error);
                // Revert UI on failure
                btn.textContent = prev || "😀 React";
            } finally {
                btn.disabled = false;
            }
        });
    });
}
