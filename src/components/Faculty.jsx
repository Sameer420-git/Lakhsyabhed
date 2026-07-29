import React, { useState, useEffect } from 'react';
// Import your individual image files here
import adityaImg from '../assets/Aditya.png';
import sangeetaImg from '../assets/Aditya.png'; // 👈 Replace with your actual sangeeta.png filename later
import sureshImg from '../assets/Aditya.png';   // 👈 Replace with your actual suresh.png filename later
import amitImg from '../assets/Aditya.png';     // 👈 Replace with your actual amit.png filename later


// The FacultyCard now accepts a dynamic positionClass (active, prev, next, hidden)
const FacultyCard = ({ faculty, positionClass }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={`faculty-slide ${positionClass}`}>
      <div 
        className={`faculty-card-container ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="faculty-card-inner">
          
          {/* --- FRONT OF CARD (Horizontal Split) --- */}
          <div className="faculty-card-front">
            <div className="faculty-front-left">
              <div className="faculty-avatar">
                {/* Dynamically checks for an image property before rendering the generic fallback SVG */}
                {faculty.image ? (
                  <img 
                    src={faculty.image} 
                    alt={faculty.name} 
                    className="faculty-profile-img" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                  </svg>
                )}
              </div>
            </div>

            <div className="faculty-front-right">
              <h3 className="faculty-name">{faculty.name}</h3>
              <div className="faculty-role">{faculty.role}</div>
              <div className="faculty-qual">{faculty.qualification}</div>
              <div className="flip-hint">Click to read bio ↻</div>
            </div>
          </div>

          {/* --- BACK OF CARD --- */}
          <div className="faculty-card-back">
            <h3 className="faculty-name-back">{faculty.name}</h3>
            <p className="faculty-desc">{faculty.desc}</p>
            <div className="flip-hint">Click to return ↺</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function Faculty() {
  const facultyData = [
    {
      name: "Prof. Sangeeta Yadav",
      role: "Faculty of Mathematics",
     
      qualification: "M.Sc. (Mathematics), B.Ed.",
      desc: "Prof. Sangeeta Yadav is a dedicated Mathematics educator with extensive experience in mentoring students for competitive examinations. Her concept-based teaching methodology helps students develop strong analytical and problem-solving skills essential for success in JEE, NEET, and other prestigious examinations."
    },
    {
      name: "Prof. Suresh Pandit",
      role: "Faculty of Biology",
      
      qualification: "M.Sc. (Biological Sciences)",
      desc: "Prof. Suresh Pandit is an experienced Biology faculty known for simplifying complex concepts and building strong conceptual foundations. His student-focused approach and emphasis on NCERT mastery have helped numerous aspirants excel in NEET and other medical entrance examinations."
    },
    {
      name: "Prof. Aditya Kumar Pandey",
      role: "Director & Faculty of Chemistry",
      image: adityaImg,
      qualification: "M.Tech. (Mechanical Engineering), IIT Bombay",
      desc: "Prof. Aditya Kumar Pandey is a highly accomplished educator and mentor dedicated to guiding students preparing for JEE, NEET, and UPSC examinations. With a strong academic background from IIT Bombay, he combines conceptual teaching, strategic preparation, and personalized mentorship to help students achieve excellence in competitive examinations. His focus on discipline, innovation, and result-oriented learning has made him a trusted guide for aspiring engineers, doctors, and civil servants."
    },
    {
      name: "Prof. Amit Singh",
      role: "Faculty of Physics",
      
      qualification: "B.Tech., IIT Kanpur",
      desc: "Prof. Amit Singh is a distinguished Physics educator with a strong academic foundation from IIT Kanpur. He specializes in making Physics intuitive and application-oriented through a blend of conceptual understanding and advanced problem-solving techniques. His teaching methodology enables students to confidently tackle challenging questions in JEE and NEET examinations."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % facultyData.length);
    }, 7000); 
    return () => clearInterval(timer);
  }, [isPaused, facultyData.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % facultyData.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? facultyData.length - 1 : prev - 1));

  // Determine the Cover Flow class for each card based on the current index
  const getCardPosition = (idx) => {
    const total = facultyData.length;
    if (idx === currentIndex) return 'slide-active';
    if (idx === (currentIndex - 1 + total) % total) return 'slide-prev';
    if (idx === (currentIndex + 1) % total) return 'slide-next';
    return 'slide-hidden';
  };

  return (
    <section id="faculty-section">
      <div className="section-inner faculty-inner">
        
        {/* Minimalist Header */}
        <div className="custom-section-header">
          <h2>Faculty & Mentors</h2>
          <div className="header-accent"></div>
        </div>

        {/* Master Container stretches 100% to push arrows to the extremes */}
        <div 
          className="carousel-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button className="carousel-btn prev-btn" onClick={prevSlide}>❮</button>
          
          <div className="carousel-viewport">
            <div className="carousel-track">
              {facultyData.map((faculty, idx) => (
                <FacultyCard 
                  key={idx} 
                  faculty={faculty} 
                  positionClass={getCardPosition(idx)} 
                />
              ))}
            </div>
          </div>

          <button className="carousel-btn next-btn" onClick={nextSlide}>❯</button>
        </div>
        
        <div className="carousel-dots">
          {facultyData.map((_, idx) => (
            <span 
              key={idx} 
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
