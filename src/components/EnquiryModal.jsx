import React, { useState } from 'react';

export default function EnquiryModal({ setShowModal, handleEnquirySubmit }) {
  const [formData, setFormData] = useState({ name: '', phone: '', course: 'XI-XII Science' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Send data to the handleEnquirySubmit function in App.jsx (which sends it to Supabase)
    await handleEnquirySubmit(formData); 
    setIsSubmitting(false);
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