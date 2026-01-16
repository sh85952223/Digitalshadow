import React, { useState, useEffect } from 'react';
import roomBg from '../assets/a_room.png';
import DialLockPopup from './DialLockPopup';
import TermsModal from './TermsModal';

const ARoom = ({ onComplete }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showDialogue, setShowDialogue] = useState(true);
    const [dialogueText, setDialogueText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(0);
    const [showDialLock, setShowDialLock] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [puzzleSolved, setPuzzleSolved] = useState(false);
    const [hoveredHotspot, setHoveredHotspot] = useState(null);
    const [drawerVisited, setDrawerVisited] = useState(false);
    const [foundClauses, setFoundClauses] = useState([]); // Lifted state - persists across modal opens

    const initialDialogue = "A의 방 잠입에 성공했다. 시간이 별로 없다. 빠르게 단서를 찾아야해.";

    const hotspots = [
        { id: 'drawer', label: '서랍 비밀번호', x: 22, y: 78, width: 10, height: 7, isFirst: true, message: null },
        { id: 'phone', label: '휴대폰', x: 36, y: 63, width: 6, height: 8, isFirst: false, message: "아직은 안 돼. 서랍을 먼저 확인해야 할 것 같아." },
        { id: 'papers', label: '침대 위 서류', x: 2, y: 85, width: 25, height: 15, isFirst: false, message: "서류가 흩어져 있네... 나중에 보자." },
        { id: 'mirror', label: '거울', x: 70, y: 13, width: 21, height: 60, isFirst: false, message: "거울이 깨져있네...일단은 다른 것부터 해결하자." }
    ];

    const purpleTheme = {
        primary: '#BF5AF2',
        bg: 'rgba(15, 5, 25, 0.8)',
        border: 'rgba(191, 90, 242, 0.5)',
        glow: 'rgba(191, 90, 242, 0.3)'
    };

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (currentMessage === 0) typeText(initialDialogue);
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

    const handleDialogueClick = () => {
        if (isTyping) return;
        if (currentMessage === 0) {
            setShowDialogue(false);
            setCurrentMessage(1);
        } else if (currentMessage === 2) {
            setShowDialogue(false);
        }
    };

    const handleHotspotClick = (hotspot) => {
        if (puzzleSolved && hotspot.id === 'drawer') {
            showMessage("서랍은 이미 열었어.");
            return;
        }
        if (hotspot.id === 'drawer') {
            setDrawerVisited(true);
            setShowDialLock(true);
            return;
        }
        if (hotspot.id === 'papers') {
            if (drawerVisited) {
                setShowTerms(true);
                return;
            } else {
                showMessage("서류가 흩어져 있네... 서랍을 먼저 확인해보자.");
                return;
            }
        }
        showMessage(hotspot.message);
    };

    const showMessage = (msg) => {
        setShowTerms(false);
        setShowDialogue(true);
        typeText(msg);
        setCurrentMessage(2);
    };

    // Called when wrong clause clicked - close modal and show message with retry hint
    const handleWrongClause = (msg) => {
        setShowTerms(false);
        setShowDialogue(true);
        typeText(msg + " ...약관을 다시 살펴봐.");
        setCurrentMessage(2);
    };

    // Called when correct clause found - add to found list
    const handleCorrectClause = (clauseId) => {
        if (!foundClauses.includes(clauseId)) {
            setFoundClauses(prev => [...prev, clauseId]);
        }
    };

    const handleDialSolved = () => {
        setPuzzleSolved(true);
        setShowDialLock(false);
        showMessage("철컥! 서랍이 열렸다! 안에 뭔가 있는 것 같아...");
        setTimeout(() => {
            if (onComplete) onComplete();
        }, 3000);
    };

    const getHotspotGlow = (hotspot) => {
        const centerX = (hotspot.x + hotspot.width / 2) / 100 * window.innerWidth;
        const centerY = (hotspot.y + hotspot.height / 2) / 100 * window.innerHeight;
        const dist = Math.sqrt(Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2));
        return Math.max(0, 1 - dist / 200);
    };

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

            {/* Dark Overlay with Flashlight */}
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

            {/* Dial Lock Popup */}
            {showDialLock && (
                <DialLockPopup
                    onClose={() => setShowDialLock(false)}
                    onSolved={handleDialSolved}
                    purpleTheme={purpleTheme}
                />
            )}

            {/* Terms Modal - now with persisted foundClauses */}
            {showTerms && (
                <TermsModal
                    onClose={() => setShowTerms(false)}
                    onWrongClause={handleWrongClause}
                    onCorrectClause={handleCorrectClause}
                    foundClauses={foundClauses}
                    purpleTheme={purpleTheme}
                />
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

export default ARoom;
