import React, { useState } from 'react';
import { supabase } from './supabaseClient'; 
import './App.css';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Courses from './components/Courses';
import WhyUs from './components/WhyUs';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';

function App() {
  const [showModal, setShowModal] = useState(false);

  const handleEnquirySubmit = async (formData) => {
    try {
      const { error } = await supabase
        .from('enquiries')
        .insert([{ name: formData.name, phone: formData.phone, course: formData.course }]);
      if (error) throw error;
      
      setShowModal(false);
      alert("Enquiry submitted successfully! Our team will contact you shortly.");
    } catch (error) {
      console.error("Error submitting enquiry:", error.message);
      alert("There was an error submitting your enquiry. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <Header setShowModal={setShowModal} />
      <main>
        <Hero setShowModal={setShowModal} />
        <About /> 
        <WhyUs />
        <Courses setShowModal={setShowModal} /> 
      </main>
      <Footer />
      
      {showModal && (
        <EnquiryModal 
          setShowModal={setShowModal} 
          handleEnquirySubmit={handleEnquirySubmit} 
        />
      )}
    </div>
  );
}

export default App;