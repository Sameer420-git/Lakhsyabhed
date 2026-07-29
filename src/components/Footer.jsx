import React from 'react';
import logo from '../assets/logo.png'; // Import the image file here

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          {/* Replaced the logo-box div with the actual image */}
          <img src={logo} alt="Lakhsyabhed Institute Logo" className="brand-logo" />
          
          <h2>Lakhsyabhed Institute</h2>
          <p>Guiding students to their dream careers through structured curriculum and expert mentorship.</p>
        </div>
        
        <div className="footer-links">
          <h4>Contact Us</h4>
          <p>
            <a href="tel:+918459922647" className="footer-interactive-link">
              📞 +91 84599 22647
            </a>
          </p>
          <p>
            <a href="mailto:info@lakhsyabhed.in" className="footer-interactive-link">
              📧 info@lakhsyabhed.in
            </a>
          </p>
        </div>

        <div className="footer-links">
          <h4>Address</h4>
          <p>📍 Lakhsyabhed Institute<br/>Virar, Maharashtra, India<br/>401303</p>
        </div>

        {/* Added Follow Us Section with Live Capsule Hyperlinks */}
        <div className="footer-links">
          <h4>Follow Us</h4>
          <div className="social-capsules">
            
            {/* Live Instagram Capsule Link */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-capsule instagram-btn"
            >
              <span className="icon">📸</span> Instagram
            </a>

            {/* Live YouTube Channel Capsule Link */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-capsule youtube-btn"
            >
              <span className="icon">📺</span> YouTube
            </a>

          </div>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Lakhsyabhed Institute. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
