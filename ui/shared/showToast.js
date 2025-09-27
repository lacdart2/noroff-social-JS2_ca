/**
 * Display a toast message at the top-right corner
 * @param {string} message - The message to display
 * @param {'success' | 'error' | 'info'} type - Type of message (affects color)
 * @param {number} duration - Duration in ms before disappearing
 */
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.textContent = message;

  toast.className = `
    fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-sm font-medium
    ${type === 'success' ? 'bg-green-500 text-white' : ''}
    ${type === 'error' ? 'bg-red-500 text-white' : ''}
    ${type === 'info' ? 'bg-blue-500 text-white' : ''}
    animate-fade-in
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('animate-fade-out');
    setTimeout(() => toast.remove(), 500);
  }, duration);
}
