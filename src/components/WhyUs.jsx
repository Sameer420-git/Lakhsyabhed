import React from 'react';

export default function WhyUs({ setShowModal }) {
  const features = [
    { title: "Qualified Faculty", desc: "Learn from experienced educators dedicated to your academic success." },
    { title: "Flexible Daily Lectures", desc: "Schedules designed to balance your school and coaching effectively." },
    { title: "Weekly Offline Tests", desc: "Regular physical assessments to track progress and exam readiness." },
    { title: "Comprehensive Materials", desc: "In-depth study resources and notes covering the entire syllabus." },
    { title: "Extensive MCQ Practice", desc: "Thousands of practice questions curated for JEE, NEET, and CET." },
    { title: "Personalized Doubt Sessions", desc: "One-on-one attention to clear complex concepts and build confidence." },
    { title: "Thorough Revisions", desc: "Structured, repetitive revision plans before all major examinations." },
    { title: "Video & Test Portal", desc: "24/7 digital access to recorded lectures and online mock exams." }
  ];

  return (
    <section id="why-us" className="why-us-section">
      <div className="section-header">
        <h2 className="thin-italic-display">Why Choose Us?</h2>
        <p>The pillars of our coaching methodology.</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">✦</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="cta-banner">
        <h2 className="thin-italic-display">Get a Free Counselling Session</h2>
        <p>Speak with our academic experts to map out your perfect learning strategy.</p>
        <button className="primary-btn gold-btn" onClick={() => setShowModal(true)}>
          Enquire Now
        </button>
      </div>
    </section>
  );
}