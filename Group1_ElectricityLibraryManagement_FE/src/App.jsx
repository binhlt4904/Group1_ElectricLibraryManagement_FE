import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import BookListPage from './pages/public/BookListPage';
import BookDetailPage from './pages/public/BookDetailPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import BorrowHistoryPage from './pages/user/BorrowHistoryPage';
import LibraryCardPage from './pages/user/LibraryCardPage';
import NotificationsPage from './pages/user/NotificationsPage';
import WalletPage from './pages/user/WalletPage';
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

// Admin Components
import AdminLayout from './components/layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import BooksManagementPage from './pages/admin/BooksManagementPage';
import AuthorsManagementPage from './pages/admin/AuthorsManagementPage';
import ReadersManagementPage from './pages/admin/ReadersManagementPage';
import ReportsPage from './pages/admin/ReportsPage';
import SystemUsersPage from './pages/admin/SystemUsersPage';

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleNavigate = (page) => {
    console.log('Navigate to:', page);
  };

  return (
    <div className="app-container">
      {!isAdminPage && <Header onNavigate={handleNavigate} myListCount={0} />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Pages */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/borrow-history" element={<BorrowHistoryPage />} />
          <Route path="/library-card" element={<LibraryCardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/wallet" element={<WalletPage />} />

          {/* Admin Pages */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="books" element={<BooksManagementPage />} />
            <Route path="authors" element={<AuthorsManagementPage />} />
            <Route path="readers" element={<ReadersManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="system-users" element={<SystemUsersPage />} />
            {/* Default redirect to dashboard */}
            <Route index element={<DashboardPage />} />
          </Route>
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
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
