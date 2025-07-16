# Posts Management SPA

A modern, full-featured **Single-Page Application (SPA)** for managing posts in an online platform. This project demonstrates advanced JavaScript concepts including a role-based authentication system, protected client-side routing, full CRUD operations, and a professional, responsive UI/UX. The system allows administrators to manage posts and users, users to create and manage posts, while users can browse, register for, and view their posts, all powered by a `json-server` mock backend.

---

## 📋 Coder Information

- **Name:** Antonio Santiago
- **Clan:** Macondo
- **Email:** santiagor.acarlos@gmail.com
- **GitHub:** [TonyS-dev](https://github.com/TonyS-dev)
- **CodePen:** [TonyS-dev](https://codepen.io/TonyS-dev)
- **ID:** 1192796292

### 📋 Instructions

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the API and development server:**
    The project uses `concurrently` to launch both the `json-server` API and `vite` for the front-end with a single command.
    ```bash
    npm run start:dev
    ```

3.  **Open in your browser:**
    Your browser should automatically open to the application. If not, navigate to:
    - **Frontend (Vite):** `http://localhost:5173`
    - **API (JSON Server):** `http://localhost:3000`

---

### 👤 Default Users
#### - You can register new accounts directly from the login page or as an admin.

-   **Administrator:**
    -   **Email:** `admin@admin.com`
    -   **Password:** `admin123`
    -   **Role:** Admin (can manage users and posts)

-   **User:**
    -   **Email:** `juan.perez@user.com`
    -   **Password:** `juan123`
    -   **Role:** User (can create and manage posts)

-   **User:**
    -   **Email:** `ana.garcia@user.com`
    -   **Password:** `ana123`
    -   **Role:** User (can browse and register for posts)

> **Note:** Passwords are stored as SHA-256 hashes in the database for security.

---

### 🎯 Core Features

-   ✅ **Three-Tier Role-Based Authentication System:**
    -   **Admin:** Full system access - manage users and posts
    -   **User:** Can create, edit, and manage their own posts
    -   **User:** Can browse posts, register for posts, and view their registrations
    -   Secure password handling using SHA-256 hashing
-   ✅ **Persistent Sessions:**
    -   User session is maintained across page reloads using `localStorage`
    -   Secure logout process that clears session data
-   ✅ **Protected Client-Side Routing:**
    -   Routes are protected based on user authentication status and role
    -   Unauthorized access attempts are gracefully handled and redirected
    -   Dynamic route parameters for editing specific posts and users
-   ✅ **Full CRUD Functionality:**
    -   **Users:** Admins can create, read, update, and delete users
    -   **Posts:** Admins and users can create, read, update, and delete posts
    -   **Post Registration:** Users can register/unregister for posts
-   ✅ **Post Likes:** Users can like/unlike posts
    -   Users can view a list of their liked posts
    -   Real-time like count display
-   ✅ **Dynamic & Professional UI/UX:**
    -   A persistent, two-column layout (sidebar + main content) for authenticated users
    -   Clean, modern interface with Font Awesome icons
    -   Responsive design that works on both desktop and mobile devices
    -   Visual feedback for user actions and comprehensive error handling

---

### 🛠️ Technologies Used

-   **HTML5:** Semantic structure for accessibility and clarity
-   **CSS3:** Modern styling with custom design system, Flexbox, Grid, and smooth animations
-   **JavaScript (Vanilla ES6+):** Modular, asynchronous code (`async/await`), ES6 modules, client-side routing, and dynamic DOM manipulation
-   **Vite:** Fast development server and build tool
-   **JSON Server:** Simulates a RESTful API backend for data persistence and CRUD operations
-   **Fetch API:** Handles all asynchronous HTTP requests to the backend
-   **`localStorage`:** Manages session persistence for authenticated users
-   **Font Awesome:** Icon library for enhanced UI

---

### 📁 Project Structure

```
spa-performance-test/
├── index.html                    # Main HTML entry point
├── index.js                      # Main application initializer
├── package.json                  # Project dependencies and scripts
├── db.json                       # JSON Server database file
├── README.md                     # Project documentation
└── app/
    ├── styles/
    │   └── styles.css            # Complete application styling
    └── js/
        ├── api.js                # API request module
        ├── auth.js               # Authentication logic (login, register, logout)
        ├── router.js             # Client-side router with protected routes
        ├── ui.js                 # UI/Layout management module
        └── views/
            ├── login.js          # Login form view
            ├── register.js       # Registration form view
            ├── dashboard.js      # Main dashboard/welcome view
            ├── posts.js         # View for browsing all available posts
            ├── createPost.js    # View for the create post form
            ├── editPost.js      # View for the edit post form
            ├── myPosts.js       # View for a user's interested posts
            ├── manageUsers.js    # View for the user management table (admin)
            ├── createUser.js     # View for the create user form (admin)
            ├── editUser.js       # View for the edit user form (admin)
            └── notFound.js       # View for 404 Not Found errors
```

---

### 🌐 API Endpoints (`json-server`)

**Users:**
-   `GET /users` - Retrieve all users
-   `GET /users/:id` - Retrieve a specific user
-   `GET /users?email=:email` - Find user by email (for authentication)
-   `POST /users` - Create a new user
-   `PATCH /users/:id` - Update a user's information
-   `DELETE /users/:id` - Delete a user

**Posts:**
-   `GET /posts` - Retrieve all posts
-   `GET /posts/:id` - Retrieve a specific post
-   `POST /posts` - Create a new post
-   `PATCH /posts/:id` - Update an post's information
-   `DELETE /posts/:id` - Delete an post

---

### 🔄 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run start:api` - Start JSON Server API on port 3000
- `npm run start` - Start both API and dev server concurrently
- `npm run start:dev` - Start both with colored output and prefixes

---

### 📝 Code Quality & Architecture

-   **Modular Design:** The code is organized into logical modules (api, auth, router, ui, views), following the Single Responsibility Principle
-   **Asynchronous JavaScript:** Extensive use of `async/await` for clean and readable asynchronous code
-   **Separation of Concerns:** The application logic is clearly separated from the presentation (DOM manipulation) with a dedicated UI module
-   **Clean & Readable Code:** Well-commented functions and consistent coding style throughout the project
-   **Robust Error Handling:** The application handles API errors, authentication failures, and user input validation gracefully
-   **ES6 Modules:** Modern JavaScript module system for better code organization and dependency management
-   **Protected Routing:** Client-side route protection based on authentication status and user roles

---

**Author:** Antonio Santiago
