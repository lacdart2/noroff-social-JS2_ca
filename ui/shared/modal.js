/**
 * @fileoverview Generic confirmation modal UI
 * Usage: showModal({ message, onConfirm, onCancel })
 */

export function showModal({ message = "Are you sure?", onConfirm, onCancel }) {
  const existing = document.getElementById("customModal");
  if (existing) existing.remove();

  const modalHTML = `
    <div id="customModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h2 class="text-xl font-semibold mb-4">Confirm Action</h2>
        <p class="text-gray-600 mb-6">${message}</p>
        <div class="flex justify-center gap-4">
          <button id="modalCancelBtn" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
          <button id="modalConfirmBtn" class="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded">Confirm</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Hook up events
  document.getElementById("modalCancelBtn").addEventListener("click", () => {
    document.getElementById("customModal").remove();
    if (typeof onCancel === "function") onCancel();
  });

  document.getElementById("modalConfirmBtn").addEventListener("click", () => {
    document.getElementById("customModal").remove();
    if (typeof onConfirm === "function") onConfirm();
  });
}
