import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaUserCog } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="copyright">&copy; {new Date().getFullYear()} Rose Petals Beauty Salon. All rights reserved.</p>
                <p className="social-text">Follow us on social media!</p>
                <div className="social-media">
                    <a href="https://www.facebook.com/p/Rose-Petals-Beauty-Salon-100063509173399/" 
                       className="social-link">
                        <FaFacebook size={25}/>
                    </a>
                    <a href="#" className="social-link">
                        <FaInstagram size={25}/>
                    </a>
                    <Link 
                        to="/admin/login" 
                        className="admin-link"
                        title="Admin Access">
                        <FaUserCog size={16} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}