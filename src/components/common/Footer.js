import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
export default function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Rose Petals Beauty Salon. All rights reserved.</p>
                <p>Follow us on social media!</p>
                <ul className="social-media">
                    <a href="https://www.facebook.com/p/Rose-Petals-Beauty-Salon-100063509173399/"><FaFacebook size={30}/></a>
                    <a href="#"><FaInstagram size={30}/></a>
                </ul>
            </div>
        </footer>
    );
}