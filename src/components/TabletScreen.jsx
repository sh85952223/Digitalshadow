import React, { useState, useEffect, useRef } from 'react';

const TabletScreen = ({ onComplete }) => {
    // Phases: off, booting, lockscreen, appLaunch
    const [phase, setPhase] = useState('off');
    const [showNotification, setShowNotification] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [hearts, setHearts] = useState(3);
    const [dismissedOnce, setDismissedOnce] = useState(false);
    const [notificationY, setNotificationY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const notificationRef = useRef(null);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const handlePowerOn = () => {
        if (phase !== 'off') return;
        setPhase('booting');
        setTimeout(() => {
            setPhase('lockscreen');
            setTimeout(() => {
                setShowNotification(true);
                setNotificationY(0);
            }, 1500);
        }, 2000);
    };

    // Handle notification click → go to P2 (appLaunch)
    const handleNotificationClick = () => {
        if (isDragging) return;
        setShowNotification(false);
        // Go to P2: App Launch (Splash)
        setPhase('appLaunch');
    };

    // Handle drag to dismiss
    const handleDragStart = (e) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartY.current = e.clientY || e.touches?.[0]?.clientY || 0;
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const currentY = e.clientY || e.touches?.[0]?.clientY || 0;
        const diff = currentY - dragStartY.current;
        // Only allow dragging up (negative)
        if (diff < 0) {
            setNotificationY(diff);
        }
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        // If dragged up more than 80px, dismiss
        if (notificationY < -80) {
            setShowNotification(false);

            // First time dismiss: +1 heart bonus
            if (!dismissedOnce) {
                setDismissedOnce(true);
                setHearts(prev => prev + 1);
            }

            // Notification comes back after 1.5s
            setTimeout(() => {
                setShowNotification(true);
                setNotificationY(0);
            }, 1500);
        } else {
            // Snap back
            setNotificationY(0);
        }
    };

    // App Launch complete → trigger onComplete
    const handleAppLaunchComplete = () => {
        if (onComplete) onComplete();
    };

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                position: 'relative'
            }}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
        >
            {/* Game UI Overlay - Hearts (dynamic count) */}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                display: 'flex',
                gap: '5px',
                zIndex: 1000,
                background: 'rgba(0,0,0,0.6)',
                padding: '10px 15px',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)'
            }}>
                {[...Array(hearts)].map((_, i) => (
                    <span
                        key={i}
                        style={{
                            fontSize: '1.5rem',
                            animation: i === hearts - 1 && hearts > 3 ? 'heartPop 0.5s ease' : 'none'
                        }}
                    >
                        ❤️
                    </span>
                ))}
            </div>

            {/* Controls Guide - Left Side Glassmorphism Panel */}
            <div style={{
                position: 'fixed',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '180px',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
                zIndex: 100
            }}>
                <h4 style={{
                    margin: '0 0 15px 0',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.9)',
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    paddingBottom: '10px'
                }}>
                    🎮 조작 가이드
                </h4>

                <div style={{ marginBottom: '12px' }}>
                    <div style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '4px',
                        fontWeight: '600',
                        letterSpacing: '1px'
                    }}>CLICK</div>
                    <div style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.85)',
                        lineHeight: '1.4'
                    }}>
                        터치、선택
                    </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <div style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '4px',
                        fontWeight: '600',
                        letterSpacing: '1px'
                    }}>DRAG</div>
                    <div style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.85)',
                        lineHeight: '1.4'
                    }}>
                        밀어서 닫기 (PUSH)
                    </div>
                </div>

                <div style={{
                    marginTop: '15px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: '1.5'
                }}>
                    PC에서도 모바일과 동일한 로직이 적용됩니다.
                </div>
            </div>

            {/* Tablet Device */}
            <div style={{
                width: '900px',
                height: '600px',
                background: '#1a1a1a',
                borderRadius: '30px',
                padding: '15px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 2px rgba(255,255,255,0.1)',
                position: 'relative',
                border: '2px solid #2a2a2a'
            }}>
                {/* Screen Area */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: phase === 'off' ? '#000'
                        : phase === 'booting' ? '#000'
                            : phase === 'appLaunch' ? 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)'
                                : 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'background 0.5s ease'
                }}>
                    {/* OFF State */}
                    {phase === 'off' && (
                        <div onClick={handlePowerOn} style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center',
                            cursor: 'pointer', color: '#333'
                        }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                border: '3px solid #333',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '2rem', marginBottom: '20px', transition: 'all 0.3s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.color = '#666'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#333'; }}
                            >⏻</div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>터치하여 전원 켜기</p>
                        </div>
                    )}

                    {/* Booting State */}
                    {phase === 'booting' && (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center',
                            background: '#000'
                        }}>
                            <div style={{ fontSize: '3rem', color: '#fff', marginBottom: '30px', animation: 'pulse 1.5s infinite' }}>🍎</div>
                            <div style={{ width: '150px', height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '100%', height: '100%', background: '#fff', animation: 'loadingBar 2s ease-out forwards' }}></div>
                            </div>
                        </div>
                    )}

                    {/* Lock Screen (P0/P1) */}
                    {phase === 'lockscreen' && (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            position: 'relative', animation: 'fadeIn 0.5s ease-out'
                        }}>
                            {/* Status Bar */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: '35px',
                                padding: '0 25px', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', color: '#fff', fontSize: '0.85rem', fontWeight: '600'
                            }}>
                                <span>{currentTime}</span>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem' }}>📶</span>
                                    <span style={{ fontSize: '0.8rem' }}>🔋 85%</span>
                                </div>
                            </div>

                            {/* Time Display */}
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{
                                    fontSize: '6rem', fontWeight: '200', color: '#fff',
                                    letterSpacing: '-5px', textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                                }}>{currentTime}</div>
                                <div style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', fontWeight: '400' }}>
                                    1월 17일 금요일
                                </div>
                            </div>

                            {/* Swipe Hint */}
                            <div style={{
                                position: 'absolute', bottom: '40px',
                                color: 'rgba(255,255,255,0.7)', fontSize: '1rem'
                            }}>
                                <span style={{ width: '50px', height: '5px', background: 'rgba(255,255,255,0.5)', borderRadius: '3px', display: 'inline-block' }}></span>
                            </div>

                            {/* Push Notification (P1) */}
                            {showNotification && (
                                <div
                                    ref={notificationRef}
                                    onClick={handleNotificationClick}
                                    onMouseDown={handleDragStart}
                                    onTouchStart={handleDragStart}
                                    style={{
                                        position: 'absolute',
                                        top: `${50 + notificationY}px`,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '85%',
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '18px',
                                        padding: '16px 20px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        cursor: 'pointer',
                                        animation: notificationY === 0 && !isDragging ? 'slideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
                                        transition: isDragging ? 'none' : 'top 0.3s ease',
                                        userSelect: 'none'
                                    }}
                                >
                                    {/* App Icon */}
                                    <div style={{
                                        width: '45px', height: '45px', borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        fontSize: '1.5rem', flexShrink: 0
                                    }}>📍</div>

                                    {/* Content */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '700', color: '#333', fontSize: '0.95rem' }}>위치 추적</span>
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>지금</span>
                                        </div>
                                        <p style={{ margin: 0, color: '#555', fontSize: '0.95rem', lineHeight: 1.4 }}>
                                            A의 위치가 궁금하신가요?👀 위치 추적하기🚀
                                        </p>
                                    </div>
                                    <div style={{ color: '#aaa', fontSize: '1.2rem' }}>›</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* P2: App Launch (Splash Screen) */}
                    {phase === 'appLaunch' && (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center',
                            background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)',
                            animation: 'fadeIn 0.5s ease-out',
                            position: 'relative'
                        }}>
                            {/* Logo */}
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                animation: 'pulse 2s infinite'
                            }}>
                                <div style={{
                                    fontSize: '4rem',
                                    marginBottom: '20px',
                                    filter: 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.5))'
                                }}>🔍</div>
                                <h1 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    margin: 0,
                                    letterSpacing: '-1px'
                                }}>Footprint Finder</h1>
                                <p style={{
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: '0.8rem',
                                    marginTop: '10px',
                                    fontFamily: 'monospace',
                                    letterSpacing: '2px'
                                }}>Secure Trace Engine v3.2</p>
                            </div>

                            {/* Loading Bar */}
                            <div style={{
                                position: 'absolute',
                                bottom: '80px',
                                width: '200px',
                                height: '4px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '2px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                                    animation: 'appLoadingBar 2.5s ease-out forwards'
                                }}></div>
                            </div>

                            {/* Auto transition after loading */}
                            <AppLaunchTimer onComplete={handleAppLaunchComplete} />
                        </div>
                    )}
                </div>

                {/* Home Button */}
                <div style={{
                    position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                    width: '10px', height: '10px', background: '#333', borderRadius: '50%'
                }}></div>

                {/* Camera */}
                <div style={{
                    position: 'absolute', top: '22px', left: '50%', transform: 'translateX(-50%)',
                    width: '8px', height: '8px', background: '#1a1a1a', borderRadius: '50%', border: '1px solid #333'
                }}></div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(0.95); }
                }
                @keyframes loadingBar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                @keyframes appLoadingBar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-30px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes heartPop {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

// Helper component for app launch timer
const AppLaunchTimer = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2800);
        return () => clearTimeout(timer);
    }, [onComplete]);
    return null;
};

export default TabletScreen;
