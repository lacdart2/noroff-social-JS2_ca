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
        <nav class="bg-gray-900 text-gray-200 shadow-lg p-4 px-4 flex justify-between items-center m-0">
          <a href="/pages/feed/index.html" class="text-xl font-bold text-blue-500 hover:text-blue-400">
            MySocialApp
          </a>
          <div class="flex items-center justify-start gap-6 px-4">
            <a href="/pages/feed/index.html" class="flex items-center gap-1 text-gray-400 hover:text-blue-400">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-home"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>
              <span>Home</span>
            </a>
            <a href="/pages/posts/index.html" class="flex items-center gap-1 text-gray-400 hover:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" class="icon"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              <span>Posts</span>
            </a>
            <a href="/pages/profiles/index.html" class="flex items-center gap-1 text-gray-400 hover:text-blue-400">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-users"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
                    <span>Profiles</span>
                  </a>
            <div class="relative">
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
                class="hidden flex flex-col absolute right-0 top-full mt-2 w-80
                      bg-gray-800 border border-gray-700 shadow-xl rounded-lg text-sm max-h-96 overflow-auto
                      z-50 opacity-0 pointer-events-none transition-all duration-200">
              </div>
            </div>
        <div class="relative" id="userMenuWrapper">
          <button id="userMenuBtn"
            class="flex items-center gap-2 rounded-full pr-3 hover:bg-gray-800 transition ring-1 ring-gray-800 hover:outline-none focus:outline-none focus:ring-1 focus:ring-gray-800"
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
              class="hidden absolute right-0 top-8 mt-2 w-56 rounded-lg border border-gray-700 bg-gray-800 shadow-xl
                      opacity-0 pointer-events-none transition-all duration-150 z-50"
              role="menu" aria-labelledby="userMenuBtn">
            <ul class="p-2 w-full" role="none">
          <li role="none" class="w-full my-2">
            <a href="/pages/profile/index.html"
              role="menuitem" tabindex="-1"
              class="flex items-center gap-2 w-full border border-transparent rounded px-3 py-2
                      text-sm text-gray-200 focus:outline-none
                      hover:rounded-lg hover:shadow-md hover:bg-gray-700 hover:border-gray-600">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" /><path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" /></svg>
              <span>My Profile</span>
            </a>
          </li>

          <li role="none" class="w-full my-2">
            <a href="/pages/posts/index.html"
              role="menuitem" tabindex="-1"
              class="flex items-center gap-2 w-full border border-transparent rounded px-3 py-2
                      text-sm text-gray-200 focus:outline-none
                      hover:rounded-lg hover:shadow-md hover:bg-gray-700 hover:border-gray-600">
              <!-- Tabler: article -->
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                  stroke="currentColor" stroke-width="2">
                <path d="M3 4h18v16H3z"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h10"/>
              </svg>
              <span>My Posts</span>
            </a>
          </li>
          <li role="none" class="my-1 border-t border-gray-700 w-full"></li>
          <li role="none" class="w-full my-2">
            <button id="logoutBtn" type="button"
                    role="menuitem" tabindex="-1"
                    class="flex items-center justify-center gap-2 w-full border border-transparent rounded px-3 py-2
                          text-sm text-red-400
                          hover:rounded-lg hover:shadow-md hover:bg-red-800 hover:border-red-600">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-logout-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" /><path d="M15 12h-12l3 -3" /><path d="M6 15l-3 -3" /></svg>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
   </div>
  </nav>
`;


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
