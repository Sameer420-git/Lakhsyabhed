import React from 'react';

export default function Hero({ setShowModal }) {
  return (
    <section id="home" className="dark-section">
      <div className="section-inner hero-grid">
        <div className="hero-content">
          <span className="section-tag">🏆 Premier Coaching Excellence</span>
          <h2>Building Toppers in <span className="text-yellow">HSC, NEET, JEE & MHT-CET</span></h2>
          <p>Virar's trusted coaching institute for Science. Expert faculty, small batches, rigorous test series, and personal mentorship that turns hard work into targeted results.</p>
          <div className="hero-btns">
            <button className="btn-yellow" onClick={() => setShowModal(true)}>Book Free Counselling</button>
            <a href="#courses"><button className="btn-outline">Explore Courses</button></a>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Students studying" 
          />
        </div>
      </div>
    </section>
  );
}