import React from 'react';

export default function BunnyPlayer({ videoId }) {
  // Replace this with your actual Bunny.net Stream Library ID
  const LIBRARY_ID = "703635"; 

  return (
    <div style={{ 
      position: 'relative', 
      paddingTop: '56.25%', 
      width: '100%', 
      background: '#0f172a', 
      borderRadius: '12px', 
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?autoplay=true&preload=true`}
        loading="lazy"
        style={{
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%'
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
}