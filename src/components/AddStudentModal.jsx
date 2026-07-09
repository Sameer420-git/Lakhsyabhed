import React, { useState, useEffect } from 'react';

// initialData will be 'null' for new students, and hold student data for edits
export default function AddStudentModal({ onClose, onSuccess, initialData = null }) {
  const isEditMode = !!initialData;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [batchName, setBatchName] = useState('JEE 2026');
  
  const [dob, setDob] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherContact, setFatherContact] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If in edit mode, pre-fill all the fields!
  useEffect(() => {
    if (isEditMode) {
      setFullName(initialData.name || '');
      setBatchName(initialData.batch || 'JEE 2026');
      setDob(initialData.dob || '');
      setContactNo(initialData.contact_no || '');
      setFatherName(initialData.father_name || '');
      setFatherContact(initialData.father_contact || '');
      setAddress(initialData.address || '');
    }
  }, [initialData, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;

      if (isEditMode) {
        // --- EDIT EXISTING STUDENT ---
        response = await fetch('/api/manage-student', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: initialData.id,
            action: 'edit_profile',
            profileData: {
              name: fullName, batch: batchName, dob, contact_no: contactNo,
              father_name: fatherName, father_contact: fatherContact, address
            }
          })
        });
      } else {
        // --- CREATE NEW STUDENT ---
        response = await fetch('/api/create-student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email, password, name: fullName, batch: batchName, dob,
            contact_no: contactNo, father_name: fatherName,
            father_contact: fatherContact, address
          })
        });
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Operation failed');
      onSuccess(); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{ padding: '1rem', boxSizing: 'border-box' }}>
      <div className="notion-modal" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden', borderRadius: '6px', padding: '2rem', boxSizing: 'border-box' }}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Student Profile' : 'Add New Student'}</h2>
          <button type="button" className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>{error}</div>}

        <form className="notion-form" onSubmit={handleSubmit}>
          
          <h3 style={{ fontSize: '0.85rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Account Configuration</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div className="form-group">
              <label>Target Batch</label>
              <select value={batchName} onChange={e => setBatchName(e.target.value)} style={{ width: '100%' }}>
                <option value="JEE 2026">JEE 2026</option>
                <option value="NEET 2026">NEET 2026</option>
                <option value="MHT-CET 2026">MHT-CET 2026</option>
              </select>
            </div>
            
            {/* Hide Email & Password fields if editing, as they are handled separately */}
            {!isEditMode && (
              <>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div className="form-group">
                  <label>Temporary Password</label>
                  <input type="text" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} />
                </div>
              </>
            )}
          </div>

          <h3 style={{ fontSize: '0.85rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '1rem' }}>Personal Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label>Date of Birth</label><input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ width: '100%' }} /></div>
            <div className="form-group"><label>Student Contact</label><input type="tel" value={contactNo} onChange={e => setContactNo(e.target.value.replace(/[^0-9+]/g, ''))} style={{ width: '100%' }} /></div>
            <div className="form-group"><label>Father's Name</label><input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} style={{ width: '100%' }} /></div>
            <div className="form-group"><label>Father's Contact</label><input type="tel" value={fatherContact} onChange={e => setFatherContact(e.target.value.replace(/[^0-9+]/g, ''))} style={{ width: '100%' }} /></div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label>Home Address</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%' }} />
          </div>

          <div className="modal-actions" style={{ marginTop: '1.5rem', position: 'sticky', bottom: '-2rem', background: 'white', paddingBottom: '2rem' }}>
            <button type="button" className="btn-notion-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-notion-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}