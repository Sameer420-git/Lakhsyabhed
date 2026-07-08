import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// We pass a 'type' prop ('note' or 'lecture') to determine what UI to show
export default function AddContentModal({ onClose, onSuccess, type }) {
  const [contentTitle, setContentTitle] = useState('');
  const [batchName, setBatchName] = useState('JEE 2026');
  const [loading, setLoading] = useState(false);

  // States for Notes (PDFs)
  const [selectedFile, setSelectedFile] = useState(null);

  // States for Lectures (BunnyStream)
  const [bunnyId, setBunnyId] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'note') {
        // --- 1. PDF UPLOAD LOGIC ---
        if (!selectedFile) return alert("Please select a file first!");
        
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`; 
        const filePath = `${batchName}/${fileName}`; 

        const { error: uploadError } = await supabase.storage
          .from('study_materials')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('study_materials')
          .getPublicUrl(filePath);

        const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';

        const { error: dbError } = await supabase.from('course_content').insert([{
          title: contentTitle,
          content_type: 'note',
          batch: batchName,
          meta_info: sizeInMB,
          file_url: publicUrlData.publicUrl 
        }]);

        if (dbError) throw dbError;

      } else if (type === 'lecture') {
        // --- 2. BUNNYSTREAM LINKING LOGIC ---
        if (!bunnyId) return alert("Please enter the Bunny Video ID!");

        // We skip the Supabase Storage upload entirely and just save the text!
        const { error: dbError } = await supabase.from('course_content').insert([{
          title: contentTitle,
          content_type: 'lecture',
          batch: batchName,
          meta_info: 'Bunny Stream', // Used for the "Hosted On" column
          file_url: bunnyId, // We repurpose the file_url column to store the Bunny ID!
          duration: duration || 'Unknown'
        }]);

        if (dbError) throw dbError;
      }

      alert(`${type === 'note' ? 'PDF' : 'Lecture'} added successfully!`);
      onSuccess(); 
    } catch (error) {
      console.error("Submission failed:", error.message);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="notion-modal">
        <div className="modal-header">
          <h2>{type === 'note' ? 'Upload Study Material' : 'Add Video Lecture'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <p className="modal-description">
          {type === 'note' 
            ? 'Upload PDF notes or practice sheets for a specific batch.' 
            : 'Link a video lecture hosted securely on Bunny.net.'}
        </p>

        <form className="notion-form" onSubmit={handleSubmit}>
          {/* Shared Fields */}
          <div className="form-group">
            <label>{type === 'note' ? 'Document Title' : 'Lecture Title'}</label>
            <input 
              type="text" 
              placeholder={type === 'note' ? 'e.g. Thermodynamics DPP 02' : 'e.g. Kinematics L-01'} 
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Target Batch</label>
            <select value={batchName} onChange={(e) => setBatchName(e.target.value)}>
              <option value="JEE 2026">JEE 2026</option>
              <option value="NEET 2026">NEET 2026</option>
              <option value="MHT-CET 2026">MHT-CET 2026</option>
            </select>
          </div>

          {/* Conditional Fields based on Type */}
          {type === 'note' ? (
            <div className="form-group animate-fade-in">
              <label>File (PDF only)</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required 
                style={{ padding: '0.4rem', cursor: 'pointer' }}
              />
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="form-group">
                <label>Bunny Video ID / URL</label>
                <input 
                  type="text" 
                  placeholder="e.g. 8a4b2c..." 
                  value={bunnyId}
                  onChange={(e) => setBunnyId(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Video Duration (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1h 45m" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-notion-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-notion-primary" disabled={loading}>
              {loading ? 'Saving...' : type === 'note' ? 'Upload PDF' : 'Save Lecture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}