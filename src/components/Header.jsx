import React from 'react';

export default function Header() {
  return (
    <header className="glass-header">
      <div className="logo">
        <h1>Lakhsyabhed <span>Institute</span></h1>
      </div>
      <nav>
        <a href="#about">About</a>
        <a href="#courses">Courses</a>
        <div className="contact-chip">+91 84599 22647</div>
      </nav>
    </header>
  );
}