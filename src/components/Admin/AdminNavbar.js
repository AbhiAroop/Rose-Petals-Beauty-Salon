import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';

const AdminNavbar = () => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        <div className="admin-nav-left">
          <h1>Admin Dashboard</h1>
          <span className="admin-welcome">Welcome, {admin?.name}</span>
        </div>
        <div className="admin-nav-cards">
          <div className="admin-card" onClick={() => navigate('/admin/calendar')}>
            <span className="card-icon">📅</span>
            <span className="card-title">Calendar</span>
          </div>
          <div className="admin-card logout" onClick={handleLogout}>
            <span className="card-icon">🚪</span>
            <span className="card-title">Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;