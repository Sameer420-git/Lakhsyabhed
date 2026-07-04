import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import AddStudentModal from '../../components/AddStudentModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sms'); // 'sms' or 'cms'
  const [showAddModal, setShowAddModal] = useState(false);

  // Real Database State for Students
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // --- FETCH REAL STUDENT DATA ---
  useEffect(() => {
    async function fetchStudents() {
      setLoadingStudents(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching students:", error.message);
      } else {
        setStudents(data || []);
      }
      setLoadingStudents(false);
    }

    if (activeTab === 'sms') {
      fetchStudents();
    }
  }, [activeTab, showAddModal]); // Re-runs when the tab changes or a new student is added (modal closes)

  // --- MOCK DATA FOR CMS (Until we build the CMS backend) ---
  const lectures = [
    { id: '1', title: 'Kinematics Lecture 01', batch: 'JEE 2026', hosted: 'Bunny Stream', duration: '1h 45m', date: 'Oct 15, 2024' },
    { id: '2', title: 'Cell Structure & Functions', batch: 'NEET 2026', hosted: 'Bunny Stream', duration: '1h 20m', date: 'Oct 14, 2024' },
  ];

  const notes = [
    { id: '1', title: 'Thermodynamics DPP', batch: 'JEE 2026', size: '2.4 MB', date: 'Oct 10, 2024' },
    { id: '2', title: 'Biology Chapter 1 Summary', batch: 'NEET 2026', size: '1.1 MB', date: 'Oct 14, 2024' },
  ];

  return (
    <div className="admin-layout">
      
      {/* --- SIDEBAR --- */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>Lakhsyabhed</h2>
          <span className="brand-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'sms' ? 'active' : ''}`}
            onClick={() => setActiveTab('sms')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Student Management
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'cms' ? 'active' : ''}`}
            onClick={() => setActiveTab('cms')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
            Content Manager
          </button>
        </nav>

        <button className="nav-item logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Log Out
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">{activeTab === 'sms' ? 'Students' : 'Course Content'}</h1>
            <p className="admin-subtitle">
              {activeTab === 'sms' ? 'Manage access and accounts for enrolled students.' : 'Upload and organize lecture videos and study materials.'}
            </p>
          </div>
          
          <button 
            className="btn-notion-primary"
            onClick={() => {
              if (activeTab === 'sms') setShowAddModal(true);
              // CMS upload modal logic can go here later
            }}
          >
            {activeTab === 'sms' ? '+ Add New Student' : '+ Upload Content'}
          </button>
        </header>

        {/* --- STUDENT MANAGEMENT VIEW --- */}
        {activeTab === 'sms' && (
          <div className="notion-table-container">
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
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      Loading students...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No students found. Click "+ Add New Student" to enroll someone.
                    </td>
                  </tr>
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

        {/* --- CONTENT MANAGER VIEW (Split Sections) --- */}
        {activeTab === 'cms' && (
          <div className="cms-sections">
            
            {/* Section 1: Lectures */}
            <div className="cms-section">
              <h3 className="cms-section-title">Lecture Recordings</h3>
              <div className="notion-table-container">
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
                    {lectures.map(lec => (
                      <tr key={lec.id} className="notion-row">
                        <td className="font-medium text-dark">
                          <span style={{marginRight: '8px'}}>▶</span> {lec.title}
                        </td>
                        <td><span className="notion-tag gray">{lec.batch}</span></td>
                        <td className="text-muted">{lec.hosted}</td>
                        <td className="text-muted">{lec.duration}</td>
                        <td className="text-muted">{lec.date}</td>
                        <td className="actions">•••</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Notes */}
            <div className="cms-section">
              <h3 className="cms-section-title">Study Materials & Notes</h3>
              <div className="notion-table-container">
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
                    {notes.map(note => (
                      <tr key={note.id} className="notion-row">
                        <td className="font-medium text-dark">
                          <span style={{marginRight: '8px'}}>📄</span> {note.title}
                        </td>
                        <td><span className="notion-tag gray">{note.batch}</span></td>
                        <td className="text-muted">{note.size}</td>
                        <td className="text-muted">{note.date}</td>
                        <td className="actions">•••</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* --- MODALS --- */}
      {showAddModal && (
        <AddStudentModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            // The useEffect will automatically re-run and fetch the new student!
          }}
        />
      )}
      
    </div>
  );
}