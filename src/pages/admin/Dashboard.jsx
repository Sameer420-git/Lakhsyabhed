import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import AddStudentModal from '../../components/AddStudentModal';
import AddContentModal from '../../components/AddContentModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // activeTab can now be: 'sms', 'cms-notes', or 'cms-lectures'
  const [activeTab, setActiveTab] = useState('sms'); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // --- DATA STATES ---
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  
  const [content, setContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // --- OPTIMIZED DATA FETCHING ---
  useEffect(() => {
    async function fetchStudents() {
      setLoadingStudents(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (!error && data) setStudents(data);
      setLoadingStudents(false);
    }

    async function fetchCourseContent() {
      setLoadingContent(true);
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setContent(data);
      setLoadingContent(false);
    }

    // Smart fetching based on the new activeTab naming convention
    if (activeTab === 'sms' && students.length === 0) {
      fetchStudents();
    } else if (activeTab.startsWith('cms') && content.length === 0) {
      fetchCourseContent();
    }
  }, [activeTab, refreshTrigger]); 

  // --- CONTENT SPLITTING ---
  const lectures = content.filter(item => item.content_type === 'lecture');
  const notes = content.filter(item => item.content_type === 'note');

  return (
    <div className="admin-layout">
      
      {/* --- MOBILE HEADER --- */}
      <div className="mobile-admin-header">
        <div className="sidebar-brand" style={{ marginBottom: 0 }}>
          <h2>Lakhsyabhed</h2>
          <span className="brand-badge">Admin</span>
        </div>
        <button 
          className="hamburger-btn" 
          onClick={() => setIsSidebarOpen(true)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      {/* --- MOBILE DARK OVERLAY --- */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* --- SIDEBAR DIRECTORY STRUCTURE --- */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand desktop-only">
          <h2>Lakhsyabhed</h2>
          <span className="brand-badge">Admin</span>
        </div>

        <div className="sidebar-header-mobile">
          <div className="sidebar-brand" style={{ marginBottom: 0 }}>
            <h2>Menu</h2>
          </div>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'sms' ? 'active' : ''}`}
            onClick={() => { setActiveTab('sms'); setIsSidebarOpen(false); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Student Management
          </button>
          
          {/* Directory Parent Label */}
          <div style={{ padding: '1rem 0.75rem 0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Content Manager
          </div>

          {/* Indented Directory Children */}
          <button 
            className={`nav-item ${activeTab === 'cms-notes' ? 'active' : ''}`}
            style={{ paddingLeft: '2rem' }}
            onClick={() => { setActiveTab('cms-notes'); setIsSidebarOpen(false); }}
          >
            📄 Study Materials
          </button>

          <button 
            className={`nav-item ${activeTab === 'cms-lectures' ? 'active' : ''}`}
            style={{ paddingLeft: '2rem' }}
            onClick={() => { setActiveTab('cms-lectures'); setIsSidebarOpen(false); }}
          >
            ▶ Video Lectures
          </button>
        </nav>

        <button className="nav-item logout-btn" style={{ marginTop: 'auto' }} onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Log Out
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            {/* Dynamic Titles based on the active directory */}
            <h1 className="admin-title">
              {activeTab === 'sms' ? 'Students' : 
               activeTab === 'cms-notes' ? 'Study Materials & Notes' : 
               'Lecture Recordings'}
            </h1>
            <p className="admin-subtitle">
              {activeTab === 'sms' ? 'Manage access and accounts for enrolled students.' : 
               activeTab === 'cms-notes' ? 'Upload and organize PDF notes, worksheets, and DPPs.' :
               'Organize video lecture links for student streaming.'}
            </p>
          </div>
          
          <button 
            className="btn-notion-primary"
            onClick={() => { 
              if (activeTab === 'sms') setShowAddModal(true); 
              if (activeTab.startsWith('cms')) setShowContentModal(true); 
            }}
          >
            {activeTab === 'sms' ? '+ Add New Student' : 
             activeTab === 'cms-notes' ? '+ Upload PDF Note' : 
             '+ Add Video Lecture'}
          </button>
        </header>

        {/* --- STUDENT MANAGEMENT VIEW --- */}
        {activeTab === 'sms' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email / Access</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loadingStudents ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading students...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No students found. Click "+ Add New Student" to enroll someone.</td></tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id} className="notion-row">
                      <td className="font-medium text-dark">{student.name}</td>
                      <td className="text-muted">Protected (Auth)</td>
                      <td><span className="notion-tag gray">{student.batch || 'Unassigned'}</span></td>
                      <td>
                        <span className={`notion-tag ${student.status === 'Suspended' ? 'red' : 'green'}`}>
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="text-muted">
                        {new Date(student.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="actions">•••</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- NOTES DIRECTORY VIEW --- */}
        {activeTab === 'cms-notes' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Target Batch</th>
                  <th>File Size</th>
                  <th>Uploaded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loadingContent ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>Loading notes...</td></tr>
                ) : notes.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>No notes uploaded yet. Click "+ Upload PDF Note" to begin.</td></tr>
                ) : notes.map(note => (
                  <tr key={note.id} className="notion-row">
                    <td className="font-medium text-dark"><span style={{marginRight: '8px'}}>📄</span> {note.title}</td>
                    <td><span className="notion-tag gray">{note.batch}</span></td>
                    <td className="text-muted">{note.meta_info}</td>
                    <td className="text-muted">
                      {new Date(note.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="actions">•••</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- LECTURES DIRECTORY VIEW --- */}
        {activeTab === 'cms-lectures' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table">
              <thead>
                <tr>
                  <th>Lecture Title</th>
                  <th>Target Batch</th>
                  <th>Hosted On</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loadingContent ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>Loading lectures...</td></tr>
                ) : lectures.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>No lectures uploaded yet. Click "+ Add Video Lecture" to begin.</td></tr>
                ) : lectures.map(lec => (
                  <tr key={lec.id} className="notion-row">
                    <td className="font-medium text-dark"><span style={{marginRight: '8px'}}>▶</span> {lec.title}</td>
                    <td><span className="notion-tag gray">{lec.batch}</span></td>
                    <td className="text-muted">{lec.meta_info}</td>
                    <td className="text-muted">{lec.duration}</td>
                    <td className="text-muted">
                      {new Date(lec.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="actions">•••</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

      {/* --- MODALS --- */}
      {showAddModal && (
        <AddStudentModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setStudents([]); 
            setRefreshTrigger(prev => prev + 1); 
          }}
        />
      )}
      
{showContentModal && (
        <AddContentModal 
          type={activeTab === 'cms-notes' ? 'note' : 'lecture'} // <-- This is the magic link!
          onClose={() => setShowContentModal(false)}
          onSuccess={() => {
            setShowContentModal(false);
            setContent([]); 
            setRefreshTrigger(prev => prev + 1); 
          }}
        />
      )}
      
    </div>
  );
}