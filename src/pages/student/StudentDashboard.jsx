import React, { useState } from 'react';

export default function AddStudentModal({ onClose, onSuccess }) {
  // Original Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [batchName, setBatchName] = useState('JEE 2026');
  
  // New Extended Fields
  const [dob, setDob] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherContact, setFatherContact] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // We send all the new data to your local Vercel API route
      const response = await fetch('/api/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: fullName,
          batch: batchName,
          dob,
          contact_no: contactNo,
          father_name: fatherName,
          father_contact: fatherContact,
          address
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create student');
      }

      onSuccess(); // Close modal and refresh the table
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="notion-modal" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h2>Add New Student</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <p className="modal-description">
          Create a secure account and profile for a new enrollment.
        </p>

        {error && (
          <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form className="notion-form" onSubmit={handleSubmit}>
          
          <h3 style={{ fontSize: '0.85rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Account Credentials</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Temporary Password</label>
              <input type="text" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Target Batch</label>
              <select value={batchName} onChange={e => setBatchName(e.target.value)}>
                <option value="JEE 2026">JEE 2026</option>
                <option value="NEET 2026">NEET 2026</option>
                <option value="MHT-CET 2026">MHT-CET 2026</option>
              </select>
            </div>
          </div>

          <h3 style={{ fontSize: '0.85rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '1rem' }}>Personal Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Student Contact No.</label>
              <input type="text" placeholder="+91..." value={contactNo} onChange={e => setContactNo(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Father's Name</label>
              <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Father's Contact</label>
              <input type="text" placeholder="+91..." value={fatherContact} onChange={e => setFatherContact(e.target.value)} />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label>Home Address</label>
            <input type="text" placeholder="Full residential address..." value={address} onChange={e => setAddress(e.target.value)} />
          </div>

          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn-notion-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-notion-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}