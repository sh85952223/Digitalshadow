import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import roomBg from '../assets/a_room_recovered.png';
import mirrorBrokenImg from '../assets/uploaded_image_0_1768809857358.jpg';
import mirrorRestoredImg from '../assets/uploaded_image_1_1768809857358.png';
import hiddenNoteImg from '../assets/uploaded_image_2_1768809857358.png';
import cursorImg from '../assets/flashlight_cursor_v3_1768538468305.png';
// Import other assets just in case, though interaction logic is simplified
import bedPapersImg from '../assets/bed_papers.png';
import drawerLockImg from '../assets/drawer_lock.png';
import tabletInDrawerImg from '../assets/tablet_in_drawer.png';
// Popup imports might be needed if we decide to re-use them, but for now interactions are simple alerts/dialogues
import DialLockPopup from './DialLockPopup';
import TermsModal from './TermsModal';
import PhoneAuth from './PhoneAuth';

const ARoomRecovered = ({ onComplete }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showDialogue, setShowDialogue] = useState(false); // Initially false? Or maybe some entering text?
    const [dialogueText, setDialogueText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [dialogueQueue, setDialogueQueue] = useState([]);

    // Mirror Sequence States
    const [showMirrorModal, setShowMirrorModal] = useState(false);
    const [mirrorStage, setMirrorStage] = useState('broken'); // 'broken', 'restoring', 'restored', 'note'
    const [isRestoring, setIsRestoring] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [pendingMirrorAction, setPendingMirrorAction] = useState(null);
    const [mirrorChecked, setMirrorChecked] = useState(false);
    const [showPhoneAuth, setShowPhoneAuth] = useState(false);

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
        { id: 'papers', label: '침대 위 서류', x: 2, y: 85, width: 25, height: 15, message: "이미 읽었어." },
        { id: 'mirror', label: '거울', x: 70, y: 13, width: 21, height: 60, message: "거울이 돌아왔어." },
        { id: 'phone', label: '휴대폰', x: 36, y: 63, width: 6, height: 8, message: "휴대폰이 놓여있어." }
    ];

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const typeText = (text, queue = []) => {
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
                if (queue.length > 0) {
                    setDialogueQueue(queue);
                }
            }
        }, 30);
    };

    const handleHotspotClick = (hotspot) => {
        if (hotspot.id === 'drawer') {
            showMessage("서랍은 이미 열었어.");
            return;
        }
        if (hotspot.id === 'phone') {
            if (!mirrorChecked) {
                showMessage("거울 쪽에 뭔가 있을 것 같아.");
            } else {
                setPendingMirrorAction('phoneAuthStart');
                showMessage("A의 휴대폰에 암호를 입력하자.");
            }
            return;
        }
        if (hotspot.id === 'mirror') {
            setShowMirrorModal(true);
            setMirrorStage('broken');
            setIsRestoring(false);

            // Start restoration after 1s
            setTimeout(() => {
                setIsRestoring(true);
                setMirrorStage('restoring');
                setTimeout(() => {
                    setMirrorStage('restored');
                    setIsRestoring(false);
                    // Trigger dialogue after restoration
                    setPendingMirrorAction('restoredText');
                    showMessage("이게 메모에서 말한 '스스로 형태를 찾은 조각난 진실'이라는 거구나!");
                }, 2000); // 2s restoration animation
            }, 1000);
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

        if (dialogueQueue.length > 0) {
            const nextMsg = dialogueQueue[0];
            setDialogueQueue(prev => prev.slice(1));
            typeText(nextMsg);
        } else {
            setShowDialogue(false);

            // Check for pending actions after dialogue ends
            if (pendingMirrorAction === 'restoredText') {
                setPendingMirrorAction(null);
                // Transition to note stage
                setMirrorStage('note');
                // Sequence of dialogues for the note
                setTimeout(() => {
                    typeText("이게 휴대폰의 암호..?", [
                        "종이가 아래쪽 반절이 찢어졌네...거울 뒤에 숨긴 건 이유가 있을텐데..."
                    ]);
                    setShowDialogue(true);
                }, 500);
            } else if (pendingMirrorAction === 'phoneAuthStart') {
                setPendingMirrorAction(null);
                setShowPhoneAuth(true);
            }
        }
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
            {showDialogue && createPortal(
                <div onClick={handleDialogueClick} style={{
                    position: 'fixed', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                    width: '70%', maxWidth: '1000px', minHeight: '250px', background: purpleTheme.bg,
                    border: `1px solid ${purpleTheme.border}`, boxShadow: `0 0 30px ${purpleTheme.glow}`,
                    backdropFilter: 'blur(16px)', clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                    zIndex: 20000, cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: '0'
                }}>
                    <div style={{ width: '100%', height: '35px', background: `linear-gradient(90deg, rgba(191, 90, 242, 0.15) 0%, transparent 100%)`, borderBottom: `1px solid ${purpleTheme.border}`, display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                        <div style={{ width: '8px', height: '8px', background: purpleTheme.primary, marginRight: '15px', borderRadius: '50%', boxShadow: `0 0 8px ${purpleTheme.primary}` }}></div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: purpleTheme.primary, letterSpacing: '2px', fontWeight: 'bold' }}>DIGITAL INVESTIGATION // PRIVATE_ROOM</span>
                    </div>
                    <div style={{ padding: '2.5rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(191, 90, 242, 0.15)', padding: '0.4rem 1.5rem', borderLeft: `4px solid ${purpleTheme.primary}`, marginBottom: '1rem', width: 'fit-content' }}>
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
                </div>,
                document.body
            )}

            {/* Mirror Recovery Modal */}
            {showMirrorModal && createPortal(
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.5s ease-out'
                }} onClick={() => { if (!isRestoring && mirrorStage === 'note' && !showDialogue) setShowMirrorModal(false); }}>

                    <div style={{
                        width: '90%', maxWidth: '900px', height: '80%', position: 'relative',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }} onClick={e => e.stopPropagation()}>

                        {/* Mirror Frame / Container */}
                        <div style={{
                            width: '100%', height: '100%', position: 'relative',
                            borderRadius: '12px', overflow: 'hidden', border: `2px solid ${purpleTheme.border}`,
                            boxShadow: `0 0 50px ${purpleTheme.glow}`
                        }}>
                            {/* Stage: Broken */}
                            <img src={mirrorBrokenImg} alt="Broken Mirror" style={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                                opacity: (mirrorStage === 'broken' || mirrorStage === 'restoring') ? 1 : 0,
                                transition: 'opacity 1s ease-in-out'
                            }} />

                            {/* Stage: Restored (Overlay) */}
                            <img src={mirrorRestoredImg} alt="Restored Mirror" style={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                                opacity: (mirrorStage === 'restored' || mirrorStage === 'note' || mirrorStage === 'restoring' && isRestoring) ? 1 : 0,
                                transition: 'opacity 2s ease-in-out',
                                filter: isRestoring ? 'blur(10px)' : 'none'
                            }} />

                            {/* Stage: Note (Centered on top) */}
                            {mirrorStage === 'note' && (
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.3)', animation: 'fadeIn 1s ease-out'
                                }}>
                                    <div style={{
                                        position: 'relative', width: '60%', maxWidth: '500px',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
                                    }}>
                                        <img src={hiddenNoteImg} alt="Hidden Note" style={{
                                            width: '100%', height: 'auto', borderRadius: '4px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                            transform: 'rotate(-2deg)'
                                        }} />

                                        {/* Hint Button (Only in Note Stage & after dialogue) */}
                                        {!showDialogue && (
                                            <button
                                                onClick={() => setShowHint(true)}
                                                style={{
                                                    background: '#BF5AF2',
                                                    border: 'none', color: '#fff', padding: '12px 28px',
                                                    borderRadius: '24px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 5px 20px rgba(191,90,242,0.4)',
                                                    animation: 'fadeIn 0.5s ease-out'
                                                }}
                                            >
                                                💡 힌트 보기
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Restoration Visual Effect (Scanline/Glow) */}
                            {isRestoring && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    background: 'linear-gradient(to bottom, transparent 45%, #BF5AF2 50%, transparent 55%)',
                                    backgroundSize: '100% 200%',
                                    animation: 'scanning 2s linear infinite',
                                    opacity: 0.7, zIndex: 10
                                }}></div>
                            )}
                        </div>

                        {/* Hint Overlay */}
                        {showHint && (
                            <div style={{
                                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)',
                                zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '40px', textAlign: 'center', borderRadius: '12px',
                                animation: 'fadeIn 0.3s ease-out'
                            }} onClick={() => setShowHint(false)}>
                                <div style={{ maxWidth: '500px' }}>
                                    <h3 style={{ color: '#BF5AF2', marginBottom: '25px', fontSize: '1.8rem', letterSpacing: '4px' }}>💡 HINT</h3>
                                    <p style={{ color: '#fff', fontSize: '1.7rem', lineHeight: '1.6', wordBreak: 'keep-all', marginBottom: '35px' }}>
                                        "여기에 거울을 가져다대면 어떤 글자가 될까?<br />
                                        숨는다는 뜻일 것 같아."
                                    </p>
                                    <button style={{
                                        background: '#BF5AF2', color: '#fff', border: 'none',
                                        padding: '12px 40px', borderRadius: '8px', cursor: 'pointer',
                                        fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(191,90,242,0.5)'
                                    }}>확인</button>
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        {mirrorStage === 'note' && !showDialogue && !showHint && (
                            <button
                                onClick={() => {
                                    setShowMirrorModal(false);
                                    setMirrorChecked(true);
                                    setTimeout(() => {
                                        showMessage("암호를 알아냈다면 휴대폰에 입력해보자.");
                                    }, 500);
                                }}
                                style={{
                                    position: 'absolute', top: '20px', right: '-60px', background: 'none',
                                    border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', opacity: 0.7
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* Phone Authentication */}
            {showPhoneAuth && (
                <PhoneAuth
                    onComplete={() => onComplete()} // Proceed to next phase
                    onReturnToMirror={() => {
                        setShowPhoneAuth(false);
                        // Optional: show a message when returning
                        setTimeout(() => {
                            showMessage("거울에서 다시 힌트를 찾아보자.");
                        }, 500);
                    }}
                />
            )}

            {/* Global Custom Cursor */}
            {createPortal(
                <img
                    src={cursorImg}
                    alt="cursor"
                    style={{
                        position: 'fixed',
                        left: mousePos.x,
                        top: mousePos.y,
                        width: '32px',
                        height: '32px',
                        pointerEvents: 'none',
                        zIndex: 99999,
                        transform: 'translate(-2px, -2px)'
                    }}
                />,
                document.body
            )}

            <style>{`
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
                @keyframes lockOn { 0% { transform: scale(2.0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes scanning { 0% { background-position: 0 -100%; } 100% { background-position: 0 100%; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .cursor-blink { animation: blink 1s step-end infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

export default ARoomRecovered;
