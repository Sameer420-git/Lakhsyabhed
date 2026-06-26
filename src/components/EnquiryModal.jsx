import React, { useState } from 'react';

export default function EnquiryModal({ setShowModal, handleEnquirySubmit }) {
  const [formData, setFormData] = useState({ name: '', phone: '', course: '11' });

  const onSubmit = (e) => {
    e.preventDefault();
    handleEnquirySubmit(formData); // Pass data up to App.jsx
  };

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
        <h3>Start Your Journey</h3>
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
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
              title="10 digit mobile number"
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
              <option value="11">Class 11</option>
              <option value="12 pcm">Class 12 (PCM)</option>
              <option value="12 pcb">Class 12 (PCB)</option>
              <option value="12 pcmb">Class 12 (PCMB)</option>
              <option value="mhtcet">MHT-CET</option>
              <option value="jee">JEE Main/Adv</option>
              <option value="neet">NEET</option>
              <option value="combo">Combo Batches</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Submit Enquiry</button>
        </form>
      </div>
    </div>
  );
}