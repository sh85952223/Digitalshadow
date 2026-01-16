import React, { useState, useEffect } from 'react';
import IntroPage from './components/IntroPage';
import InvestigationHQ from './components/InvestigationHQ';
import ARoom from './components/ARoom';
import './styles/FlashlightEffect.css'; // For global cursor styling

function App() {
  const [stage, setStage] = useState('intro'); // 'intro', 'hq', ...
  const [devMenuOpen, setDevMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Define all available pages for easy expansion
  const pages = [
    { key: 'intro', label: 'Intro' },
    { key: 'hq', label: 'HQ' },
    { key: 'room', label: 'A\'s Room' },
    // Add more pages here as they are created
  ];

  // Global mouse position tracking for cursor (only needed for non-intro pages)
  useEffect(() => {
    if (stage === 'intro') return; // Skip tracking on intro page

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [stage]);

  return (
    <div className="App" style={{ position: 'relative' }}>
      {/* Digital Cursor - Only for non-intro pages (HQ and onwards) */}
      {/* IntroPage handles its own cursor during Auth phase */}
      {stage !== 'intro' && (
        <div
          className="digital-cursor"
          style={{
            '--x': `${mousePos.x}px`,
            '--y': `${mousePos.y}px`
          }}
        ></div>
      )}

      {/* Hidden Developer Tools - Dropdown Style */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 9999,
        opacity: 0,
        transition: 'opacity 0.2s',
        fontFamily: 'sans-serif'
      }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0; setDevMenuOpen(false); }}
      >
        {/* Dropdown Toggle Button */}
        <button
          onClick={() => setDevMenuOpen(prev => !prev)}
          style={{
            color: 'white',
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid #555',
            padding: '8px 15px',
            cursor: 'none',
            borderBottomLeftRadius: devMenuOpen ? '0' : '10px',
            borderBottomRightRadius: '0',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🛠 Dev <span style={{ fontSize: '0.7rem' }}>{devMenuOpen ? '▲' : '▼'}</span>
        </button>

        {/* Dropdown Menu */}
        {devMenuOpen && (
          <div style={{
            background: 'rgba(0,0,0,0.9)',
            borderBottomLeftRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 5px 20px rgba(0,0,0,0.5)'
          }}>
            {pages.map(page => (
              <button
                key={page.key}
                onClick={() => { setStage(page.key); setDevMenuOpen(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  color: stage === page.key ? '#4fc3f7' : 'white',
                  background: stage === page.key ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #333',
                  padding: '10px 20px',
                  cursor: 'none',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = stage === page.key ? 'rgba(79, 195, 247, 0.15)' : 'transparent'}
              >
                {page.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stage-based Rendering */}
      {stage === 'intro' && (
        <IntroPage onComplete={() => setStage('hq')} />
      )}
      {stage === 'hq' && (
        <InvestigationHQ onComplete={() => setStage('room')} />
      )}
      {stage === 'room' && (
        <ARoom onComplete={() => console.log('Room puzzle solved!')} />
      )}
    </div>
  );
}

export default App;
