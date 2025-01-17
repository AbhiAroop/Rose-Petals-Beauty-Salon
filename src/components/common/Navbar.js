import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav>
            <ul>
                <Link to="/services" className="nav-link">Services</Link>
            </ul>
        </nav>
    );
}