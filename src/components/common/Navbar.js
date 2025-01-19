import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Rose Petals
                </Link>
                <div className="nav-buttons">
                    <Link to="/" className="nav-button">Home</Link>
                    <Link to="/services" className="nav-button">Services</Link>
                    {user ? (
                        <>
                            <span className="nav-welcome">Welcome, {user.FullName}</span>
                            <button onClick={handleLogout} className="nav-button">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-button">Login</Link>
                            <Link to="/register" className="nav-button">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}