/**
 * Render a reusable search input field.
 * @param {HTMLElement} mountEl - DOM element to insert the search input into
 * @param {Object} options
 * @param {string} options.placeholder - Input placeholder text
 * @param {function(string):void} options.onInput - Called when input value changes
 * @param {string} [options.id] - Optional input ID
 */
export function renderSearchBar(mountEl, { placeholder, onInput, id = "searchInput" }) {
  mountEl.innerHTML = `
    <header class="flex items-center gap-3 mb-4">
      <input id="${id}" type="search"
        placeholder="${placeholder}"
        class="w-full bg-gray-800  rounded px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-purple-800 outline-none"
        aria-label="Search" />
    </header>
  `;

  const input = document.getElementById(id);
  input.addEventListener("input", (e) => {
    onInput(e.target.value.trim());
  });
}
