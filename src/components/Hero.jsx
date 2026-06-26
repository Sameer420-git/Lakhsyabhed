import React from 'react';

export default function Hero({ setShowModal }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2 className="thin-italic-display">Master Your Potential.</h2>
        <p>Premier coaching for JEE, NEET, and MHT-CET in Virar, Maharashtra.</p>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          Enquire Now
        </button>
      </div>
      <div className="hero-image">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Students studying collaboratively" 
        />
      </div>
    </section>
  );
}