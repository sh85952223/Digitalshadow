import React, { useState, useEffect } from 'react';
import roomBg from '../assets/a_room.png';

const ARoom = ({ onComplete }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showDialogue, setShowDialogue] = useState(true);
    const [dialogueText, setDialogueText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(0);
    const [showDialLock, setShowDialLock] = useState(false);
    const [dialValues, setDialValues] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [puzzleSolved, setPuzzleSolved] = useState(false);
    const [hoveredHotspot, setHoveredHotspot] = useState(null);
    const [dragging, setDragging] = useState({ active: false, index: null, startY: 0 });
    const [rotationAngles, setRotationAngles] = useState([0, 0, 0, 0, 0, 0, 0, 0]); // Cumulative rotation for smooth animation

    const initialDialogue = "A의 방 잠입에 성공했다. 시간이 별로 없다. 빠르게 단서를 찾아야해.";
    const correctCode = [3, 2, 4, 2, 5, 1, 6, 1];

    // Hotspot definitions with positions and messages
    const hotspots = [
        {
            id: 'drawer',
            label: '서랍 비밀번호',
            x: 22, y: 78, width: 10, height: 7,
            isFirst: true,
            message: null // Opens dial lock
        },
        {
            id: 'phone',
            label: '휴대폰',
            x: 36, y: 63, width: 6, height: 8,
            isFirst: false,
            message: "아직은 안 돼. 서랍을 먼저 확인해야 할 것 같아."
        },
        {
            id: 'papers',
            label: '침대 위 서류',
            x: 2, y: 85, width: 25, height: 15,
            isFirst: false,
            message: "서류가 흩어져 있네... 나중에 보자."
        },
        {
            id: 'mirror',
            label: '거울',
            x: 70, y: 13, width: 21, height: 60,
            isFirst: false,
            message: "거울이 깨져있네...일단은 다른 것부터 해결하자."
        }
    ];

    // Mouse tracking for flashlight
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Initial dialogue typing effect
    useEffect(() => {
        if (currentMessage === 0) {
            typeText(initialDialogue);
        }
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

        if (hotspot.isFirst || puzzleSolved) {
            if (hotspot.id === 'drawer') {
                setShowDialLock(true);
            }
        } else {
            showMessage(hotspot.message);
        }
    };

    const showMessage = (msg) => {
        setShowDialogue(true);
        typeText(msg);
        setCurrentMessage(2);
    };

    const handleDialChange = (index, direction) => {
        setDialValues(prev => {
            const newVals = [...prev];
            newVals[index] = (newVals[index] + direction + 10) % 10;
            return newVals;
        });
        // Update cumulative rotation for smooth animation
        setRotationAngles(prev => {
            const newAngles = [...prev];
            newAngles[index] = prev[index] + (direction * 36); // Add rotation continuously
            return newAngles;
        });
    };

    // Drag handlers for dials
    const handleDialMouseDown = (index, e) => {
        e.preventDefault();
        setDragging({ active: true, index, startY: e.clientY });
    };

    const handleDialMouseMove = (e) => {
        if (!dragging.active) return;
        const deltaY = dragging.startY - e.clientY;
        const threshold = 30; // pixels to move for one digit change

        if (Math.abs(deltaY) >= threshold) {
            const direction = deltaY > 0 ? -1 : 1; // Up drag = decrease, Down drag = increase
            handleDialChange(dragging.index, direction);
            setDragging(prev => ({ ...prev, startY: e.clientY }));
        }
    };

    const handleDialMouseUp = () => {
        setDragging({ active: false, index: null, startY: 0 });
    };

    // Global mouse events for drag
    useEffect(() => {
        if (showDialLock) {
            window.addEventListener('mousemove', handleDialMouseMove);
            window.addEventListener('mouseup', handleDialMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleDialMouseMove);
                window.removeEventListener('mouseup', handleDialMouseUp);
            };
        }
    }, [showDialLock, dragging.active, dragging.index, dragging.startY]);

    const checkCode = () => {
        const isCorrect = dialValues.every((val, idx) => val === correctCode[idx]);
        if (isCorrect) {
            setPuzzleSolved(true);
            setShowDialLock(false);
            showMessage("철컥! 서랍이 열렸다! 안에 뭔가 있는 것 같아...");
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 3000);
        }
    };

    const getHotspotGlow = (hotspot) => {
        const centerX = (hotspot.x + hotspot.width / 2) / 100 * window.innerWidth;
        const centerY = (hotspot.y + hotspot.height / 2) / 100 * window.innerHeight;
        const dist = Math.sqrt(Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2));
        const maxDist = 200;
        return Math.max(0, 1 - dist / maxDist);
    };

    const purpleTheme = {
        primary: '#BF5AF2',
        bg: 'rgba(15, 5, 25, 0.8)', // More transparent for glassmorphism
        border: 'rgba(191, 90, 242, 0.5)',
        glow: 'rgba(191, 90, 242, 0.3)'
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'none',
            background: '#000', // Black background behind the image
            fontFamily: '"Pretendard Variable", Pretendard, sans-serif'
        }}>
            {/* Room Background - Scaled to fit */}
            {/* USER GUIDE: 아래 width/height 퍼센트를 조절하면 사진 크기를 변경할 수 있습니다 (현재 95%) */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '140%',
                height: '140%',
                backgroundImage: `url(${roomBg})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                zIndex: 1
            }}></div>

            {/* Dark Overlay with Flashlight Hole - Adjusted to match screen */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.92) 100%)`, // Slightly darker for contrast
                pointerEvents: 'none',
                zIndex: 5
            }}></div>

            {/* Hotspots */}
            {hotspots.map(hotspot => {
                const glow = getHotspotGlow(hotspot);
                if (glow <= 0.1) return null; // Don't render if too far

                return (
                    <div
                        key={hotspot.id}
                        onClick={() => handleHotspotClick(hotspot)}
                        onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                        onMouseLeave={() => setHoveredHotspot(null)}
                        style={{
                            position: 'absolute',
                            left: `${hotspot.x}%`,
                            top: `${hotspot.y}%`,
                            width: `${hotspot.width}%`,
                            height: `${hotspot.height}%`,
                            cursor: 'pointer',
                            zIndex: 10,
                            opacity: glow, // Fade in based on distance
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {/* Futuristic Corners - Enhanced Impact */}
                        {hoveredHotspot === hotspot.id && (
                            <>
                                {/* Animated Wrapper for True "Narrowing" Effect */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    animation: 'lockOn 0.4s cubic-bezier(0.1, 0.9, 0.2, 1.0) forwards' // Snap effect
                                }}>
                                    <div style={{
                                        position: 'absolute', top: '-8px', left: '-8px', width: '25px', height: '25px',
                                        borderTop: `6px solid ${purpleTheme.primary}`, borderLeft: `6px solid ${purpleTheme.primary}`,
                                        boxShadow: `0 0 20px ${purpleTheme.primary}, inset 0 0 10px ${purpleTheme.primary}`
                                    }}></div>
                                    <div style={{
                                        position: 'absolute', top: '-8px', right: '-8px', width: '25px', height: '25px',
                                        borderTop: `6px solid ${purpleTheme.primary}`, borderRight: `6px solid ${purpleTheme.primary}`,
                                        boxShadow: `0 0 20px ${purpleTheme.primary}, inset 0 0 10px ${purpleTheme.primary}`
                                    }}></div>
                                    <div style={{
                                        position: 'absolute', bottom: '-8px', left: '-8px', width: '25px', height: '25px',
                                        borderBottom: `6px solid ${purpleTheme.primary}`, borderLeft: `6px solid ${purpleTheme.primary}`,
                                        boxShadow: `0 0 20px ${purpleTheme.primary}, inset 0 0 10px ${purpleTheme.primary}`
                                    }}></div>
                                    <div style={{
                                        position: 'absolute', bottom: '-8px', right: '-8px', width: '25px', height: '25px',
                                        borderBottom: `6px solid ${purpleTheme.primary}`, borderRight: `6px solid ${purpleTheme.primary}`,
                                        boxShadow: `0 0 20px ${purpleTheme.primary}, inset 0 0 10px ${purpleTheme.primary}`
                                    }}></div>
                                </div>

                                {/* Flash Overlay on Detection */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    background: purpleTheme.primary,
                                    opacity: 0,
                                    animation: 'flash 0.3s ease-out'
                                }}></div>
                            </>
                        )}

                        {/* Center Crosshair (Subtle) */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '4px', height: '4px', background: purpleTheme.primary, borderRadius: '50%',
                            opacity: 0.5
                        }}></div>

                        {/* Analysis Label */}
                        {hoveredHotspot === hotspot.id && (
                            <div style={{
                                position: 'absolute',
                                top: '-40px',
                                left: '0',
                                color: purpleTheme.primary,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                fontFamily: 'monospace',
                                letterSpacing: '1px',
                                textShadow: `0 0 5px ${purpleTheme.primary}`,
                                animation: 'typing 0.5s steps(10, end)'
                            }}>
                                TARGET_DETECTED
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Purple Glassmorphism Dialogue Box */}
            {showDialogue && (
                <div
                    onClick={handleDialogueClick}
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '70%',
                        maxWidth: '1000px',
                        minHeight: '200px',
                        background: purpleTheme.bg,
                        border: `1px solid ${purpleTheme.border}`,
                        boxShadow: `0 0 30px ${purpleTheme.glow}, inset 0 0 20px rgba(191, 90, 242, 0.1)`,
                        backdropFilter: 'blur(16px)',
                        /* Clip path matching HQ style */
                        clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                        zIndex: 100,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0' // Reset padding for inner layout
                    }}
                >
                    {/* Tech Header Line */}
                    <div style={{
                        width: '100%',
                        height: '35px',
                        background: `linear-gradient(90deg, rgba(191, 90, 242, 0.15) 0%, transparent 100%)`,
                        borderBottom: `1px solid ${purpleTheme.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '40px'
                    }}>
                        <div style={{ width: '8px', height: '8px', background: purpleTheme.primary, marginRight: '15px', borderRadius: '50%', boxShadow: `0 0 8px ${purpleTheme.primary}` }}></div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: purpleTheme.primary, letterSpacing: '2px', fontWeight: 'bold' }}>DIGITAL INVESTIGATION // PRIVATE_ROOM</span>
                    </div>

                    <div style={{ padding: '2rem 3rem 2rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                        {/* Name Tag */}
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(191, 90, 242, 0.15)',
                            padding: '0.4rem 1.5rem',
                            borderLeft: `4px solid ${purpleTheme.primary}`,
                            marginBottom: '1.2rem',
                            width: 'fit-content'
                        }}>
                            <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.05em' }}>나</span>
                        </div>

                        {/* Text */}
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontSize: '1.6rem',
                            lineHeight: '1.6',
                            margin: 0,
                            fontWeight: '400',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}>
                            {dialogueText}
                            {isTyping && <span className="cursor-blink" style={{ color: purpleTheme.primary, marginLeft: '5px' }}>|</span>}
                        </p>
                    </div>

                    {!isTyping && (
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '30px',
                            color: purpleTheme.primary,
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            animation: 'bounce 1s infinite',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            NEXT <span style={{ fontSize: '1.0rem' }}>▼</span>
                        </div>
                    )}
                </div>
            )}

            {/* Dial Lock Popup - True 3D Mechanical Style */}
            {showDialLock && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 200, flexDirection: 'column'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #101015 0%, #1a1a20 100%)',
                        padding: '60px 80px',
                        borderRadius: '40px',
                        boxShadow: `0 40px 100px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.1), 0 0 0 1px ${purpleTheme.border}`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        position: 'relative'
                    }}>
                        {/* Decorative Scanner Line */}
                        <div style={{
                            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                            width: '200px', height: '4px',
                            background: purpleTheme.primary,
                            boxShadow: `0 0 20px ${purpleTheme.primary}`
                        }}></div>

                        <h2 style={{
                            color: '#e0e0e0', marginBottom: '50px', fontFamily: '"Share Tech Mono", monospace',
                            letterSpacing: '5px', fontSize: '1.8rem',
                            textShadow: `0 0 10px rgba(255,255,255,0.1)`
                        }}>
                            SECURITY PASSCODE
                        </h2>

                        {/* Dials Container */}
                        <div style={{
                            display: 'flex', gap: '15px', marginBottom: '50px',
                            padding: '15px'
                        }}>
                            {dialValues.map((val, idx) => {
                                // Use cumulative rotation for smooth infinite scrolling
                                const angle = rotationAngles[idx];

                                return (
                                    <div key={idx} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
                                    }}>
                                        {/* Up Arrow */}
                                        <button
                                            onClick={() => handleDialChange(idx, 1)}
                                            style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem', padding: '5px', transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#555'}
                                        >▲</button>

                                        {/* 3D Viewport */}
                                        <div
                                            onMouseDown={(e) => handleDialMouseDown(idx, e)}
                                            style={{
                                                width: '60px', height: '80px',
                                                perspective: '1000px',
                                                position: 'relative',
                                                cursor: dragging.active && dragging.index === idx ? 'grabbing' : 'grab',
                                                userSelect: 'none'
                                            }}>
                                            {/* Cylinder Container */}
                                            <div style={{
                                                width: '100%', height: '100%',
                                                position: 'absolute',
                                                transformStyle: 'preserve-3d',
                                                transform: `rotateX(${angle * -1}deg)`, // Uses cumulative rotation
                                                transition: 'transform 0.6s cubic-bezier(0.19, 1.0, 0.22, 1.0)', // "Settling" effect
                                            }}>
                                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                                    <div key={num} style={{
                                                        position: 'absolute',
                                                        width: '60px', height: '80px',
                                                        background: 'linear-gradient(180deg, #b0b0b0 0%, #f0f0f0 50%, #b0b0b0 100%)', // Chrome/Silver look
                                                        color: '#1a1a1a',
                                                        fontSize: '3rem',
                                                        fontWeight: '800',
                                                        fontFamily: 'sans-serif',
                                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                        backfaceVisibility: 'hidden',
                                                        border: '1px solid #999',
                                                        boxSizing: 'border-box',
                                                        // 3D placement: Z translate approx R = H / 2 * tan(18deg)
                                                        // H = 80px. tan(18) = 0.325. R = 40 / 0.325 ≈ 123px.
                                                        transform: `rotateX(${num * 36}deg) translateZ(123px)`
                                                    }}>
                                                        {num}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Glass Overlay / Highlight */}
                                            <div style={{
                                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)',
                                                pointerEvents: 'none', zIndex: 10,
                                                borderRadius: '4px',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}></div>

                                            {/* Center Shine Line */}
                                            <div style={{
                                                position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px',
                                                background: 'rgba(255,255,255,0.3)',
                                                transform: 'translateY(-50%)',
                                                zIndex: 11, pointerEvents: 'none'
                                            }}></div>
                                        </div>

                                        {/* Down Arrow */}
                                        <button
                                            onClick={() => handleDialChange(idx, -1)}
                                            style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem', padding: '5px', transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#555'}
                                        >▼</button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Main Unlock Button - Toggle Style */}
                        {(() => {
                            const isCorrect = dialValues.every((val, idx) => val === correctCode[idx]);
                            return (
                                <button
                                    onClick={() => { if (isCorrect) checkCode(); }}
                                    style={{
                                        width: '100%',
                                        padding: '18px',
                                        background: isCorrect
                                            ? `linear-gradient(90deg, ${purpleTheme.primary}, #fff)`
                                            : '#333',
                                        color: isCorrect ? '#000' : '#888',
                                        fontSize: '1.2rem',
                                        fontWeight: '900',
                                        letterSpacing: '3px',
                                        border: 'none',
                                        borderRadius: '50px', // Toggle pill shape
                                        boxShadow: isCorrect
                                            ? `0 0 30px ${purpleTheme.primary}, inset 0 2px 5px rgba(255,255,255,0.5)`
                                            : 'inset 0 2px 5px rgba(0,0,0,0.5)',
                                        cursor: isCorrect ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        transform: isCorrect ? 'scale(1.05)' : 'scale(1)',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    {isCorrect ? (
                                        <>
                                            <span>🔓</span> ACCESS GRANTED
                                        </>
                                    ) : (
                                        <>
                                            <span>🔒</span> ACCESS DENIED
                                        </>
                                    )}
                                </button>
                            );
                        })()}
                    </div>

                    {/* Hint Text */}
                    <p style={{
                        marginTop: '40px',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '1.4rem',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        textShadow: '0 0 10px rgba(255,255,255,0.2)'
                    }}>
                        "진실은 읽지 않은 약속에 있었다...방 안을 살펴보자"
                    </p>

                    <button
                        onClick={() => setShowDialLock(false)}
                        style={{
                            marginTop: '1px',
                            background: 'transparent',
                            color: 'rgba(255,255,255,0.6)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '12px 30px',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            letterSpacing: '1px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#fff';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                        }}
                    >
                        다시 방 살펴보기
                    </button>
                </div>
            )}

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(5px); }
                }
                @keyframes lockOn {
                    0% { transform: scale(2.0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .cursor-blink {
                    animation: blink 1s step-end infinite;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default ARoom;
