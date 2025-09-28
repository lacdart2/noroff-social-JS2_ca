# MySocialApp

A modern social networking application built as part of my Noroff JS2 assignment.  
The project demonstrates **authentication, profiles, posts, comments, reactions, notifications, and UI/UX best practices** using the **Noroff Social API**.

---

## Features

- **Authentication**

     - Register new accounts
     - Login & logout with token storage
     - Auth guard on protected pages

- **Profiles**

     - View user details (bio, avatar, banner)
     - Edit profile with modal form
     - Show previews of posts, followers, and following
     - Follow/unfollow other users

- **Posts**

     - Create, read, update, and delete posts (CRUD)
     - Post details page with media, comments, and reactions
     - Reaction system with live feedback
     - Comment system with delete + reply support
     - Pagination and search by title or tag
     - Post previews in profile

- **Notifications**

     - Dropdown bell with red badge
     - Notifications for reactions, comments, and follows
     - Polling every 60s for updates
     - Toggle filled/outline bell states

- **UI/UX**
     - Fully responsive with **TailwindCSS**
     - Dark theme by default
     - Floating "Create Post" button with tooltip
     - Breadcrumbs for navigation
     - Sticky navbar with dropdown menu
     - Modern profile stats cards (Posts, Followers, Following)
     - Clean modals and consistent form styling

---

## Folder Structure

JS2-CA-lakhdar_hafsi-092025/
│
├── images/  
│  
│
├── pages/  
│ ├── auth/
│ │ ├── login/
│ │ │ ├── index.html
│ │ │ └── index.js
│ │ └── register/
│ │ ├── index.html
│ │ └── index.js
│ │
│ ├── feed/ # Main feed (Home/Feed)
│ │ ├── index.html
│ │ └── index.js
│ │
│ ├── posts/ # All posts
│ │ ├── index.html
│ │ └── index.js
│ │
│ ├── post/ # Single post CRUD
│ │ ├── create/
│ │ │ ├── index.html
│ │ │ └── index.js
│ │ ├── detail/
│ │ │ ├── index.html
│ │ │ └── index.js
│ │ └── edit/
│ │ ├── index.html
│ │ └── index.js
│ │
│ ├── profile/ # Single profile page
│ │ ├── index.html
│ │ └── index.js
│ │
│ └── profiles/ # All users page
│ ├── index.html
│ └── index.js
│
├── services/ # API + business logic (fetch, posts, profiles, notifications…)
│
├── ui/ # UI components (navbar, modals, toasts, loaders, etc.)
│
├── utils/ # Helpers (storage, authGuard, apiHelpers, constants…)
│
├── index.html # Landing page
├── style.css # Global styles
├── tailwind.config.js # Tailwind config
└── README.md # Documentation

---

## Tech Stack

- **HTML5**
- **Vanilla JavaScript (ES Modules)**
- **TailwindCSS** (via CDN)
- **Noroff Social API** (`https://v2.api.noroff.dev`)

---

## How to Run

1. Clone the repository or download the project folder.
2. Open any page (e.g., `/pages/auth/login/index.html`) in a browser.
3. Use a **local server** for smooth navigation (e.g., VSCode Live Server extension).
4. Log in with your Noroff Social API account (or register a new one).

---

## Completed Work

- Full authentication system (login, register, logout, auth guard).
- Profile pages with bio, avatar, banner, posts, followers/following.
- CRUD for posts with reactions and comments.
- Notifications dropdown with live updates.
- Floating Create Post button + tooltip.
- Pagination, search, breadcrumbs, and sticky navbar.
- Responsive modern dark-themed UI using Tailwind.

---

## Future Improvements

- Add persistent notification history.
- Improve accessibility (ARIA roles, keyboard nav).
- Add image upload instead of URL-only media.
- Refactor previews (posts, followers, following) into a shared reusable component.
- Migrate to a **Next.js** setup for SEO and performance.

---

## Known Issues

- None reported at the moment
- (not sure if notifications may load older notification sometimes)

---

## Author

**Lakhdar Hafsi**  
Front end developer student at Noroff.  
lakhaf18774@stud.noroff.no

---
