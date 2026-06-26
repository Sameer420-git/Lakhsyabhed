import React from 'react';

export default function Header({ setShowModal }) {
  return (
    <>
      <div className="top-bar">
        <div>📞 Admissions open for 2026 batches · Call <span>+91 84599 22647</span></div>
        <div>Follow us on Socials</div>
      </div>
      <header className="main-header">
        <div className="brand">
          <div className="logo-box">LI</div>
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