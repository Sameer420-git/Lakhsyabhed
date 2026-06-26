import React from 'react';

export default function About() {
  const features = [
    "Concept-first teaching modules",
    "Continuous personalized feedback",
    "Dedicated parent-teacher interface",
    "Comprehensive standard test series"
  ];

  return (
    <section id="about" className="light-section">
      <div className="section-inner about-grid">
        <div className="about-image">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Graduating Students" 
          />
        </div>
        <div className="about-content">
          <span className="section-tag">About Our Institution</span>
          <h2>A premium legacy of guiding students to their dream careers</h2>
          <p>For years, Lakhsyabhed Institute has been shaping the futures of science students across Virar. Our structured curriculum, high-caliber disciplinary approach, and caring mentorship help every single student unlock their complete potential.</p>
          
          <div className="features-pills">
            {features.map((feature, idx) => (
              <div className="pill-check" key={idx}>
                <span className="check-icon">✓</span> {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}