import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import BunnyPlayer from '../../components/BunnyPlayer';

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

        const latestLecture = contentData.find(item => item.content_type === 'lecture');
        if (latestLecture) setActiveVideo(latestLecture);

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
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <p className="text-muted font-medium">Loading your classroom...</p>
      </div>
    );
  }

  const lectures = content.filter(item => item.content_type === 'lecture');
  const notes = content.filter(item => item.content_type === 'note');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '3rem 1.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', animation: 'slideUp 0.3s ease-out' }}>
        
        {/* --- HEADER --- */}
        <header className="admin-header" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h1 className="admin-title">Student Portal</h1>
            <p className="admin-subtitle" style={{ marginTop: '0.5rem' }}>
              Welcome back, {profile?.name} • <span className="notion-tag gray" style={{ marginLeft: '0.5rem' }}>{profile?.batch}</span>
            </p>
          </div>
          <button className="btn-notion-secondary" onClick={handleLogout}>
            Log Out
          </button>
        </header>

        {/* --- VIDEO PLAYER BLOCK --- */}
        {activeVideo ? (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '3.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="font-medium text-dark" style={{ margin: 0, fontSize: '1.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <span style={{ color: '#3b82f6', marginRight: '8px' }}>▶</span> 
                {activeVideo.title}
              </h2>
              <span className="notion-tag blue" style={{ flexShrink: 0 }}>Now Playing</span>
            </div>
            <BunnyPlayer videoId={activeVideo.file_url} />
          </div>
        ) : (
          <div style={{ border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center', marginBottom: '3.5rem', background: '#f8fafc' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🎓</span>
            <h3 className="font-medium text-dark" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Ready to learn?</h3>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>Select a video lecture from your syllabus below to begin streaming.</p>
          </div>
        )}

        {/* --- CONTENT TABLES (SIDE-BY-SIDE) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          
          {/* LECTURE PLAYLIST */}
          <div className="cms-section" style={{ width: '100%' }}>
            <h3 className="cms-section-title" style={{ fontSize: '1.05rem' }}>Lecture Syllabus</h3>
            {/* OVERRIDE OVERFLOW AND MIN-WIDTH HERE */}
            <div className="notion-table-container" style={{ overflowX: 'hidden' }}>
              <table className="notion-table" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%' }}>
                {/* STRICT COLUMN SIZING */}
                <colgroup>
                  <col style={{ width: 'auto' }} />     {/* Title takes remaining space */}
                  <col style={{ width: '70px' }} />     {/* Duration locked to 70px */}
                  <col style={{ width: '40px' }} />     {/* Icon locked to 40px */}
                </colgroup>
                <tbody>
                  {lectures.length === 0 && (
                    <tr><td colSpan="3" className="text-muted" style={{ padding: '1.5rem 1rem', fontSize: '0.9rem' }}>No lectures posted yet.</td></tr>
                  )}
                  {lectures.map(lec => (
                    <tr 
                      key={lec.id} 
                      className="notion-row"
                      style={{ 
                        cursor: 'pointer', 
                        backgroundColor: activeVideo?.id === lec.id ? '#f1f5f9' : 'transparent',
                        borderLeft: activeVideo?.id === lec.id ? '3px solid #0f172a' : '3px solid transparent'
                      }}
                      onClick={() => setActiveVideo(lec)}
                    >
                      <td className="font-medium text-dark" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '0.5rem', fontSize: '0.9rem' }}>
                        {lec.title}
                      </td>
                      <td className="text-muted" style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        {lec.duration !== 'Unknown' ? lec.duration : 'Video'}
                      </td>
                      <td className="actions" style={{ textAlign: 'right', paddingRight: '0.5rem' }}>
                        {activeVideo?.id === lec.id ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#3b82f6', verticalAlign: 'middle' }}><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8', verticalAlign: 'middle' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STUDY MATERIALS */}
          <div className="cms-section" style={{ width: '100%' }}>
            <h3 className="cms-section-title" style={{ fontSize: '1.05rem' }}>Study Materials & Notes</h3>
            {/* OVERRIDE OVERFLOW AND MIN-WIDTH HERE */}
            <div className="notion-table-container" style={{ overflowX: 'hidden' }}>
              <table className="notion-table" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%' }}>
                {/* STRICT COLUMN SIZING */}
                <colgroup>
                  <col style={{ width: 'auto' }} />     {/* Title takes remaining space */}
                  <col style={{ width: '70px' }} />     {/* Size locked to 70px */}
                  <col style={{ width: '40px' }} />     {/* Icon locked to 40px */}
                </colgroup>
                <tbody>
                  {notes.length === 0 && (
                    <tr><td colSpan="3" className="text-muted" style={{ padding: '1.5rem 1rem', fontSize: '0.9rem' }}>No materials posted yet.</td></tr>
                  )}
                  {notes.map(note => (
                    <tr key={note.id} className="notion-row">
                      <td className="font-medium text-dark" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ marginRight: '6px', color: '#94a3b8' }}>📄</span>
                        {note.title}
                      </td>
                      <td className="text-muted" style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        {note.meta_info}
                      </td>
                      <td className="actions" style={{ textAlign: 'right', paddingRight: '0.5rem' }}>
                        <a href={note.file_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', lineHeight: 0 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s', verticalAlign: 'middle' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}