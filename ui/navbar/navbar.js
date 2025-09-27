/**
 * Injects a reusable nav bar into all protected pages
 * Shows user name, avatar, and links to site areas
 */


import { renderNotificationsList, checkNotifications, markAllAsSeen } from "../../services/notifications/notifications.js";
import { load, save } from "../../utils/storage.js";

export function renderNavbar(containerId = "navbarContainer") {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
<nav class=" text-gray-200 shadow-lg px-4 py-2 w-full m-0 relative">
  <div class="flex flex-col md:flex-row md:items-center md:justify-between w-full">
    <div class="flex flex-wrap items-center justify-between w-full gap-4 md:flex-nowrap md:gap-6">
      <a href="/pages/feed/index.html"
         class="logo text-xl font-bold text-purple-500 hover:text-purple-400">
        MySocialApp
      </a>

      <div id="menuLinks"
           class="flex flex-row gap-4 md:gap-6">
        <a href="/pages/feed/index.html" class="flex items-center gap-1 text-gray-400 hover:text-purple-300">
          Home
        </a>
        <a href="/pages/posts/index.html" class="flex items-center gap-1 text-gray-400 hover:text-purple-300">
          Posts
        </a>
        <a href="/pages/profiles/index.html" class="flex items-center gap-1 text-gray-400 hover:text-purple-300">
          Profiles
        </a>
      </div>

      <div class="relative notifications-container">
        <button id="notificationBtn" class="relative rounded-full p-1 hover:bg-gray-800">
          <span id="notificationCount"
                class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] px-1 leading-none hidden z-10">
            0
          </span>
          <span id="notificationBellIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="icon">
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
              <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
            </svg>
          </span>
        </button>

        <div id="notificationList"
             class="hidden flex-col absolute right-0 top-full mt-2 w-80
                    bg-gray-800 border border-gray-700 shadow-xl rounded-lg text-sm max-h-96 overflow-auto
                    z-50 opacity-0 pointer-events-none transition-all duration-200">
        </div>
      </div>
    </div>

    <div id="userMenuWrapper"
         class="flex justify-center mt-4 md:mt-0 md:ml-auto relative">
      <button id="userMenuBtn"
      class="flex items-center justify-between gap-2 rounded-full px-2 w-[160px] md:w-[180px] py-1 hover:bg-gray-800 transition ring-1 ring-gray-800 focus:outline-none pr-4"
              aria-haspopup="true" aria-expanded="false" aria-controls="userMenu">
          <img src="${user?.avatar?.url || 'https://placehold.co/36x36?text=U'}"
             alt="${user?.avatar?.alt || user?.name || 'avatar'}"
             class="w-9 h-9 rounded-full object-cover border border-gray-700" />
          <span id="navUserName" class="hidden sm:inline text-gray-200 text-sm font-medium">
            ${user?.name || ''}
          </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
             stroke="currentColor" stroke-width="2" class="text-gray-400">
          <path d="M6 9l6 6l6-6"/>
        </svg>
      </button>

      <div id="userMenu"
          class="hidden absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[80%]
            md:left-auto md:translate-x-0 md:right-0 md:w-56
            rounded-lg border border-gray-700 bg-gray-800 shadow-xl
            opacity-0 pointer-events-none transition-all duration-150 z-50
           role="menu" aria-labelledby="userMenuBtn">
           <ul class="p-2 w-full" role="none">
          <li class="w-full my-2">
            <a href="/pages/profile/index.html"
               class="flex items-center gap-2 w-full rounded px-3 py-2 text-sm text-gray-200 hover:bg-gray-700">
              My Profile
            </a>
          </li>
          <li class="w-full my-2">
            <a href="/pages/posts/index.html"
               class="flex items-center gap-2 w-full rounded px-3 py-2 text-sm text-gray-200 hover:bg-gray-700">
              My Posts
            </a>
          </li>
          <li class="my-1 border-t border-gray-700 w-full"></li>
          <li class="w-full my-2">
            <button id="logoutBtn" type="button"
                    class="flex items-center justify-center gap-2 w-full rounded px-3 py-2 text-sm text-red-400 hover:bg-red-800">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>

  </div>
</nav>
`

  updateBellBadgeAndIcon();

  const bell = document.getElementById("notificationBtn");
  const username = load("user")?.name;

  bell.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const list = document.getElementById("notificationList");
    const isVisible = !list.classList.contains("opacity-100");

    if (isVisible) {

      const notes = await checkNotifications(username);
      renderNotificationsList(notes);
      await markAllAsSeen(username);

      save("unseenNotifications", 0);
      updateBellBadgeAndIcon();
    }

    list.classList.toggle("hidden", !isVisible);
    list.classList.toggle("opacity-100", isVisible);
    list.classList.toggle("pointer-events-auto", isVisible);
    list.classList.toggle("opacity-0", !isVisible);
    list.classList.toggle("pointer-events-none", !isVisible);
  });

  const userMenuBtn = document.getElementById("userMenuBtn");
  const userMenu = document.getElementById("userMenu");

  userMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !userMenu.classList.contains("opacity-100");
    userMenu.classList.toggle("hidden", !open);
    userMenu.classList.toggle("opacity-100", open);
    userMenu.classList.toggle("pointer-events-auto", open);
    userMenu.classList.toggle("opacity-0", !open);
    userMenu.classList.toggle("pointer-events-none", !open);
  });

  window.addEventListener("click", (e) => {
    const list = document.getElementById("notificationList");
    if (userMenu && !userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
      userMenu.classList.add("hidden", "opacity-0", "pointer-events-none");
      userMenu.classList.remove("opacity-100", "pointer-events-auto");
    }
  });

  window.addEventListener("click", (event) => {
    const bell = document.getElementById("notificationBtn");
    const list = document.getElementById("notificationList");

    if (!bell.contains(event.target) && !list.contains(event.target)) {
      list.classList.add("hidden", "opacity-0", "pointer-events-none");
      list.classList.remove("opacity-100", "pointer-events-auto");
    }
  });

  function updateBellBadgeAndIcon() {
    const bellIcon = document.getElementById("notificationBellIcon");
    const badge = document.getElementById("notificationCount");
    const unseenCount = load("unseenNotifications") || 0;

    if (unseenCount > 0) {
      badge.textContent = unseenCount;
      badge.classList.remove("hidden");

      bellIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="currentColor"
        class="icon icon-tabler icon-tabler-bell-filled">
        <path d="M10 2a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
      </svg>`;
    } else {
      badge.classList.add("hidden");
      bellIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-bell">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
      </svg>`;
    }
  }

  if (window.notificationInterval) clearInterval(window.notificationInterval);


  window.notificationInterval = setInterval(async () => {
    await checkNotifications(username);
    updateBellBadgeAndIcon();
  }, 5000);


  updateBellBadgeAndIcon();


}


