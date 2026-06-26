import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo-box">LI</div>
          <h2>Lakhsyabhed Institute</h2>
          <p>Guiding students to their dream careers through structured curriculum and expert mentorship.</p>
        </div>
        
        <div className="footer-links">
          <h4>Contact Us</h4>
          <p>📞 +91 84599 22647</p>
          <p>📧 info@lakhsyabhed.in</p>
        </div>

        <div className="footer-links">
          <h4>Address</h4>
          <p>📍 Lakhsyabhed Institute<br/>Virar, Maharashtra, India<br/>401303</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Lakhsyabhed Institute. All Rights Reserved.</p>
      </div>
    </footer>
  );
}