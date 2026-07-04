import React, { useState } from 'react';

export default function AddStudentModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    batch: 'NEET 2026'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      // 1. Send the data to your new secure Vercel backend
      const response = await fetch('/api/create-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 2. Handle any errors from the backend
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create student account.');
      }

      // 3. Success! Close the modal.
      setLoading(false);
      onSuccess(); 

    } catch (error) {
      console.error("API Error:", error);
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card notion-modal">
        <div className="modal-header">
          <h2>Add New Student</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <p className="modal-description">
          Create a secure account for a new enrollment. They will use these credentials to access the portal.
        </p>

        <form onSubmit={handleSubmit} className="notion-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Temporary Password</label>
            <input 
              type="password" 
              required
              placeholder="Must be at least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Target Batch</label>
            <select 
              value={formData.batch}
              onChange={(e) => setFormData({...formData, batch: e.target.value})}
            >
              <option value="NEET 2026">NEET 2026</option>
              <option value="JEE 2026">JEE 2026</option>
              <option value="MHT-CET 2025">MHT-CET 2025</option>
              <option value="HSC Board">HSC Board</option>
            </select>
          </div>

          {errorMsg && (
            <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', background: '#fef2f2', padding: '0.75rem', borderRadius: '6px' }}>
              {errorMsg}
            </p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-notion-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-notion-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}