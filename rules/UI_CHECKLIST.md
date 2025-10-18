# ✅ UI Checklist: Electricity Library Frontend

The purpose of this checklist is to track the UI completion progress for all screens and components. An item is considered "done" when it is built in React with mock data and displays correctly according to the design across various screen sizes.

---

### Phase 0: 🏛️ Foundation & Global UI

Establish the foundational elements that will be used throughout the entire website.

-   [X] **Project Setup for UI**
    -   [X] Install React, React-Bootstrap, and an icon library (e.g., `react-bootstrap-icons`).
    -   [X] Structure the UI directory according to `FILE_STRUCTURE.md`.
-   [X] **Global Styles & Design System**
    -   [X] Import Google Fonts (Poppins, Roboto) into `index.css`.
    -   [X] Define the entire Color Palette in a global CSS file or variables.
    -   [X] Set up basic styles for typography (headings, body text).
-   [X] **Core Layout Components**
    -   [X] **`Header.jsx`**: Fully build the Header UI, including the logo, search bar, and navigation menus.
    -   [X] **`Footer.jsx`**: Fully build the Footer UI, including the 4-column layout, links, and contact information.
    -   [X] **Responsiveness**: Ensure the `Header` (hamburger menu) and `Footer` (stacked columns) display correctly on mobile.

---

### Phase 1: 🌐 Public-Facing Pages UI

Build the user interface for public-facing screens.

-   [X] **Homepage (`HomePage.jsx`)**
    -   [X] Build the Hero Banner with a background image, title, and CTA button.
    -   [X] Build the "What's Happening" section with a 3-card layout.
    -   [X] Build the "Visit Our Branches" section with a 2-column layout (text and image).
    -   [X] Build the "Stay in Touch" section with a newsletter form.
    -   [X] **Responsiveness**: Ensure all sections stack and scale properly on mobile.
-   [ ] **Book Listing & Search Page (`BookListPage.jsx`)**
    -   [ ] Build the search bar and filters (dropdowns for Category, Author).
    -   [ ] Build the `Grid` to display `BookCard`s.
    -   [ ] Create a reusable `BookCard.jsx` component that displays the cover image, book title, and author.
    -   [ ] Build the `Pagination.jsx` component.
    -   [ ] **Responsiveness**: The card grid should change the number of columns (e.g., 4 on Desktop, 2 on Tablet, 1 on Mobile).
-   [ ] **Book Detail Page (`BookDetailPage.jsx`)**
    -   [ ] Build the 2-column layout (cover image on the left, information on the right).
    -   [ ] Style the metadata elements (title, author, publisher).
    -   [ ] Build the action buttons ("Borrow", "Add to Wishlist").
    -   [ ] Build and style the `<Tabs>` component for (Description, Reviews, Contents).
    -   [ ] **Responsiveness**: The columns should stack on top of each other on mobile.
-   [ ] **Authentication Forms**
    -   [ ] Build the UI for the `LoginPage.jsx` form with input fields and buttons.
    -   [ ] Build the UI for the `RegisterPage.jsx` form.
    -   [ ] **Responsiveness**: Ensure the forms display well on small screens.

---

### Phase 2: 👤 Authenticated User Pages UI

Build the UI for screens accessible to logged-in users.

-   [ ] **User Profile Page (`ProfilePage.jsx`)**
    -   [ ] Build the layout to display the user's avatar and personal information.
    -   [ ] Build the forms for editing information (can be in a Modal or on a separate page).
-   [ ] **Borrowing History Page (`BorrowHistoryPage.jsx`)**
    -   [ ] Build the UI for status filter buttons.
    -   [ ] Build the UI for the `<Table>` displaying borrowing history.
    -   [ ] Style the status `<Badge>`s (Borrowed, Returned, Overdue) with corresponding colors.
    -   [ ] **Responsiveness**: The table should be horizontally scrollable on small screens.
-   [ ] **Library Card Page (`LibraryCardPage.jsx`)**
    -   [ ] Design and build the UI to display a virtual library card (visual representation).
    -   [ ] Build the button and form (can be a modal) to request a renewal.
-   [ ] **Wallet & Notifications Pages**
    -   [ ] Build the UI for `WalletPage.jsx` to display the balance and transaction history table.
    -   [ ] Build the UI for `NotificationsPage.jsx` to display a list of notifications.

---

### Phase 3: ⚙️ Admin / Librarian Pages UI

Build the UI for the admin area. The style can be more utilitarian and function-focused.

-   [ ] **Admin Layout (`AdminLayout.jsx`)**
    -   [ ] Build the `Sidebar.jsx` component with a navigation menu for the admin area.
    -   [ ] Build the main layout with a sidebar on the left and a content area on the right.
    -   [ ] **Responsiveness**: The sidebar should be collapsible or hidden on mobile.
-   [ ] **Dashboard (`DashboardPage.jsx`)**
    -   [ ] Build statistic cards (stat cards) to display key numbers.
    -   [ ] Build the UI for simple charts (if any).
-   [ ] **Management Pages (Book, Author, etc.)**
    -   [ ] **List View**: Build a standard UI for list pages:
        -   Page title and "Add New" button.
        -   Search and filter area.
        -   `<Table>` with appropriate columns.
        -   "Actions" column with Edit/Delete icons and tooltips.
    -   [ ] **Form View (Create/Edit)**: Build a standard UI for forms:
        -   Layout for input fields (`<Form.Control>`, `<Form.Select>`).
        -   "Save" and "Cancel" buttons.
-   [ ] **Apply Consistent UI for all Admin Pages**
    -   [ ] `AdminBookListPage.jsx` and related forms.
    -   [ ] `AdminAuthorManagementPage.jsx`.
    -   [ ] `AdminPublisherManagementPage.jsx`.
    -   [ ] `AdminReaderListPage.jsx`.
    -   [ ] ... (and other management pages).

---

### Phase 4: 🏗️ Build Missing Screens & Components

**Objective:** To build all remaining UI components from scratch to achieve feature completeness according to the ERD.

-   [ ] **Create Event-Related Pages (Public):**
    -   [ ] **`EventsListPage.jsx`**: Build the page to display a list/calendar of upcoming events. Include UI for search and filter options.
    -   [ ] **`EventDetailPage.jsx`**: Build the page to show detailed information for a single event.

-   [ ] **Create Core User Experience Pages (User):**
    -   [ ] **`BookReaderPage.jsx`**: Build the book reading interface. It must display the chapter title, the main content, and have "Previous/Next Chapter" navigation buttons.

-   [ ] **Create Admin Layout & Management Pages (Admin):**
    -   [ ] **`AdminLayout.jsx`**: Build the main layout wrapper for the admin area, including a persistent `Sidebar.jsx` component.
    -   [ ] **`AdminPublishersPage.jsx`**: Build the CRUD interface for managing publishers.
    -   [ ] **`AdminBorrowalsPage.jsx`**: Build the interface for librarians to manage and view borrowing records.
    -   [ ] **`AdminEventManagementPage.jsx`**: Build the CRUD interface for managing events.
    -   [ ] **`AdminReportManagementPage.jsx`**: Build the interface to view and manage user-submitted reports.
    -   [ ] **`AdminDocumentManagementPage.jsx`**: Build the interface for managing internal documents.

---

### Phase 5: 🔍 Refinement & Final Polish

**Objective:** To audit the entire application, integrate detailed data attributes from the ERD into the UI, and polish the user experience to a professional standard.

-   [ ] **Attribute-Level Integration Audit:**
    -   [ ] **`BookDetailPage.jsx` Review:**
        -   [ ] Ensure `Book.imported_date` and `Book.Categoryname` are displayed.
        -   [ ] Ensure 'Contents' tab lists all `BookContent.chapter` and `BookContent.title` as functional links.
        -   [ ] Ensure 'Reviews' tab displays `Review.reviewer_id`'s name and `Review.note`.
        -   [ ] Ensure "Report an Issue" functionality is present.
    -   [ ] **`ProfilePage.jsx` Review:**
        -   [ ] Ensure `Reader.reader_code` and `Reader.major` are displayed.
        -   [ ] Implement UI changes based on `Account.role` (e.g., show "Admin Panel" link).
    -   [ ] **`LibraryCardPage.jsx` Review:**
        -   [ ] Ensure `card_number`, `issue_date`, `expiry_date`, and `status` are all visually represented.
    -   [ ] **Admin Forms Review:**
        -   [ ] Audit all Create/Edit forms to ensure they include input fields for all necessary attributes in their respective ERD tables.

-   [ ] **Global Polish & Consistency:**
    -   [ ] **Consistency Check**: Review the entire application to ensure consistent use of colors, fonts, spacing, and component styles.
    -   [ ] **Interaction States**: Ensure all interactive elements (buttons, links, inputs) have clear `hover`, `focus`, `active`, and `disabled` states.
    -   [ ] **Responsiveness Review**: Re-check every single page on common screen sizes (e.g., 375px, 768px, 1024px, 1440px) to fix any layout issues.
    -   [ ] **Accessibility (A11y) Polish**: Finalize accessibility features like `aria-label`s for icon buttons and proper `label`-`input` associations in forms.