import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function EnquiryModal({ setShowModal, handleEnquirySubmit }) {
  const [formData, setFormData] = useState({ name: '', phone: '', course: 'XI-XII Science' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Tracks if the message should show

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false); // Reset in case they submit multiple times

    try {
      // 1. Send data to Supabase 
      await handleEnquirySubmit(formData); 

      // 2. Send the Email notification via EmailJS
      await emailjs.send(
        'service_2idflqd',        
        'template_en3g4g2',       
        {
          name: formData.name,     
          phone: formData.phone,   
          course: formData.course  
        },
        '97aaeZ58jfTJSh1T7PtAV'   
      );

      // Show the inline success message
      setShowSuccess(true);
      
      // Optional: Clear the form fields after successful submission
      setFormData({ name: '', phone: '', course: 'XI-XII Science' });

    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
        <h3 className="modal-title">Start Your Journey</h3>
        
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="Student Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              required 
              pattern="[0-9]{10}"
              title="Please enter exactly 10 digits"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Select Course</label>
            <select 
              value={formData.course}
              onChange={e => setFormData({...formData, course: e.target.value})}
            >
              <option value="XI-XII Science">XI-XII Science (HSC)</option>
              <option value="MHT-CET">MHT-CET</option>
              <option value="NEET">NEET (UG)</option>
              <option value="JEE">JEE Main & Advanced</option>
              <option value="Combo Batches">Combo Batches</option>
              <option value="Foundation">Foundation (VIII-X)</option>
            </select>
          </div>
          
          {/* Success Message appears directly above the button */}
          {showSuccess && (
            <div style={{ 
              color: '#4CAF50', 
              fontSize: '14px', 
              textAlign: 'center', 
              marginBottom: '15px',
              fontWeight: 'bold'
            }}>
              Thank you! Our team will contact you soon.
            </div>
          )}

          <button 
            type="submit" 
            className="btn-yellow submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
