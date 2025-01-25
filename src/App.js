import './App.css';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ServiceList from './components/Services/ServiceList';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { AuthProvider } from './components/Auth/AuthContext';
import BookingPage from './components/Booking/BookingPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminCalendar from './components/Admin/AdminCalendar';
import AdminProtectedRoute from './components/Admin/AdminProtectedRoute';
import { AdminProvider } from './components/Admin/AdminContext';
import AdminNavbar from './components/Admin/AdminNavbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <Routes>
                <Route path="login" element={<AdminLogin />} />
                <Route path="calendar" element={
                  <AdminProtectedRoute>
                    <>
                      <AdminCalendar />
                    </>
                  </AdminProtectedRoute>
                } />
              </Routes>
            } />

            {/* Regular Routes */}
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<div>Home Page</div>} />
                  <Route path="/services" element={<ServiceList />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/booking" element={<BookingPage />} />
                </Routes>
              </MainLayout>
            } />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;