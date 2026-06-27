import React from 'react';
import logo from '../assets/logo.png'; // Import the image file here

export default function Header({ setShowModal }) {
  return (
    <>
      <div className="top-bar">
        <div>📞 Admissions open for 2026 batches · Call <span>+91 84599 22647</span></div>
        <div>Follow us on Socials</div>
      </div>
      <header className="main-header">
        <div className="brand">
          {/* Replaced the logo-box div with the actual image */}
          <img src={logo} alt="Lakhsyabhed Institute Logo" className="brand-logo" />
          
          <div className="brand-text">
            <h1>Lakhsyabhed Institute</h1>
            <p>Since 2015 · Virar</p>
          </div>
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#why-us">Why Us</a>
          <a href="#courses">Courses</a>
          <button className="btn-nav" onClick={() => setShowModal(true)}>Enquire Now</button>
        </nav>
      </header>
    </>
  );
}