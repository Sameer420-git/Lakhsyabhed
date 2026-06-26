import React from 'react';

export default function WhyUs() {
  const features = [
    { icon: "🎓", title: "Expert Faculty", desc: "Highly experienced teachers with proven track records in coaching for competitive exams." },
    { icon: "📋", title: "Regular Test Series", desc: "Weekly tests and full-length mock exams modeled on the latest exam patterns." },
    { icon: "💬", title: "Doubt Solving", desc: "Dedicated one-on-one doubt clearing sessions so no concept is ever left behind." },
    { icon: "📘", title: "Study Material", desc: "Engineered comprehensive modules designed for maximum academic performance." },
    { icon: "👥", title: "Small Batches", desc: "Limited student intake per batch ensures highly personalized attention." },
    { icon: "🏆", title: "Proven Results", desc: "Consistent track record of producing top rankers in state and national exams." }
  ];

  return (
    <section id="why-us" className="dark-section">
      <div className="section-inner">
        <div className="section-header" style={{ color: 'white' }}>
          <span className="section-tag">Why Choose Us</span>
          <h2 style={{ color: 'white' }}>Everything your child needs to succeed</h2>
          <p style={{ color: 'var(--text-muted-light)' }}>Engineered classroom setups configured entirely for maximum attention and academic performance.</p>
        </div>
        
        <div className="why-us-grid">
          {features.map((feature, idx) => (
            <div className="why-card" key={idx}>
              <div className="why-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}