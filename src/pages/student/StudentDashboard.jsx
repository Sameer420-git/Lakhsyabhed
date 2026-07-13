import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import BunnyPlayer from '../../components/BunnyPlayer';

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('lectures'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function loadStudentData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return navigate('/login');

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: contentData, error: contentError } = await supabase
          .from('course_content')
          .select('*')
          .eq('batch', profileData.batch)
          .order('created_at', { ascending: false });

        if (contentError) throw contentError;
        setContent(contentData);

      } catch (error) {
        console.error("Error loading dashboard:", error.message);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
           <div style={{ width: '30px', height: '30px', border: '3px solid #e2e8f0', borderTop: '3px solid #0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
           <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const lectures = content.filter(item => item.content_type === 'lecture');
  const notes = content.filter(item => item.content_type === 'note');

  // --- NEW: INTELLIGENT PLAYLIST GROUPING ---
  // This automatically sorts all lectures into objects based on their playlist_name
  const playlists = lectures.reduce((acc, lec) => {
    const plName = lec.playlist_name || 'General Lectures';
    if (!acc[plName]) acc[plName] = [];
    acc[plName].push(lec);
    return acc;
  }, {});

  return (
    <div className="admin-layout">
      <div className="mobile-admin-header">
        <div className="sidebar-brand" style={{ marginBottom: 0 }}>
          <h2>Lakhsyabhed</h2>
          <span className="brand-badge" style={{ background: '#3b82f6', color: 'white' }}>Student</span>
        </div>
        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand desktop-only">
          <h2>Lakhsyabhed</h2>
          <span className="brand-badge" style={{ background: '#3b82f6', color: 'white' }}>Student</span>
        </div>
        
        <nav className="sidebar-nav">
          <div style={{ padding: '1rem 0.75rem 0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>My Syllabus</div>
          <button className={`nav-item ${activeTab === 'lectures' ? 'active' : ''}`} onClick={() => { setActiveTab('lectures'); setIsSidebarOpen(false); }}>▶ Video Lectures</button>
          <button className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => { setActiveTab('notes'); setIsSidebarOpen(false); }}>📄 Study Materials</button>
        </nav>
        
        <button className="nav-item logout-btn" style={{ marginTop: 'auto' }} onClick={handleLogout}>Log Out</button>
      </aside>

      <main className="admin-main">
        <header className="admin-header" style={{ display: 'block', paddingBottom: '1.5rem' }}>
          <h1 className="admin-title" style={{ marginBottom: '0.25rem' }}>
            {activeTab === 'lectures' ? 'Lecture Recordings' : 'Study Materials'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Welcome back, <strong style={{ color: '#0f172a' }}>{profile?.name}</strong> • 
            <span className="notion-tag gray" style={{ marginLeft: '0.5rem' }}>{profile?.batch}</span>
          </p>
        </header>

        {/* ========================================= */}
        {/* LECTURES TAB WITH PLAYLISTS               */}
        {/* ========================================= */}
        {activeTab === 'lectures' && (
          <div className="animate-fade-in">
            
            {/* THE VIDEO PLAYER */}
            {activeVideo && (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className="font-medium text-dark" style={{ margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ color: '#3b82f6', marginRight: '8px' }}>▶</span> 
                    {activeVideo.title}
                  </h2>
                  <button onClick={() => setActiveVideo(null)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.5rem' }}>×</button>
                </div>
                <BunnyPlayer videoId={activeVideo.file_url} />
              </div>
            )}

            {/* THE GROUPED PLAYLIST LIST */}
            {Object.keys(playlists).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
                No lectures available for your batch yet.
              </div>
            ) : (
              Object.entries(playlists).map(([playlistName, videos]) => (
                <div key={playlistName} style={{ marginBottom: '2.5rem' }}>
                  {/* Playlist Folder Header */}
                  <div style={{ 
                    padding: '0.85rem 1.25rem', 
                    background: '#f1f5f9', 
                    borderLeft: '4px solid #3b82f6', 
                    borderRadius: '6px 6px 0 0', 
                    fontWeight: '700', 
                    color: '#0f172a',
                    borderTop: '1px solid #e2e8f0',
                    borderRight: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span>📁</span> {playlistName}
                  </div>
                  
                  {/* Playlist Video Table */}
                  <div className="notion-table-container">
                    <table className="notion-table" style={{ tableLayout: 'fixed', width: '100%', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
                      <colgroup>
                        <col style={{ width: 'auto' }} />
                        <col style={{ width: '120px' }} />
                        <col style={{ width: '50px' }} />
                      </colgroup>
                      <tbody>
                        {videos.map(lec => (
                          <tr 
                            key={lec.id} 
                            className="notion-row"
                            style={{ 
                              cursor: 'pointer', 
                              backgroundColor: activeVideo?.id === lec.id ? '#f8fafc' : 'transparent',
                              borderLeft: activeVideo?.id === lec.id ? '3px solid #3b82f6' : '3px solid transparent'
                            }}
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              setActiveVideo(lec);
                            }}
                          >
                            <td className="font-medium text-dark" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {lec.title}
                            </td>
                            <td className="text-muted">
                              {lec.duration !== 'Unknown' ? lec.duration : 'Video'}
                            </td>
                            <td className="actions" style={{ textAlign: 'right' }}>
                              {activeVideo?.id === lec.id ? (
                                <span className="notion-tag blue">Playing</span>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* NOTES TAB                                 */}
        {/* ========================================= */}
        {activeTab === 'notes' && (
          <div className="notion-table-container animate-fade-in">
            <table className="notion-table" style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: 'auto' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '60px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Info / Size</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {notes.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>No study materials available yet.</td></tr>
                ) : (
                  notes.map(note => (
                    <tr key={note.id} className="notion-row">
                      <td className="font-medium text-dark" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ marginRight: '8px', color: '#64748b' }}>📄</span>
                        {note.title}
                      </td>
                      <td className="text-muted">
                        {note.meta_info}
                      </td>
                      <td className="actions" style={{ textAlign: 'right' }}>
                        <a 
                          href={note.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ 
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', background: '#f1f5f9', borderRadius: '6px', color: '#0f172a', transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}