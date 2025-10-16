import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiArrowUp } from 'react-icons/fi';
import { FiBookOpen } from 'react-icons/fi';
import '../../styles/Footer.css'; // We will create this CSS file next

const ModernFooter = () => {
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Column 1: Logo and About */}
                    <div className="footer-col">
                         <a href="#" className="logo">
                            <FiBookOpen className="logo-icon" />
                            <span className="logo-text">Public Library</span>
                        </a>
                        <p className="footer-about">
                            Fostering a vibrant community of readers, learners, and creators. Explore a world of knowledge with us.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><a href="#">Events Calendar</a></li>
                            <li><a href="#">Reserve a Computer</a></li>
                            <li><a href="#">Get a Library Card</a></li>
                            <li><a href="#">Support the Library</a></li>
                            <li><a href="#">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Contact Us</h4>
                        <p>123 Library Lane<br />Knowledge City, ST 12345</p>
                        <p>
                            <a href="tel:123-456-7890">(123) 456-7890</a><br/>
                            <a href="mailto:info@publiclibrary.com">info@publiclibrary.com</a>
                        </p>
                    </div>

                    {/* Column 4: Social Media */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Follow Us</h4>
                        <div className="social-icons">
                            <a href="#" aria-label="Facebook"><FiFacebook /></a>
                            <a href="#" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" aria-label="Instagram"><FiInstagram /></a>
                            <a href="#" aria-label="YouTube"><FiYoutube /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Public Library. All Rights Reserved.</p>
                </div>
            </div>
            <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">
                <FiArrowUp />
            </button>
        </footer>
    );
};

export default ModernFooter;
