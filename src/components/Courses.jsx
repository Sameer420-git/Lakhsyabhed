import React from 'react';

export default function Courses() {
  const programs = [
    { title: 'XI-XII Science (HSC)', icon: '📘' },
    { title: 'MHT-CET', icon: '🎯' },
    { title: 'NEET (UG)', icon: '⚕️' },
    { title: 'JEE Main & Advanced', icon: '⚙️' },
    { title: 'Combo Batches', icon: '📚' },
    { title: 'Foundation (VIII-X)', icon: '🌱' }
  ];

  return (
    <section id="courses" className="light-section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Our Courses</span>
          <h2>Programs for every stage of learning</h2>
        </div>
        
        <div className="courses-grid">
          {programs.map((prog, idx) => (
            <div className="course-card" key={idx}>
              <div className="course-card-left">
                <div className="course-icon">{prog.icon}</div>
                <h3>{prog.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}