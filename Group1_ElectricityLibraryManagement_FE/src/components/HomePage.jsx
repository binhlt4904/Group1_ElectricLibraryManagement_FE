import React from 'react';
import ModernHeader from './layouts/Header';
import ModernFooter from './layouts/Footer';
import { FiArrowRight, FiMapPin, FiSend } from 'react-icons/fi';
import '../styles/HomePage.css'; // We will create this CSS file next

// Mock data for cards
const featuredCards = [
    {
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
        title: 'New Books',
        description: 'Check out the latest additions to our collection, from bestsellers to indie gems.'
    },
    {
        image: 'https://images.unsplash.com/photo-1521714161819-15534968fc5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
        title: 'Kids Programs',
        description: 'Engaging story times, creative workshops, and fun activities for our youngest readers.'
    },
    {
        image: 'https://images.unsplash.com/photo-1588666305168-5a8a1f8b36c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
        title: 'Online Resources',
        description: 'Access e-books, audiobooks, research databases, and online courses with your library card.'
    }
];


const ModernHomePage = () => {
    return (
        <div className="modern-library-layout">
            <ModernHeader />

            <main>
                {/* Hero Banner Section */}
                <section className="hero-banner">
                    <div className="hero-content container">
                        <h1>Discover Your Next Story</h1>
                        <p className="hero-subtitle">Your gateway to a universe of knowledge, community, and inspiration.</p>
                        <a href="#" className="cta-button">
                            Discover Now <FiArrowRight className="cta-icon" />
                        </a>
                    </div>
                </section>

                {/* Featured Section */}
                <section className="featured-section section-bg-alt">
                    <div className="container">
                        <h2 className="section-title">What's Happening at the Library</h2>
                        <div className="featured-grid">
                            {featuredCards.map(card => (
                                <div className="card" key={card.title}>
                                    <div className="card-image" style={{backgroundImage: `url(${card.image})`}}></div>
                                    <div className="card-content">
                                        <h3 className="card-title">{card.title}</h3>
                                        <p>{card.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                 {/* Map Section */}
                <section className="map-section">
                    <div className="container map-content">
                        <div className="map-text">
                             <h2 className="section-title">Visit Our Branches</h2>
                             <p>Find your local branch, check opening hours, and see what's on. We're part of your community.</p>
                             <a href="#" className="cta-button-outline">
                                Find a Branch <FiMapPin className="cta-icon" />
                            </a>
                        </div>
                        <div className="map-placeholder">
                           {/* In a real app, this would be an interactive map component */}
                           <img src="https://i.imgur.com/SdY9s6k.png" alt="Map of library branches" />
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="newsletter-section section-bg-alt">
                    <div className="container newsletter-content">
                        <h2 className="section-title">Stay in Touch</h2>
                        <p>Subscribe to our newsletter for the latest updates on events, new arrivals, and library news.</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Enter your email address" required />
                            <button type="submit">
                                Subscribe <FiSend className="cta-icon"/>
                            </button>
                        </form>
                    </div>
                </section>

            </main>

            <ModernFooter />
        </div>
    );
};

export default ModernHomePage;
