import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import AddStudentModal from '../../components/AddStudentModal';
import AddContentModal from '../../components/AddContentModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('sms'); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewStudent, setViewStudent] = useState(null); 
  const [editStudent, setEditStudent] = useState(null); 
  
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [content, setContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [passwordPrompt, setPasswordPrompt] = useState(null); 
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); 

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  useEffect(() => {
    async function fetchStudents() {
      setLoadingStudents(true);
      const { data } = await supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false });
      if (data) setStudents(data);
      setLoadingStudents(false);
    }
    async function fetchCourseContent() {
      setLoadingContent(true);
      const { data } = await supabase.from('course_content').select('*').order('created_at', { ascending: false });
      if (data) setContent(data);
      setLoadingContent(false);
    }
    
    if (activeTab === 'sms') fetchStudents();
    else fetchCourseContent();
  }, [activeTab, refreshTrigger]); 

  const handleStatusToggle = async (student) => {
    const newStatus = student.status === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await fetch('/api/manage-student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: student.id, action: 'update_status', status: newStatus })
      });
      showToast(`${student.name}'s account is now ${newStatus}.`, 'success');
      setRefreshTrigger(prev => prev + 1);
    } catch (err) { showToast("Error changing account status.", 'error'); }
  };

  const executePasswordReset = async () => {
    if (!newPasswordInput || newPasswordInput.length < 6) {
      return showToast("Password must be at least 6 characters.", 'error');
    }
    try {
      await fetch('/api/manage-student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: passwordPrompt.id, action: 'reset_password', newPassword: newPasswordInput })
      });
      showToast(`Password updated for ${passwordPrompt.name}.`, 'success');
      setPasswordPrompt(null);
      setNewPasswordInput('');
      setRefreshTrigger(prev => prev + 1);
    } catch (err) { showToast("Error resetting password.", 'error'); }
  };

  const executeDelete = async () => {
    try {
      if (deleteConfirm.type === 'student') {
        await fetch('/api/manage-student', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: deleteConfirm.id })
        });
      } else {
        await supabase.from('course_content').delete().eq('id', deleteConfirm.id);
      }
      showToast(`${deleteConfirm.title || deleteConfirm.name} successfully deleted.`, 'success');
      setDeleteConfirm(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) { showToast("An error occurred during deletion.", 'error'); }
  };

  // --- NEW: Helper function to securely download files ---
  const handleForceDownload = async (url, filename) => {
    try {
      showToast("Downloading file...", "success");
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback if CORS blocks the fetch: just open in a new tab
      window.open(url, '_blank');
    }
  };

  const lectures = content.filter(item => item.content_type === 'lecture');
  const notes = content.filter(item => item.content_type === 'note');

  return (
    <div className="admin-layout">
      {/* MOBILE HEADER */}
      <div className="mobile-admin-header">
        <div className="sidebar-brand" style={{ marginBottom: 0 }}><h2>Lakhsyabhed</h2><span className="brand-badge">Admin</span></div>
        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand desktop-only"><h2>Lakhsyabhed</h2><span className="brand-badge">Admin</span></div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'sms' ? 'active' : ''}`} onClick={() => { setActiveTab('sms'); setIsSidebarOpen(false); }}>Student Management</button>
          <div style={{ padding: '1rem 0.75rem 0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Content Manager</div>
          <button className={`nav-item ${activeTab === 'cms-notes' ? 'active' : ''}`} style={{ paddingLeft: '2rem' }} onClick={() => { setActiveTab('cms-notes'); setIsSidebarOpen(false); }}>📄 Study Materials</button>
          <button className={`nav-item ${activeTab === 'cms-lectures' ? 'active' : ''}`} style={{ paddingLeft: '2rem' }} onClick={() => { setActiveTab('cms-lectures'); setIsSidebarOpen(false); }}>▶ Video Lectures</button>
        </nav>
        <button className="nav-item logout-btn" style={{ marginTop: 'auto' }} onClick={handleLogout}>Log Out</button>
      </aside>

      {/* MAIN MAIN VIEW */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">{activeTab === 'sms' ? 'Students' : activeTab === 'cms-notes' ? 'Study Materials & Notes' : 'Lecture Recordings'}</h1>
          </div>
          <button className="btn-notion-primary" onClick={() => { activeTab === 'sms' ? setShowAddModal(true) : setShowContentModal(true) }}>
            {activeTab === 'sms' ? '+ Add New Student' : activeTab === 'cms-notes' ? '+ Upload PDF Note' : '+ Add Video Lecture'}
          </button>
        </header>

        {/* STUDENT MANAGEMENT VIEW */}
        {activeTab === 'sms' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table" style={{ overflow: 'visible' }}>
              <thead><tr><th>Name</th><th>Batch</th><th>Contact</th><th>Status</th><th style={{ width: '50px' }}></th></tr></thead>
              <tbody>
                {loadingStudents && students.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading students...</td></tr> : 
                 students.map(student => (
                  <tr key={student.id} className="notion-row">
                    <td className="font-medium text-dark cursor-pointer" onClick={() => setViewStudent(student)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', overflow: 'hidden' }}>
                          {student.avatar_url ? (
                            <img src={student.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            student.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        {student.name}
                      </div>
                    </td>
                    <td><span className="notion-tag gray">{student.batch || 'Unassigned'}</span></td>
                    <td className="text-muted">{student.contact_no || 'No Data'}</td>
                    <td><span className={`notion-tag ${student.status === 'Suspended' ? 'red' : 'green'}`}>{student.status || 'Active'}</span></td>
                    <td style={{ position: 'relative' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem', color: '#64748b' }} onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === student.id ? null : student.id); }}>•••</button>
                      
                      {activeDropdown === student.id && (
                        <div style={{ position: 'absolute', right: '40px', top: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 10, minWidth: '170px', overflow: 'hidden', padding: '4px 0' }}>
                          <button style={dropdownBtnStyle} onClick={() => setViewStudent(student)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            View Profile
                          </button>
                          <button style={dropdownBtnStyle} onClick={() => setEditStudent(student)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Edit Fields
                          </button>
                          <button style={dropdownBtnStyle} onClick={() => { setPasswordPrompt(student); setActiveDropdown(null); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                            Set Password
                          </button>
                          <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }}></div>
                          <button style={{...dropdownBtnStyle, color: student.status === 'Suspended' ? '#166534' : '#b91c1c'}} onClick={() => { handleStatusToggle(student); setActiveDropdown(null); }}>
                            {student.status === 'Suspended' ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                            )}
                            {student.status === 'Suspended' ? 'Activate User' : 'Suspend User'}
                          </button>
                          <button style={{...dropdownBtnStyle, color: '#b91c1c', fontWeight: '500'}} onClick={() => { setDeleteConfirm({ ...student, type: 'student' }); setActiveDropdown(null); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            Delete Account
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CMS NOTES VIEW */}
        {activeTab === 'cms-notes' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table" style={{ overflow: 'visible' }}>
              <thead><tr><th>Document Name</th><th>Target Batch</th><th>File Size</th><th style={{ width: '50px' }}></th></tr></thead>
              <tbody>
                {loadingContent && notes.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading materials...</td></tr> : 
                 notes.map(note => (
                  <tr key={note.id} className="notion-row">
                    <td className="font-medium text-dark">📄 {note.title}</td>
                    <td><span className="notion-tag gray">{note.batch}</span></td>
                    <td className="text-muted">{note.meta_info}</td>
                    <td style={{ position: 'relative' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }} onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === note.id ? null : note.id); }}>•••</button>
                      
                      {/* --- NEW PREVIEW AND DOWNLOAD ACTION MENU --- */}
                      {activeDropdown === note.id && (
                        <div style={{ position: 'absolute', right: '40px', top: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 10, minWidth: '150px', padding: '4px 0' }}>
                          
                          <button style={dropdownBtnStyle} onClick={() => { window.open(note.file_url, '_blank'); setActiveDropdown(null); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            Preview
                          </button>
                          
                          <button style={dropdownBtnStyle} onClick={() => { handleForceDownload(note.file_url, note.title); setActiveDropdown(null); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download
                          </button>
                          
                          <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }}></div>
                          
                          <button style={{...dropdownBtnStyle, color: '#b91c1c'}} onClick={() => { setDeleteConfirm({ ...note, type: 'content' }); setActiveDropdown(null); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Delete
                          </button>

                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CMS LECTURES VIEW */}
        {activeTab === 'cms-lectures' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table" style={{ overflow: 'visible' }}>
              <thead><tr><th>Lecture Title</th><th>Target Batch</th><th>Duration</th><th style={{ width: '50px' }}></th></tr></thead>
              <tbody>
                {loadingContent && lectures.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading lectures...</td></tr> : 
                 lectures.map(lec => (
                  <tr key={lec.id} className="notion-row">
                    <td className="font-medium text-dark">▶ {lec.title}</td>
                    <td><span className="notion-tag gray">{lec.batch}</span></td>
                    <td className="text-muted">{lec.duration}</td>
                    <td style={{ position: 'relative' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }} onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === lec.id ? null : lec.id); }}>•••</button>
                      
                      {activeDropdown === lec.id && (
                        <div style={{ position: 'absolute', right: '40px', top: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 10, minWidth: '150px', padding: '4px 0' }}>
                          <button style={dropdownBtnStyle} onClick={() => { window.open(lec.file_url, '_blank'); setActiveDropdown(null); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            View Link
                          </button>

                          <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }}></div>
                          
                          <button style={{...dropdownBtnStyle, color: '#b91c1c'}} onClick={() => { setDeleteConfirm({ ...lec, type: 'content' }); setActiveDropdown(null); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODALS */}
      {showAddModal && <AddStudentModal onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); setRefreshTrigger(prev => prev + 1); showToast("Student account initiated."); }} />}
      {editStudent && <AddStudentModal initialData={editStudent} onClose={() => setEditStudent(null)} onSuccess={() => { setEditStudent(null); setRefreshTrigger(prev => prev + 1); showToast("Profile fields committed."); }} />}
      {showContentModal && <AddContentModal type={activeTab === 'cms-notes' ? 'note' : 'lecture'} onClose={() => setShowContentModal(false)} onSuccess={() => { setShowContentModal(false); setRefreshTrigger(prev => prev + 1); showToast("Syllabus resource added."); }} />}
      
      {/* PROFILE VIEW */}
      {viewStudent && (
        <div className="modal-backdrop" onClick={() => setViewStudent(null)}>
          <div className="notion-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '3rem', borderRadius: '6px' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #e2e8f0', paddingRight: '2rem', minWidth: '150px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#64748b', marginBottom: '1rem', overflow: 'hidden' }}>
                  {viewStudent.avatar_url ? (
                    <img src={viewStudent.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    viewStudent.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className={`notion-tag ${viewStudent.status === 'Suspended' ? 'red' : 'green'}`} style={{ marginBottom: '0.5rem' }}>{viewStudent.status || 'Active'}</span>
                <span className="notion-tag gray">{viewStudent.batch}</span>
              </div>
              
              <div style={{ flex: 1 }}>
                <div className="modal-header">
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '0' }}>{viewStudent.name}</h2>
                  <button className="close-btn" onClick={() => setViewStudent(null)}>×</button>
                </div>
                <p style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>{viewStudent.email}</p>
                
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
                  <DetailField label="Account Password" value={viewStudent.plain_password || 'Hidden/Unknown'} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <DetailField label="Date of Birth" value={viewStudent.dob} />
                  <DetailField label="Student Contact" value={viewStudent.contact_no} />
                  <DetailField label="Father's Name" value={viewStudent.father_name} />
                  <DetailField label="Father's Contact" value={viewStudent.father_contact} />
                  <div style={{ gridColumn: 'span 2' }}><DetailField label="Home Address" value={viewStudent.address} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {passwordPrompt && (
        <div className="modal-backdrop">
          <div className="notion-modal" style={{ maxWidth: '400px', borderRadius: '6px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.2rem' }}>Force Password Override</h2>
              <button className="close-btn" onClick={() => setPasswordPrompt(null)}>×</button>
            </div>
            <p className="modal-description">Directly overwrite authentication credentials for <strong>{passwordPrompt.name}</strong> without email verification.</p>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input type="text" placeholder="Enter absolute new password..." value={newPasswordInput} onChange={e => setNewPasswordInput(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
            </div>
            <div className="modal-actions" style={{ marginTop: '0' }}>
              <button className="btn-notion-secondary" onClick={() => { setPasswordPrompt(null); setNewPasswordInput(''); }}>Cancel</button>
              <button className="btn-notion-primary" onClick={executePasswordReset}>Save Credentials</button>
            </div>
          </div>
        </div>
      )}

      {/* DESTRUCTIVE DELETE MODAL */}
      {deleteConfirm && (
        <div className="modal-backdrop">
          <div className="notion-modal" style={{ maxWidth: '400px', borderTop: '4px solid #ef4444', borderRadius: '6px' }}>
            <h2 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.5rem', fontWeight: '700' }}>Confirm Deletion</h2>
            <p className="modal-description">
              You are removing <strong>{deleteConfirm.name || deleteConfirm.title}</strong> permanently from the system records. This operation cannot be reversed.
            </p>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn-notion-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }} onClick={executeDelete}>Delete Record</button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE TOAST SYSTEM */}
      {toast.visible && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'success' ? '#0f172a' : '#ef4444',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '6px',
          fontWeight: '500',
          fontSize: '0.85rem',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'slideUp 0.2s ease-out'
        }}>
          {toast.type === 'success' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

// Global flexbox configuration alignment layout override for action elements
const dropdownBtnStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '10px', 
  width: '100%', 
  padding: '0.65rem 1rem', 
  background: 'none', 
  border: 'none', 
  textAlign: 'left', 
  cursor: 'pointer', 
  fontSize: '0.85rem', 
  color: '#334155', 
  fontWeight: 500,
  transition: 'background 0.15s ease'
};

const DetailField = ({ label, value }) => (
  <div>
    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</span>
    <span style={{ fontSize: '0.95rem', color: value && value !== 'Hidden/Unknown' ? '#0f172a' : '#cbd5e1' }}>{value || 'Not provided'}</span>
  </div>
);