import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAdmin } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', { email: formData.email }); // Debug log
      
      const response = await fetch('https://rose-petals-backend.vercel.app/api/admin/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        })
      });
  
      const data = await response.json();
      console.log('Server response:', data); // Debug log
  
      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }
  
      if (!data.token) {
        throw new Error('No token received from server');
      }
  
      // Store the complete admin data including name and staffId
      const adminData = {
        token: data.token,
        staffId: data.staffId,
        name: data.name,
        email: data.email,
        isAuthenticated: true
      };
  
      // Set admin data in context
      setAdmin(adminData);
      
      // Debug log to verify data
      console.log('Login successful, admin data stored:', {
        ...adminData,
        token: `${adminData.token.substring(0, 10)}...`
      });
      
      navigate('/admin/calendar');
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Rose Petals Salon</h1>
          <h2>Staff Login</h2>
        </div>
        
        {error && (
          <div className="admin-login-error">
            <i className="error-icon">⚠</i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter your email"
              className="admin-input"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter your password"
              className="admin-input"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;