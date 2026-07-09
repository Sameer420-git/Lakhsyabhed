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
  const [editStudent, setEditStudent] = useState(null); // Triggers Edit Modal
  
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [content, setContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

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

  // --- NEW ACTIONS HITTING THE SECURE BACKEND ---
  const handleStatusToggle = async (student) => {
    const newStatus = student.status === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await fetch('/api/manage-student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: student.id, action: 'update_status', status: newStatus })
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) { alert("Error changing status."); }
  };

  const handlePasswordReset = async (student) => {
    const newPass = window.prompt(`Enter a new temporary password for ${student.name}:`);
    if (!newPass) return;
    
    try {
      await fetch('/api/manage-student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: student.id, action: 'reset_password', newPassword: newPass })
      });
      alert(`Password successfully changed to: ${newPass}`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) { alert("Error resetting password."); }
  };

  const handleDeleteStudent = async (student) => {
    if (!window.confirm(`WARNING: Are you sure you want to completely delete ${student.name}'s account?`)) return;
    try {
      await fetch('/api/manage-student', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: student.id })
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) { alert("Error deleting student."); }
  };

  const handleDeleteContent = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await supabase.from('course_content').delete().eq('id', id);
    setRefreshTrigger(prev => prev + 1);
  };

  const lectures = content.filter(item => item.content_type === 'lecture');
  const notes = content.filter(item => item.content_type === 'note');

  return (
    <div className="admin-layout">
      {/* MOBILE HEADER & SIDEBAR */}
      <div className="mobile-admin-header">
        <div className="sidebar-brand" style={{ marginBottom: 0 }}><h2>Lakhsyabhed</h2><span className="brand-badge">Admin</span></div>
        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

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

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">{activeTab === 'sms' ? 'Students' : activeTab === 'cms-notes' ? 'Study Materials & Notes' : 'Lecture Recordings'}</h1>
          </div>
          <button className="btn-notion-primary" onClick={() => { activeTab === 'sms' ? setShowAddModal(true) : setShowContentModal(true) }}>
            {activeTab === 'sms' ? '+ Add New Student' : activeTab === 'cms-notes' ? '+ Upload PDF Note' : '+ Add Video Lecture'}
          </button>
        </header>

        {activeTab === 'sms' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table" style={{ overflow: 'visible' }}>
              <thead><tr><th>Name</th><th>Batch</th><th>Contact</th><th>Status</th><th style={{ width: '50px' }}></th></tr></thead>
              <tbody>
                {loadingStudents ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading students...</td></tr> : 
                 students.map(student => (
                  <tr key={student.id} className="notion-row">
                    <td className="font-medium text-dark cursor-pointer" onClick={() => setViewStudent(student)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        {student.name}
                      </div>
                    </td>
                    <td><span className="notion-tag gray">{student.batch || 'Unassigned'}</span></td>
                    <td className="text-muted">{student.contact_no || 'No Data'}</td>
                    <td><span className={`notion-tag ${student.status === 'Suspended' ? 'red' : 'green'}`}>{student.status || 'Active'}</span></td>
                    <td style={{ position: 'relative' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem', color: '#64748b' }} onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === student.id ? null : student.id); }}>•••</button>
                      
                      {/* FIXED DROPDOWN WITH NEW ACTIONS */}
                      {activeDropdown === student.id && (
                        <div style={{ position: 'absolute', right: '40px', top: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '160px', overflow: 'hidden' }}>
                          <button style={dropdownBtnStyle} onClick={() => setViewStudent(student)}>👁️ View Profile</button>
                          <button style={dropdownBtnStyle} onClick={() => setEditStudent(student)}>✏️ Edit Fields</button>
                          <button style={dropdownBtnStyle} onClick={() => handlePasswordReset(student)}>🔑 Set Password</button>
                          <div style={{ height: '1px', background: '#f1f5f9' }}></div>
                          <button style={{...dropdownBtnStyle, color: student.status === 'Suspended' ? '#166534' : '#991b1b'}} onClick={() => handleStatusToggle(student)}>
                            {student.status === 'Suspended' ? '🟢 Activate Account' : '🔴 Suspend Account'}
                          </button>
                          <button style={{...dropdownBtnStyle, color: '#991b1b', fontWeight: 'bold'}} onClick={() => handleDeleteStudent(student)}>🗑️ Delete Account</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CMS Tables (Same as before) */}
        {activeTab === 'cms-notes' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table">
              <thead><tr><th>Document Name</th><th>Target Batch</th><th>File Size</th><th style={{ width: '50px' }}></th></tr></thead>
              <tbody>
                {notes.map(note => (
                  <tr key={note.id} className="notion-row">
                    <td className="font-medium text-dark">📄 {note.title}</td>
                    <td><span className="notion-tag gray">{note.batch}</span></td>
                    <td className="text-muted">{note.meta_info}</td>
                    <td style={{ position: 'relative' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }} onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === note.id ? null : note.id); }}>•••</button>
                      {activeDropdown === note.id && (
                        <div style={{ position: 'absolute', right: '40px', top: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '120px' }}>
                          <button style={{...dropdownBtnStyle, color: '#991b1b'}} onClick={() => handleDeleteContent(note.id, note.title)}>🗑️ Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'cms-lectures' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table">
              <thead><tr><th>Lecture Title</th><th>Target Batch</th><th>Duration</th><th style={{ width: '50px' }}></th></tr></thead>
              <tbody>
                {lectures.map(lec => (
                  <tr key={lec.id} className="notion-row">
                    <td className="font-medium text-dark">▶ {lec.title}</td>
                    <td><span className="notion-tag gray">{lec.batch}</span></td>
                    <td className="text-muted">{lec.duration}</td>
                    <td style={{ position: 'relative' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }} onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === lec.id ? null : lec.id); }}>•••</button>
                      {activeDropdown === lec.id && (
                        <div style={{ position: 'absolute', right: '40px', top: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '120px' }}>
                          <button style={{...dropdownBtnStyle, color: '#991b1b'}} onClick={() => handleDeleteContent(lec.id, lec.title)}>🗑️ Delete</button>
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
      {showAddModal && <AddStudentModal onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); setRefreshTrigger(prev => prev + 1); }} />}
      {editStudent && <AddStudentModal initialData={editStudent} onClose={() => setEditStudent(null)} onSuccess={() => { setEditStudent(null); setRefreshTrigger(prev => prev + 1); }} />}
      {showContentModal && <AddContentModal type={activeTab === 'cms-notes' ? 'note' : 'lecture'} onClose={() => setShowContentModal(false)} onSuccess={() => { setShowContentModal(false); setRefreshTrigger(prev => prev + 1); }} />}
      
      {/* STUDENT VIEW MODAL (Now includes Password) */}
      {viewStudent && (
        <div className="modal-backdrop" onClick={() => setViewStudent(null)}>
          <div className="notion-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '3rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #e2e8f0', paddingRight: '2rem', minWidth: '150px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#64748b', marginBottom: '1rem' }}>
                  {viewStudent.name.charAt(0).toUpperCase()}
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
                
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
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
    </div>
  );
}

const dropdownBtnStyle = { display: 'block', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 };
const DetailField = ({ label, value }) => (
  <div>
    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</span>
    <span style={{ fontSize: '0.95rem', color: value && value !== 'Hidden/Unknown' ? '#0f172a' : '#cbd5e1' }}>{value || 'Not provided'}</span>
  </div>
);