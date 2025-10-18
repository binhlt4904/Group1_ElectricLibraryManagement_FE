# Project Frontend File & Folder Structure

This document outlines the standard file and folder organization for the **'Electricity Library'** React application. All new components and pages should adhere to this structure to maintain consistency and ease of maintenance.

## Core Principle

- **Co-location:** Each component or page should have its own folder containing the JSX file, its dedicated CSS module, and any related files (like tests). For simpler components, the JSX and CSS module can reside in the same directory.
- **Role-based Page Separation:** Pages are separated into `public`, `user`, and `admin` directories based on access level.

---

## 1. Pages (`src/pages`)

This directory contains all the main "screens" of the application.

### 1.1. Public Pages (`src/pages/public/`)

Pages accessible to everyone, including guests.

-   **Homepage:**
    -   `src/pages/public/HomePage.jsx`
    -   `src/pages/public/HomePage.module.css`
-   **Login Page:**
    -   `src/pages/public/LoginPage.jsx`
    -   `src/pages/public/LoginPage.module.css`
-   **Registration Page:**
    -   `src/pages/public/RegisterPage.jsx`
    -   `src/pages/public/RegisterPage.module.css`
-   **Book Listing & Search Page:**
    -   `src/pages/public/BookListPage.jsx`
    -   `src/pages/public/BookListPage.module.css`
-   **Book Detail Page:**
    -   `src/pages/public/BookDetailPage.jsx`
    -   `src/pages/public/BookDetailPage.module.css`

### 1.2. User Pages (`src/pages/user/`)

Pages that require a user to be logged in (Role: Reader).

-   **User Profile Page:**
    -   `src/pages/user/ProfilePage.jsx`
    -   `src/pages/user/ProfilePage.module.css`
-   **Borrowing History Page:**
    -   `src/pages/user/BorrowHistoryPage.jsx`
    -   `src/pages/user/BorrowHistoryPage.module.css`
-   **Library Card Management Page:**
    -   `src/pages/user/LibraryCardPage.jsx`
    -   `src/pages/user/LibraryCardPage.module.css`
-   **Notifications Page:**
    -   `src/pages/user/NotificationsPage.jsx`
    -   `src/pages/user/NotificationsPage.module.css`
-   **Wallet & Transactions Page:**
    -   `src/pages/user/WalletPage.jsx`
    -   `src/pages/user/WalletPage.module.css`
-   **Book Reader Interface:**
    -   `src/pages/user/BookReaderPage.jsx`
    -   `src/pages/user/BookReaderPage.module.css`

### 1.3. Admin Pages (`src/pages/admin/`)

The main dashboard and management area for administrators/librarians.

-   **Admin Dashboard:**
    -   `src/pages/admin/DashboardPage.jsx`
    -   `src/pages/admin/DashboardPage.module.css`
-   **Book Management:**
    -   `src/pages/admin/books/AdminBookListPage.jsx`
    -   `src/pages/admin/books/AdminBookCreatePage.jsx`
    -   `src/pages/admin/books/AdminBookEditPage.jsx`
    -   (Each page has its own `.module.css` file in the same directory)
-   **Author Management:**
    -   `src/pages/admin/authors/AdminAuthorManagementPage.jsx`
-   **Publisher Management:**
    -   `src/pages/admin/publishers/AdminPublisherManagementPage.jsx`
-   **Category Management:**
    -   `src/pages/admin/categories/AdminCategoryManagementPage.jsx`
-   **Reader (User) Management:**
    -   `src/pages/admin/readers/AdminReaderListPage.jsx`
    -   `src/pages/admin/readers/AdminReaderDetailPage.jsx`
-   **Borrowal Management:**
    -   `src/pages/admin/borrowals/AdminBorrowalManagementPage.jsx`
-   **Report Management:**
    -   `src/pages/admin/reports/AdminReportManagementPage.jsx`
-   **System User (Staff) Management:**
    -   `src/pages/admin/system-users/AdminSystemUserManagementPage.jsx`

---

## 2. Reusable Components (`src/components`)

This directory contains UI components that are used across multiple pages.

### 2.1. Layouts (`src/components/layouts/`)

Components that define the main structure of the site.

-   **Main Header:**
    -   `src/components/layouts/Header.jsx`
    -   `src/components/layouts/Header.module.css`
-   **Main Footer:**
    -   `src/components/layouts/Footer.jsx`
    -   `src/components/layouts/Footer.module.css`
-   **Admin Layout (Sidebar, Top bar for admin area):**
    -   `src/components/layouts/AdminLayout.jsx`
    -   `src/components/layouts/AdminLayout.module.css`

### 2.2. Commons (`src/components/commons/`)

Generic, self-contained UI elements.

-   **Book Card (for listings):** `src/components/commons/BookCard/`
-   **Custom Button:** `src/components/commons/CustomButton/`
-   **Modal Wrapper:** `src/components/commons/ModalWrapper/`
-   **Data Table:** `src/components/commons/DataTable/`

### 2.3. Contexts (`src/components/contexts/`)

For React Context API state management.

-   **Authentication Context:** `src/components/contexts/AuthContext.jsx`
-   **User Context:** `src/components/contexts/UserContext.jsx`

---

## 3. Global Styles (`src/styles`)

This directory is for styles that affect the entire application.

-   `src/styles/index.css`: Base styles, font imports, CSS resets.
-   `src/styles/variables.css`: CSS variables for colors, fonts, spacing.
-   `src/styles/App.css`: App-level layout styles.

---

## 4. API Services (`src/services` or `src/api`)

This directory centralizes all logic for communicating with the backend API.

-   `src/services/apiClient.js`: Axios instance configuration (base URL, interceptors).
-   `src/services/authService.js`: Functions for login, register, logout.
-   `src/services/bookService.js`: Functions for all book-related CRUD operations.
-   `src/services/userService.js`: Functions for user profile, history, etc.