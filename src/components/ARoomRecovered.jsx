import React, { useState, useEffect } from 'react';
import roomBg from '../assets/a_room_recovered.png';
// Import other assets just in case, though interaction logic is simplified
import bedPapersImg from '../assets/bed_papers.png';
import drawerLockImg from '../assets/drawer_lock.png';
import tabletInDrawerImg from '../assets/tablet_in_drawer.png';
// Popup imports might be needed if we decide to re-use them, but for now interactions are simple alerts/dialogues
import DialLockPopup from './DialLockPopup';
import TermsModal from './TermsModal';

const ARoomRecovered = ({ onComplete }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showDialogue, setShowDialogue] = useState(false); // Initially false? Or maybe some entering text?
    const [dialogueText, setDialogueText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Theme for "Me" (Yellow/Warm) - borrowing from TabletHome style or keeping purple? 
    // User said "copy ARoom.jsx exactly... background only changed...". 
    // But then "Recovered Room" implies the "Me" character might have a different vibe?
    // Actually, ARoom used 'purpleTheme'. 
    // The instructions say: "copy ARoom.jsx exactly... background only changed... target positions and movements same...". 
    // So I will keep purpleTheme for consistency with the layout code, unless "Me" dialogue in TabletHome was Yellow.
    // In TabletHome, "Me" is Yellow. In ARoom, it was Purple/Digital.
    // However, the user said "me dialogue window theme from ARoom.jsx" in the TabletHome request. 
    // Here in ARoomRecovered, I should probably stick to the ARoom style (Purple) for the "Investigation" vibe, 
    // OR change it to Yellow if this is "Real World" / "Recovered"?
    // User said: "Now restore the mirror... background change... click drawer 'already opened'..."
    // I will stick to the existing ARoom code style (Purple) to minimize friction/bugs, as requested "almost exactly bring it".

    const purpleTheme = {
        primary: '#BF5AF2',
        bg: 'rgba(15, 5, 25, 0.8)',
        border: 'rgba(191, 90, 242, 0.5)',
        glow: 'rgba(191, 90, 242, 0.3)'
    };

    const hotspots = [
        { id: 'drawer', label: '서랍', x: 22, y: 78, width: 10, height: 7, message: "서랍은 이미 열었어." },
        { id: 'phone', label: '휴대폰', x: 36, y: 63, width: 6, height: 8, message: "숨겨진 쪽지를 먼저 찾아야해." },
        { id: 'papers', label: '침대 위 서류', x: 2, y: 85, width: 25, height: 15, message: "이미 읽었어." },
        { id: 'mirror', label: '거울', x: 70, y: 13, width: 21, height: 60, message: "거울이 돌아왔어. (다음 단계 구현 예정)" }
    ];

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const typeText = (text) => {
        setDialogueText('');
        setIsTyping(true);
        let index = 0;
        const interval = setInterval(() => {
            if (index <= text.length) {
                setDialogueText(text.slice(0, index));
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 30);
    };

    const handleHotspotClick = (hotspot) => {
        // Simple Interaction Logic
        if (hotspot.id === 'mirror') {
            // For now, just show message or do nothing as per "next step implement later"
            showMessage(hotspot.message);
            return;
        }
        showMessage(hotspot.message);
    };

    const showMessage = (msg) => {
        setShowDialogue(true);
        typeText(msg);
    };

    const handleDialogueClick = () => {
        if (isTyping) return;
        setShowDialogue(false);
    };

    // Hotspot Glow Logic (Same as ARoom)
    const getHotspotGlow = (hotspot) => {
        const centerX = (hotspot.x + hotspot.width / 2) / 100 * window.innerWidth;
        const centerY = (hotspot.y + hotspot.height / 2) / 100 * window.innerHeight;
        const dist = Math.sqrt(Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2));
        return Math.max(0, 1 - dist / 200);
    };

    // Hover state
    const [hoveredHotspot, setHoveredHotspot] = useState(null);

    return (
        <div style={{
            width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden',
            cursor: 'none', background: '#000', fontFamily: '"Pretendard Variable", Pretendard, sans-serif'
        }}>
            {/* Room Background */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '140%', height: '140%', backgroundImage: `url(${roomBg})`,
                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', zIndex: 1
            }}></div>

            {/* Dark Overlay with Flashlight - Same as ARoom */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.92) 100%)`,
                pointerEvents: 'none', zIndex: 5
            }}></div>

            {/* Hotspots */}
            {hotspots.map(hotspot => {
                const glow = getHotspotGlow(hotspot);
                if (glow <= 0.1) return null;
                return (
                    <div key={hotspot.id} onClick={() => handleHotspotClick(hotspot)}
                        onMouseEnter={() => setHoveredHotspot(hotspot.id)} onMouseLeave={() => setHoveredHotspot(null)}
                        style={{
                            position: 'absolute', left: `${hotspot.x}%`, top: `${hotspot.y}%`,
                            width: `${hotspot.width}%`, height: `${hotspot.height}%`,
                            cursor: 'pointer', zIndex: 10, opacity: glow, transition: 'opacity 0.2s'
                        }}>
                        {hoveredHotspot === hotspot.id && (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', animation: 'lockOn 0.4s cubic-bezier(0.1, 0.9, 0.2, 1.0) forwards' }}>
                                <div style={{ position: 'absolute', top: '-8px', left: '-8px', width: '25px', height: '25px', borderTop: `6px solid ${purpleTheme.primary}`, borderLeft: `6px solid ${purpleTheme.primary}`, boxShadow: `0 0 20px ${purpleTheme.primary}` }}></div>
                                <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '25px', height: '25px', borderTop: `6px solid ${purpleTheme.primary}`, borderRight: `6px solid ${purpleTheme.primary}`, boxShadow: `0 0 20px ${purpleTheme.primary}` }}></div>
                                <div style={{ position: 'absolute', bottom: '-8px', left: '-8px', width: '25px', height: '25px', borderBottom: `6px solid ${purpleTheme.primary}`, borderLeft: `6px solid ${purpleTheme.primary}`, boxShadow: `0 0 20px ${purpleTheme.primary}` }}></div>
                                <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '25px', height: '25px', borderBottom: `6px solid ${purpleTheme.primary}`, borderRight: `6px solid ${purpleTheme.primary}`, boxShadow: `0 0 20px ${purpleTheme.primary}` }}></div>
                            </div>
                        )}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '4px', height: '4px', background: purpleTheme.primary, borderRadius: '50%', opacity: 0.5 }}></div>
                        {hoveredHotspot === hotspot.id && (
                            <div style={{ position: 'absolute', top: '-40px', left: '0', color: purpleTheme.primary, fontSize: '1rem', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '1px', textShadow: `0 0 5px ${purpleTheme.primary}` }}>TARGET_DETECTED</div>
                        )}
                    </div>
                );
            })}

            {/* Dialogue Box */}
            {showDialogue && (
                <div onClick={handleDialogueClick} style={{
                    position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                    width: '70%', maxWidth: '1000px', minHeight: '200px', background: purpleTheme.bg,
                    border: `1px solid ${purpleTheme.border}`, boxShadow: `0 0 30px ${purpleTheme.glow}`,
                    backdropFilter: 'blur(16px)', clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                    zIndex: 100, cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: '0'
                }}>
                    <div style={{ width: '100%', height: '35px', background: `linear-gradient(90deg, rgba(191, 90, 242, 0.15) 0%, transparent 100%)`, borderBottom: `1px solid ${purpleTheme.border}`, display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                        <div style={{ width: '8px', height: '8px', background: purpleTheme.primary, marginRight: '15px', borderRadius: '50%', boxShadow: `0 0 8px ${purpleTheme.primary}` }}></div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: purpleTheme.primary, letterSpacing: '2px', fontWeight: 'bold' }}>DIGITAL INVESTIGATION // PRIVATE_ROOM</span>
                    </div>
                    <div style={{ padding: '2rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(191, 90, 242, 0.15)', padding: '0.4rem 1.5rem', borderLeft: `4px solid ${purpleTheme.primary}`, marginBottom: '1.2rem', width: 'fit-content' }}>
                            <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.05em' }}>나</span>
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.6rem', lineHeight: '1.6', margin: 0, fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {dialogueText}
                            {isTyping && <span className="cursor-blink" style={{ color: purpleTheme.primary, marginLeft: '5px' }}>|</span>}
                        </p>
                    </div>
                    {!isTyping && (
                        <div style={{ position: 'absolute', bottom: '20px', right: '30px', color: purpleTheme.primary, fontSize: '1.2rem', fontWeight: 'bold', animation: 'bounce 1s infinite', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            NEXT <span style={{ fontSize: '1.0rem' }}>▼</span>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
                @keyframes lockOn { 0% { transform: scale(2.0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .cursor-blink { animation: blink 1s step-end infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

export default ARoomRecovered;
