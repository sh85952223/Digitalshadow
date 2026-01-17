import React, { useState, useEffect, useRef } from 'react';
import footprintLogo from '../assets/footprint_finder_logo.png';

const TabletScreen = ({ onComplete }) => {
    // Phases: off, booting, lockscreen, appLaunch, authIntro
    const [phase, setPhase] = useState('off');
    const [showNotification, setShowNotification] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [hearts, setHearts] = useState(3);
    const [dismissedOnce, setDismissedOnce] = useState(false);
    const [notificationY, setNotificationY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dialogueText, setDialogueText] = useState('');
    const [showDialogue, setShowDialogue] = useState(false);
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
                // Show dialogue 0.7s after notification
                setTimeout(() => {
                    setDialogueText("A의 위치를 알아내는게 주요 임무인데....어떻게 할까? 들어갈볼까? 태블릿부터 살펴야하나?");
                    setShowDialogue(true);
                }, 700);
            }, 1500);
        }, 2000);
    };

    // Handle notification click → go to P2 (appLaunch)
    const handleNotificationClick = () => {
        if (isDragging) return;
        if (showDialogue) return; // Block interaction while dialogue is showing
        setShowNotification(false);
        setShowDialogue(false);
        // Go to P2: App Launch (Splash)
        setPhase('appLaunch');
    };

    // Handle dialogue click to dismiss
    const handleDialogueClick = () => {
        setShowDialogue(false);
    };

    // Handle drag to dismiss
    const handleDragStart = (e) => {
        if (showDialogue) return; // Block interaction while dialogue is showing
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
            setShowDialogue(false);

            // First time dismiss: +1 heart bonus
            if (!dismissedOnce) {
                setDismissedOnce(true);
                setHearts(prev => prev + 1);
            }

            // Notification comes back after 1.5s
            setTimeout(() => {
                setShowNotification(true);
                setNotificationY(0);
                // Show second dialogue 0.7s after notification reappears
                setTimeout(() => {
                    setDialogueText("계속 뜨는 걸 보니 뭐가 있는 것 같아...들어가보자");
                    setShowDialogue(true);
                }, 700);
            }, 1500);
        } else {
            // Snap back
            setNotificationY(0);
        }
    };

    // App Launch complete → go to P3 (authIntro)
    const handleAppLaunchComplete = () => {
        setPhase('authIntro');
    };

    // P3 "본인인증" button click
    const handleAuthButtonClick = () => {
        if (onComplete) onComplete();
    };

    // P3 "나중에" button click - show toast and stay
    const handleLaterClick = () => {
        // Could show a toast here, for now just do nothing
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
                top: '30%',
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
                    fontSize: '1.2em',
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
                        fontSize: '1rem',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '4px',
                        fontWeight: '600',
                        letterSpacing: '1px'
                    }}>CLICK</div>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.85)',
                        lineHeight: '1.4'
                    }}>
                        터치, 선택
                    </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <div style={{
                        fontSize: '1rem',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '4px',
                        fontWeight: '600',
                        letterSpacing: '1px'
                    }}>DRAG</div>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
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
                    모바일 작동방식과 동일한 로직이 적용됩니다.
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
                                fontSize: '2rem', marginBottom: '1px', transition: 'all 0.3s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.color = '#666'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#333'; }}
                            >⏻</div>
                            <p style={{ fontSize: '1em', opacity: 0.5 }}>터치하여 전원 켜기</p>
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
                                    onMouseDown={handleDragStart}
                                    onTouchStart={handleDragStart}
                                    style={{
                                        position: 'absolute',
                                        top: `${50 + notificationY}px`,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '75%',
                                        maxWidth: '500px',
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '16px',
                                        padding: '12px 14px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'grab',
                                        animation: notificationY === 0 && !isDragging ? 'slideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
                                        transition: isDragging ? 'none' : 'top 0.3s ease',
                                        userSelect: 'none'
                                    }}
                                >
                                    {/* App Icon */}
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        fontSize: '1.3rem', flexShrink: 0
                                    }}>📍</div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                            <span style={{ fontWeight: '600', color: '#333', fontSize: '0.85rem' }}>위치 추적</span>
                                            <span style={{ fontSize: '0.75rem', color: '#999' }}>· 지금</span>
                                        </div>
                                        <p style={{ margin: 0, color: '#555', fontSize: '0.85rem', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            A의 위치가 궁금하신가요?👀 위치 추적하기🚀
                                        </p>
                                    </div>

                                    {/* "지금 알아보기" Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleNotificationClick(); }}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            borderRadius: '10px',
                                            padding: '8px 12px',
                                            color: '#fff',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                            boxShadow: '0 3px 10px rgba(102, 126, 234, 0.3)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.5)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(102, 126, 234, 0.3)'; }}
                                    >
                                        지금 알아보기
                                    </button>
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
                            {/* Logo Image */}
                            <img
                                src={footprintLogo}
                                alt="Footprint Finder"
                                style={{
                                    width: '230px',
                                    height: '230px',
                                    objectFit: 'contain',
                                    marginBottom: '20px',
                                    filter: 'drop-shadow(0 0 30px rgba(102, 126, 234, 0.5))',
                                    animation: 'pulse 2s infinite'
                                }}
                            />
                            <p style={{
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '0.8rem',
                                marginTop: '10px',
                                fontFamily: 'monospace',
                                letterSpacing: '2px'
                            }}>Secure Trace Engine v3.2</p>

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

                    {/* P3: Auth Intro Screen - Realistic Tablet OS Style */}
                    {phase === 'authIntro' && (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            background: '#f2f2f7',
                            animation: 'fadeIn 0.3s ease-out'
                        }}>
                            {/* System Status Bar - iOS/Android style */}
                            <div style={{
                                height: '28px',
                                background: '#f2f2f7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 16px',
                                fontSize: '0.75rem',
                                color: '#1c1c1e',
                                fontWeight: '500'
                            }}>
                                <span>{currentTime}</span>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.7rem' }}>
                                    <span style={{ opacity: 0.6 }}>●●●○</span>
                                    <span style={{ marginLeft: '4px' }}>▲▼</span>
                                    <div style={{
                                        width: '22px', height: '10px',
                                        border: '1px solid #1c1c1e', borderRadius: '2px',
                                        position: 'relative', marginLeft: '4px'
                                    }}>
                                        <div style={{
                                            position: 'absolute', left: '1px', top: '1px', bottom: '1px',
                                            width: '75%', background: '#1c1c1e', borderRadius: '1px'
                                        }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Bar */}
                            <div style={{
                                height: '44px',
                                background: 'rgba(255,255,255,0.8)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '0.5px solid rgba(0,0,0,0.1)'
                            }}>
                                <span style={{
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    color: '#1c1c1e'
                                }}>보안 인증</span>
                            </div>

                            {/* Content Area */}
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '40px 24px'
                            }}>
                                {/* Icon - Simple, muted */}
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    background: '#e5e5ea',
                                    borderRadius: '14px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                </div>

                                {/* Title - Dry, system-like */}
                                <h2 style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    color: '#1c1c1e',
                                    marginBottom: '8px',
                                    textAlign: 'center'
                                }}>기기 소유자 인증 필요</h2>

                                {/* Description */}
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#8e8e93',
                                    lineHeight: 1.5,
                                    textAlign: 'center',
                                    maxWidth: '280px',
                                    marginBottom: '16px'
                                }}>이 기능을 사용하려면 기기 소유자 본인인증을 완료해야 합니다.</p>

                                {/* Warning - Subtle */}
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: '#ff453a',
                                    textAlign: 'center'
                                }}>인증 실패 시 잠시 후 재시도</p>
                            </div>

                            {/* Button Area */}
                            <div style={{
                                padding: '16px 24px 32px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '16px'
                            }}>
                                {/* Primary Button - Flat, single color */}
                                <button
                                    onClick={handleAuthButtonClick}
                                    style={{
                                        width: '100%',
                                        maxWidth: '340px',
                                        padding: '14px 20px',
                                        background: '#007aff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: '#fff',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    본인인증 진행
                                </button>

                                {/* Secondary - Text link style */}
                                <button
                                    onClick={handleLaterClick}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#007aff',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        padding: '4px'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    나중에
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Camera only - no home button */}
                <div style={{
                    position: 'absolute', top: '22px', left: '50%', transform: 'translateX(-50%)',
                    width: '8px', height: '8px', background: '#1a1a1a', borderRadius: '50%', border: '1px solid #333'
                }}></div>
            </div>

            {/* Dialogue Box - Outside tablet, bottom of screen (ARoom style) */}
            {showDialogue && (
                <div onClick={handleDialogueClick} style={{
                    position: 'fixed', bottom: '5%', left: '50%', transform: 'translateX(-50%)',
                    width: '70%', maxWidth: '1000px', minHeight: '180px',
                    background: 'rgba(15, 5, 25, 0.85)',
                    border: '1px solid rgba(191, 90, 242, 0.5)',
                    boxShadow: '0 0 30px rgba(191, 90, 242, 0.3)',
                    backdropFilter: 'blur(16px)',
                    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                    zIndex: 200, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', padding: '0'
                }}>
                    <div style={{ width: '100%', height: '35px', background: 'linear-gradient(90deg, rgba(191, 90, 242, 0.15) 0%, transparent 100%)', borderBottom: '1px solid rgba(191, 90, 242, 0.5)', display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#BF5AF2', marginRight: '15px', borderRadius: '50%', boxShadow: '0 0 8px #BF5AF2' }}></div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#BF5AF2', letterSpacing: '2px', fontWeight: 'bold' }}>DIGITAL INVESTIGATION // TABLET_ANALYSIS</span>
                    </div>
                    <div style={{ padding: '2rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(191, 90, 242, 0.15)', padding: '0.4rem 1.5rem', borderLeft: '4px solid #BF5AF2', marginBottom: '1rem', width: 'fit-content' }}>
                            <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.05em' }}>나</span>
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.3rem', lineHeight: '1.6', margin: 0, fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {dialogueText}
                        </p>
                    </div>
                    <div style={{ position: 'absolute', bottom: '20px', right: '30px', color: '#BF5AF2', fontSize: '1.2rem', fontWeight: 'bold', animation: 'bounce 1s infinite', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        NEXT <span style={{ fontSize: '1.0rem' }}>▼</span>
                    </div>
                </div>
            )}

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
