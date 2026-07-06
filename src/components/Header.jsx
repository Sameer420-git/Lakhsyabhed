import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 

export default function Header({ setShowModal }) {
  // State to track if the mobile menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="top-bar">
        <div>📞 Admissions open for 2026 batches · Call <span>+91 84599 22647</span></div>
        <div>Follow us on Socials</div>
      </div>
      
      <header className="main-header">
        <div className="brand">
          <img src={logo} alt="Lakhsyabhed Institute Logo" className="brand-logo" />
          <div className="brand-text">
            <h1>Lakhsyabhed Institute</h1>
            <p>Since 2015 · Virar</p>
          </div>
        </div>

        {/* Hamburger Toggle Button (Only visible on mobile) */}
        <button 
          className="hamburger-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              // The "X" Icon
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              // The Hamburger Lines
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>

        {/* Navigation Links */}
        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#why-us" onClick={() => setIsMenuOpen(false)}>Why Us</a>
          <a href="#courses" onClick={() => setIsMenuOpen(false)}>Courses</a>
          
          <button 
            className="btn-nav" 
            onClick={() => { 
              setShowModal(true); 
              setIsMenuOpen(false); 
            }}
          >
            Enquire Now
          </button>
          
          <Link 
            to="/login" 
            className="login-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        </nav>
      </header>
    </>
  );
}