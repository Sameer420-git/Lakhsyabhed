import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import BunnyPlayer from '../../components/BunnyPlayer';

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tracks which video the student is currently watching
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function loadStudentData() {
      try {
        // 1. Get the currently logged-in user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return navigate('/login');

        // 2. Fetch their profile to find out their Batch
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // 3. Fetch ONLY the content for their specific batch
        const { data: contentData, error: contentError } = await supabase
          .from('course_content')
          .select('*')
          .eq('batch', profileData.batch)
          .order('created_at', { ascending: false });

        if (contentError) throw contentError;
        setContent(contentData);

        // Optional: Auto-play the most recent lecture if one exists
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

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your classroom...</div>;

  const lectures = content.filter(item => item.content_type === 'lecture');
  const notes = content.filter(item => item.content_type === 'note');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Welcome, {profile?.name}</h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>{profile?.batch} • Student Portal</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
        >
          Log Out
        </button>
      </header>

      {/* MAIN LAYOUT: Video Player on top, lists below */}
      <div style={{ display: 'grid', gap: '2rem' }}>
        
        {/* VIDEO PLAYER SECTION */}
        {activeVideo ? (
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: 0 }}>
              Now Playing: {activeVideo.title}
            </h2>
            <BunnyPlayer videoId={activeVideo.file_url} />
          </div>
        ) : (
          <div style={{ background: '#f8fafc', padding: '3rem', textAlign: 'center', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
            Select a lecture from the list below to start watching.
          </div>
        )}

        {/* CONTENT LISTS (Side by side on desktop) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          {/* LECTURES PLAYLIST */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', background: '#fff' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ▶ Video Lectures
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lectures.length === 0 ? <p style={{ color: '#64748b' }}>No lectures available yet.</p> : null}
              {lectures.map(lec => (
                <button
                  key={lec.id}
                  onClick={() => setActiveVideo(lec)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', padding: '1rem',
                    background: activeVideo?.id === lec.id ? '#eff6ff' : '#f8fafc',
                    border: activeVideo?.id === lec.id ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                    borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontWeight: 500, color: '#0f172a' }}>{lec.title}</span>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{lec.duration}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STUDY MATERIALS & NOTES */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', background: '#fff' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📄 Study Materials
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {notes.length === 0 ? <p style={{ color: '#64748b' }}>No notes available yet.</p> : null}
              {notes.map(note => (
                <a
                  key={note.id}
                  href={note.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', justifyContent: 'space-between', padding: '1rem',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: '8px', textDecoration: 'none', color: 'inherit',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontWeight: 500, color: '#0f172a' }}>{note.title}</span>
                  <span style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: 500 }}>Download</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}