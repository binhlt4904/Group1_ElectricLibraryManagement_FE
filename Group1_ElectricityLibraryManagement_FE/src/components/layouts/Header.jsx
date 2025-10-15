import React, { useState } from 'react';
import { FiSearch, FiMenu, FiX, FiBookOpen } from 'react-icons/fi';
import '../../styles/Header.css'; // We will create this CSS file next

const ModernHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', link: '#' },
        { name: 'Events', link: '#' },
        { name: 'Collections', link: '#', dropdown: ['New Arrivals', 'eBooks & Audio', 'Databases'] },
        { name: 'Services', link: '#', dropdown: ['For Kids', 'For Teens', 'For Adults'] },
        { name: 'Branches', link: '#' },
        { name: 'About', link: '#' },
    ];

    return (
        <header className="header-sticky">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="container top-bar-content">
                    <a href="#" className="logo">
                        <FiBookOpen className="logo-icon" />
                        <span className="logo-text">Public Library</span>
                    </a>

                    <div className="search-bar-desktop">
                        <input type="text" placeholder="Search the catalogue..." />
                        <button><FiSearch /></button>
                    </div>

                    <div className="quick-links">
                        <a href="#">Join</a>
                        <a href="#">Login</a>
                        <a href="#">Contact</a>
                    </div>
                    
                    <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                 <div className="search-bar-mobile">
                    <input type="text" placeholder="Search..." />
                    <button><FiSearch /></button>
                </div>
                <ul className="container">
                    {navItems.map((item) => (
                        <li key={item.name} className={item.dropdown ? 'has-dropdown' : ''}>
                            <a href={item.link}>{item.name}</a>
                            {item.dropdown && (
                                <ul className="dropdown-menu">
                                    {item.dropdown.map((subItem) => (
                                        <li key={subItem}><a href="#">{subItem}</a></li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default ModernHeader;
