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

### Phase 4: 🚀 Final UI Polish

Review and finalize the entire user interface.

-   [ ] **Consistency Check**:
    -   [ ] Review the entire site to ensure colors, fonts, spacing, and border-radius are applied consistently.
-   [ ] **Interaction States**:
    -   [ ] Ensure all buttons, links, and inputs have clear `hover`, `focus`, `active`, and `disabled` states.
-   [ ] **Responsiveness Review**:
    -   [ ] Open DevTools and re-check every page on common screen sizes (e.g., 375px, 768px, 1024px, 1440px).
-   [ ] **Accessibility (A11y) Polish**:
    -   [ ] Add `aria-label` to icon-only buttons.
    -   [ ] Ensure form inputs are associated with their `label`s.