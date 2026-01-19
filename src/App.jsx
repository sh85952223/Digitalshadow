import React, { useState, useEffect } from 'react';
import IntroPage from './components/IntroPage';
import InvestigationHQ from './components/InvestigationHQ';
import ARoom from './components/ARoom';
import ARoomRecovered from './components/ARoomRecovered';
import TabletScreen from './components/TabletScreen';
import './styles/FlashlightEffect.css'; // For global cursor styling

function App() {
  const [stage, setStage] = useState('intro'); // 'intro', 'hq', ...
  const [tabletPhase, setTabletPhase] = useState(null); // For Tablet dev menu
  const [devMenuOpen, setDevMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Define all available pages for easy expansion
  const pages = [
    { key: 'intro', label: 'Intro' },
    { key: 'hq', label: 'HQ' },
    { key: 'room', label: 'A\'s Room' },
    { key: 'room_recovered', label: 'A\'s Room (Recovered)' },
    // Tablet Expanded Options
    { key: 'tablet-off', label: '📱 Tablet (OFF)', type: 'tablet', phase: 'off' },
    { key: 'tablet-p1', label: '📱 Tablet (P1: Noti)', type: 'tablet', phase: 'p1' },
    { key: 'tablet-p2', label: '📱 Tablet (P2: Splash)', type: 'tablet', phase: 'p2' },
    { key: 'tablet-p3', label: '📱 Tablet (P3: Intro)', type: 'tablet', phase: 'p3' },
    { key: 'tablet-p4', label: '📱 Tablet (P4: Input)', type: 'tablet', phase: 'p4' },
    // Recovery Mission Stages
    { key: 'rec-intro', label: '🛑 Recovery (Intro)', type: 'tablet', phase: 'recovery_intro' },
    { key: 'rec-settings', label: '🛑 Recovery (Settings)', type: 'tablet', phase: 'recovery_settings' },
    { key: 'rec-payment', label: '🛑 Recovery (Payment)', type: 'tablet', phase: 'recovery_payment' },
    { key: 'rec-svc', label: '🛑 Recovery (Service Mgmt)', type: 'tablet', phase: 'recovery_service_mgmt' },
    { key: 'rec-p1', label: '🛑 Recovery (Popup 1)', type: 'tablet', phase: 'recovery_popup1' },
    { key: 'rec-p2', label: '🛑 Recovery (Popup 2)', type: 'tablet', phase: 'recovery_popup2' },
    { key: 'rec-p3', label: '🛑 Recovery (Popup 3)', type: 'tablet', phase: 'recovery_popup3' },
  ];

  const handlePageChange = (page) => {
    if (page.type === 'tablet') {
      setStage('tablet');
      setTabletPhase(page.phase);
    } else {
      setStage(page.key);
      setTabletPhase(null);
    }
    setDevMenuOpen(false);
  };

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
            boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            {pages.map(page => (
              <button
                key={page.key}
                onClick={() => handlePageChange(page)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  color: (stage === page.key || (page.type === 'tablet' && stage === 'tablet' && tabletPhase === page.phase)) ? '#4fc3f7' : 'white',
                  background: (stage === page.key || (page.type === 'tablet' && stage === 'tablet' && tabletPhase === page.phase)) ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #333',
                  padding: '10px 20px',
                  cursor: 'none',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.background = (stage === page.key || (page.type === 'tablet' && stage === 'tablet' && tabletPhase === page.phase)) ? 'rgba(79, 195, 247, 0.15)' : 'transparent'}
              >
                {page.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stage-based Rendering */}
      {stage === 'intro' && <IntroPage onComplete={() => setStage('hq')} />}
      {stage === 'hq' && <InvestigationHQ onComplete={() => setStage('room')} />}
      {stage === 'room' && <ARoom onComplete={() => setStage('tablet')} />}
      {stage === 'room_recovered' && <ARoomRecovered onComplete={() => { }} />}
      {stage === 'tablet' && <TabletScreen
        onComplete={() => setStage('hq')}
        initialPhase={tabletPhase}
        onReturnToRoom={() => setStage('room_recovered')}
      />}
    </div>
  );
}

export default App;

