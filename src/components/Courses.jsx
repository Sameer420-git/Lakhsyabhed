import React from 'react';

export default function Courses({ setShowModal }) {
  const programs = [
    { id: 1, title: 'JEE Main & Advanced', desc: 'Rigorous preparation for top engineering institutes.', tag: 'Engineering' },
    { id: 2, title: 'NEET (UG)', desc: 'Comprehensive coaching for medical aspirants.', tag: 'Medical' },
    { id: 3, title: 'MHT-CET', desc: 'Dedicated batches for Maharashtra state entrance.', tag: 'State Board' }
  ];

  return (
    <section id="courses" className="courses-section">
      <div className="section-header">
        <h2 className="thin-italic-display">Our Premium Programs</h2>
        <p>Structured learning paths designed for ultimate success.</p>
      </div>
      <div className="courses-cards-grid">
        {programs.map(prog => (
          <div className="course-card" key={prog.id}>
            <span className="course-tag">{prog.tag}</span>
            <h3>{prog.title}</h3>
            <p>{prog.desc}</p>
            <button className="card-btn" onClick={() => setShowModal(true)}>
              Explore Batch
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}