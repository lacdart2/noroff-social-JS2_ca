/**
 * Render a reusable search input field with custom clear button.
 * @param {HTMLElement} mountEl - DOM element to insert the search input into
 * @param {Object} options
 * @param {string} options.placeholder - Input placeholder text
 * @param {function(string):void} options.onInput - Called when input value changes
 * @param {string} [options.id] - Optional input ID
 */
export function renderSearchBar(mountEl, { placeholder, onInput, id = "searchInput" }) {
  mountEl.innerHTML = `
    <header class="flex items-center gap-3 mb-4">
      <div class="relative w-80 mt-4">
        <input id="${id}" type="search"
          placeholder="${placeholder}"
          class="w-full bg-gray-800 rounded-2xl px-3 py-2 pr-10 text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-purple-800 outline-none shadow text-sm"
          aria-label="Search" />
        <button type="button"
          id="${id}-clear"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 hidden">
         <svg  xmlns="http://www.w3.org/2000/svg"  width="20"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </button>
      </div>
    </header>
  `;

  const input = document.getElementById(id);
  const clearBtn = document.getElementById(`${id}-clear`);

  input.addEventListener("input", (e) => {
    const value = e.target.value.trim();
    clearBtn.classList.toggle("hidden", value.length === 0);
    onInput(value);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.classList.add("hidden");
    input.focus();
    onInput("");
  });
}
