import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './components/contexts/UserProvider';
import HomePage from './pages/public/HomePage';
import BookListPage from './pages/public/BookListPage';
import BookDetailPage from './pages/public/BookDetailPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import EventsListPage from './pages/public/EventsListPage';
import EventDetailPage from './pages/public/EventDetailPage';
import ProfilePage from './pages/user/ProfilePage';
import BorrowHistoryPage from './pages/user/BorrowHistoryPage';
import LibraryCardPage from './pages/user/LibraryCardPage';
import NotificationsPage from './pages/user/NotificationsPage';
import WalletPage from './pages/user/WalletPage';
import BookReaderPage from './pages/user/BookReaderPage';
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

// Layout Components
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';
import DashboardPage from './pages/admin/DashboardPage';
import BooksManagementPage from './pages/admin/book/BooksManagementPage';
import AuthorsManagementPage from './pages/admin/AuthorsManagementPage';
import ReadersManagementPage from './pages/admin/ReadersManagementPage';
import ReportsPage from './pages/admin/ReportsPage';
import StaffManagementPage from './pages/admin/SystemUsersPage';
import PublishersManagementPage from './pages/admin/PublishersManagementPage';
import BorrowalsManagementPage from './pages/admin/BorrowalsManagementPage';
import EventManagementPage from './pages/admin/EventManagementPage';
import ReportManagementPage from './pages/admin/ReportManagementPage';
import DocumentManagementPage from './pages/admin/DocumentManagementPage';
import AddBookPage from './pages/admin/book/AddBookPage';
import AdminBookDetailPage from './pages/admin/book/AdminBookDetailPage';
import ImportExcel from "./pages/admin/ImportExcel";
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import TestPDF from './pages/admin/book/TestPDF';
import AddBookContentPage from './pages/admin/book/AddBookContentPage';
const AppContent = () => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');



    return (
        <UserProvider>
            <div className="app-container">
                {!isAdminPage && <Header />}
                <main className="main-content">

                    <Routes>
                        {/* Public Pages */}
                        <Route path="/abc" element={<ImportExcel />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/books" element={<BookListPage />} />
                        <Route path="/books/:id" element={<BookDetailPage />} />
                        <Route path="/events" element={<EventsListPage />} />
                        <Route path="/events/:id" element={<EventDetailPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/test" element={<TestPDF />} />


                        {/* User Pages */}
                        <Route path="/user" element={<UserLayout />}>
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="borrow-history" element={<BorrowHistoryPage />} />
                            <Route path="library-card" element={<LibraryCardPage />} />
                            <Route path="notifications" element={<NotificationsPage />} />
                            <Route path="wallet" element={<WalletPage />} />
                        </Route>

                        {/* Individual User Pages (outside layout) */}
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/borrow-history" element={<BorrowHistoryPage />} />
                        <Route path="/library-card" element={<LibraryCardPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/wallet" element={<WalletPage />} />
                        <Route path="/book-reader/:bookId/:chapter" element={<BookReaderPage />} />

                        {/* Admin Pages */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="categories" element={<CategoryManagementPage />} />
                            <Route path="books" element={<BooksManagementPage />} />
                            <Route path="books/:id" element={<AdminBookDetailPage />} />
                            <Route path="books/add" element={<AddBookPage />} />
                            <Route path="authors" element={<AuthorsManagementPage />} />
                            <Route path="publishers" element={<PublishersManagementPage />} />
                            <Route path="readers" element={<ReadersManagementPage />} />
                            <Route path="borrowals" element={<BorrowalsManagementPage />} />
                            <Route path="events" element={<EventManagementPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route path="user-reports" element={<ReportManagementPage />} />
                            <Route path="documents" element={<DocumentManagementPage />} />
                            <Route path="system-users" element={<StaffManagementPage />} />
                            <Route path="books/add/:id" element={<AddBookContentPage />} />
                            {/* Default redirect to dashboard */}
                            <Route index element={<DashboardPage />} />
                        </Route>
                    </Routes>

                </main>
                {!isAdminPage && <Footer />}
            </div>
        </UserProvider>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App
