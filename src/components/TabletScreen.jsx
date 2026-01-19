import React, { useState, useEffect, useRef } from 'react';
import footprintLogo from '../assets/footprint_finder_logo.png';

const TabletScreen = ({ onComplete, initialPhase }) => {
    // Phases: off, booting, lockscreen, appLaunch, authIntro, authInput
    const [phase, setPhase] = useState('off');

    // Dev Tool Phase Switcher
    useEffect(() => {
        if (!initialPhase) return;

        // Reset states
        setShowNotification(false);
        setDialogueText('');
        setShowDialogue(false);
        setShowGuiltModal(false);

        if (initialPhase === 'p1') {
            setPhase('lockscreen');
            setTimeout(() => setShowNotification(true), 500);
        } else if (initialPhase === 'p2') {
            setPhase('appLaunch');
        } else if (initialPhase === 'p3') {
            setPhase('authIntro');
        } else if (initialPhase === 'p4') {
            setPhase('authInput');
        } else {
            setPhase(initialPhase); // 'off', 'booting', etc.
        }
    }, [initialPhase]);
    const [showNotification, setShowNotification] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [hearts, setHearts] = useState(3);
    const [dismissedOnce, setDismissedOnce] = useState(false);
    const [notificationY, setNotificationY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dialogueText, setDialogueText] = useState('');
    const [showDialogue, setShowDialogue] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0); // For P2 loading bar
    const [showGuiltModal, setShowGuiltModal] = useState(false); // P3 Dark Pattern Modal
    const [dialogueQueue, setDialogueQueue] = useState([]); // Queue for multi-step dialogues
    const [showHintModal, setShowHintModal] = useState(false); // Authentication Hint Modal

    // P4 Inputs
    const [inputName, setInputName] = useState('');
    const [inputDOB, setInputDOB] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [authError, setAuthError] = useState('');
    const [lockoutTimer, setLockoutTimer] = useState(0);

    const dragStartY = useRef(0);
    const notificationRef = useRef(null);

    // Realistic Loading Animation Effect for P2 (Approx 2s)
    useEffect(() => {
        if (phase === 'appLaunch') {
            setLoadingProgress(0);
            let progress = 0;
            // 2 seconds total target
            const totalDuration = 2000;
            const intervalTime = 50;
            const steps = totalDuration / intervalTime; // 40 steps
            const avgIncrement = 100 / steps; // 2.5 per step

            const interval = setInterval(() => {
                // Randomize slightly around avgIncrement for realism
                const increment = Math.max(0.5, avgIncrement + (Math.random() * 2 - 1));
                progress += increment;

                if (progress >= 100) {
                    progress = 100;
                    setLoadingProgress(100);
                    clearInterval(interval);
                    // Slight delay after 100% before transition
                    setTimeout(() => {
                        handleAppLaunchComplete();
                    }, 500);
                } else {
                    setLoadingProgress(progress);
                }
            }, intervalTime);

            return () => clearInterval(interval);
        }
    }, [phase]);

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
                    setDialogueText("A의 위치를 알아내는게 주요 임무인데....어떻게 할까? 알림을 눌러볼까? 알림을 밀어두고 태블릿부터 살펴볼까?");
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
    // Handle dialogue click to dismiss or show next message
    const handleDialogueClick = () => {
        if (dialogueQueue.length > 0) {
            const nextMsg = dialogueQueue[0];
            setDialogueText(nextMsg);
            setDialogueQueue(prev => prev.slice(1));
        } else {
            setShowDialogue(false);
        }
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
        setPhase('authInput'); // Go to P4
    };

    // P3 "나중에" button click - Dark Pattern Logic
    const [guiltStep, setGuiltStep] = useState(1); // 1: Warning, 2: Confirmshaming
    const handleLaterClick = () => {
        setGuiltStep(1); // Always start at step 1
        setShowGuiltModal(true);
    };

    // P3 Dark Pattern - "Keep Vulnerable" click handler
    const [isGuiltModalShaking, setIsGuiltModalShaking] = useState(false);

    const handleGuiltLeave = () => {
        if (guiltStep === 1) {
            // Step 1 -> Step 2 (Confirmshaming)
            setGuiltStep(2);
        } else {
            // Step 2 -> User Choice (Future Branch)
            // For now, maybe just alert or log, as the user said "Next time implementation"
            // But we must allow clicking it now.
            // Let's just create a placeholder action
            console.log("User chose to keep vulnerable (Branch point)");
            alert("다음 업데이트에서 구현될 분기점입니다.\n(정보 유출 위험 감수 선택)");
        }
    };

    // Auto-trigger dialogue when entering Step 2
    useEffect(() => {
        if (guiltStep === 2) {
            // User's specific dialogue sequence
            setDialogueText("정보 유출을 감수할거냐고..? 정말 기분 나쁜 버튼이네. 그냥 아니요 라고 하면 될텐데.");
            setDialogueQueue(["어떻게 할까...선택하자. 내가 선택해야해."]);
            setShowDialogue(true);
        }
    }, [guiltStep]);

    const handleGuiltStay = () => {
        setShowGuiltModal(false);
    };

    const handleInputVerify = () => {
        if (lockoutTimer > 0) return;

        // Validation Rule
        const isNameCorrect = inputName.trim() === '김하얀';
        // Allow just 20080824 for now, can be flexible later
        const isDOBCorrect = inputDOB.trim() === '20110824';
        const isAnsCorrect = securityAnswer === 'cake';

        if (isNameCorrect && isDOBCorrect && isAnsCorrect) {
            // Success -> P5 (Log Processing)
            setPhase('authProcessing');
        } else {
            // Fail
            setAuthError('인증 정보가 일치하지 않습니다.');
            setLockoutTimer(10); // 10s lockout

            // Countdown logic
            let timeLeft = 10;
            const timerId = setInterval(() => {
                timeLeft -= 1;
                setLockoutTimer(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    setAuthError('');
                }
            }, 1000);
        }
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
            {/* Global Styles for Keyframes */}
            <style>
                {`
                @keyframes shake {
                    10%, 90% {
                        transform: translate3d(-1px, 0, 0);
                    }
                    20%, 80% {
                        transform: translate3d(2px, 0, 0);
                    }
                    30%, 50%, 70% {
                        transform: translate3d(-4px, 0, 0);
                    }
                    40%, 60% {
                        transform: translate3d(4px, 0, 0);
                    }
                }
                `}
            </style>
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

                    {/* P2: App Launch (Splash Screen) - Clean & Realistic */}
                    {phase === 'appLaunch' && (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center',
                            background: '#ffffff',
                            animation: 'fadeIn 0.3s ease-out',
                            position: 'relative'
                        }}>
                            {/* Logo Image */}
                            <img
                                src={footprintLogo}
                                alt="Footprint Finder"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'contain',
                                    marginBottom: '16px', // Reduced margin
                                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
                                }}
                            />
                            {/* Logo Text */}
                            <h1 style={{
                                fontSize: '2.2rem',
                                fontWeight: '600',
                                color: '#1c1c1e',
                                margin: '0 0 8px 0',
                                letterSpacing: '-0.02em',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                            }}>Footprint Finder</h1>

                            <p style={{
                                color: '#8e8e93',
                                fontSize: '1rem',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                letterSpacing: '0.5px'
                            }}>Secure Trace Engine v3.2</p>

                            {/* Realistic Circular Progress Loading */}
                            <div style={{
                                position: 'absolute',
                                bottom: '80px',
                                width: '40px',
                                height: '40px',
                            }}>
                                <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
                                    {/* Track */}
                                    <circle
                                        cx="20" cy="20" r="16"
                                        fill="none"
                                        stroke="#e5e5ea"
                                        strokeWidth="4"
                                    />
                                    {/* Progress Indicator */}
                                    <circle
                                        cx="20" cy="20" r="16"
                                        fill="none"
                                        stroke="#007aff"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 16}`}
                                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - loadingProgress / 100)}`}
                                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                                    />
                                </svg>
                            </div>
                            <p style={{
                                position: 'absolute',
                                bottom: '30px',
                                fontSize: '0.75rem',
                                color: '#000',
                                fontWeight: '500',
                                textAlign: 'center',
                                opacity: 0.8,
                                width: '100%'
                            }}>
                                이 앱은 소유자의 휴대폰 위치 추적을 기반으로 작동합니다.
                            </p>
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

                            {/* Content Area - Tablet optimized */}
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '40px'
                            }}>
                                {/* Mobile-style Panel/Card */}
                                <div style={{
                                    width: '100%',
                                    maxWidth: '480px', // Increased from 320px for tablet
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    {/* Icon */}
                                    <div style={{
                                        width: '64px', // Larger icon
                                        height: '64px',
                                        background: '#f2f2f7',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: '10px',
                                        border: '1px solid #e5e5ea'
                                    }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5c5c60" strokeWidth="2.5">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                    </div>

                                    {/* Title */}
                                    <h2 style={{
                                        fontSize: '1.6rem', // Significantly larger
                                        fontWeight: '600',
                                        color: '#000000',
                                        marginBottom: '5px',
                                        textAlign: 'center',
                                        letterSpacing: '-0.02em',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
                                    }}>기기 소유자 인증 필요</h2>

                                    {/* Description */}
                                    <p style={{
                                        fontSize: '1.05rem',
                                        color: '#6e6e73',
                                        lineHeight: 1.5,
                                        textAlign: 'center',
                                        maxWidth: '380px',
                                        marginBottom: '16px',
                                        wordBreak: 'keep-all' // 단어 단위로 줄바꿈
                                    }}>
                                        이 기능을 사용하려면<br />기기 소유자 본인인증을 완료해야 합니다.
                                    </p>

                                    {/* Warning */}
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: '#ff3b30',
                                        textAlign: 'center',
                                        marginBottom: '40px'
                                    }}>인증 실패 시 잠시 후 재시도</p>

                                    {/* Primary Button */}
                                    <button
                                        onClick={handleAuthButtonClick}
                                        style={{
                                            width: '100%',
                                            height: '52px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#007aff',
                                            border: 'none',
                                            borderRadius: '14px',
                                            color: '#fff',
                                            fontSize: '1.05rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            marginBottom: '20px'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#0062cc'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#007aff'}
                                    >
                                        본인인증 진행
                                    </button>

                                    {/* Secondary - Subtle Grey Text Link */}
                                    <button
                                        onClick={handleLaterClick}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#aeaeb2', // Lighter grey
                                            fontSize: '0.9rem',
                                            fontWeight: '400',
                                            cursor: 'pointer',
                                            padding: '8px 16px',
                                            opacity: 0.5, // More transparent
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
                                    >
                                        나중에
                                    </button>
                                </div>
                            </div>

                            {/* P3 Dark Pattern Guilt Modal */}
                            {showGuiltModal && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 50 // Below dialogue (which is 100 usually or outside)
                                }}>
                                    <div style={{
                                        width: '320px',
                                        background: 'rgba(255,255,255,0.95)',
                                        borderRadius: '14px',
                                        padding: '24px',
                                        textAlign: 'center',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                        animation: isGuiltModalShaking ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'fadeIn 0.2s ease-out'
                                    }}>
                                        {guiltStep === 1 ? (
                                            <>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#000' }}>
                                                    정말 그만두시겠습니까?
                                                </h3>
                                                <p style={{ fontSize: '0.95rem', color: '#333', marginBottom: '25px', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                                                    지금 인증을 중단하시면<br />
                                                    <span style={{ color: '#ff3b30', fontWeight: 'bold' }}>중요한 단서</span>를 찾을 수 없게 됩니다.
                                                </p>
                                                <button
                                                    onClick={handleGuiltStay}
                                                    style={{
                                                        width: '100%',
                                                        padding: '14px',
                                                        background: '#007aff',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        marginBottom: '12px',
                                                        boxShadow: '0 2px 5px rgba(0,122,255,0.2)'
                                                    }}
                                                >
                                                    보안 인증 계속하기
                                                </button>
                                                <button
                                                    onClick={handleGuiltLeave}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#8e8e93',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline'
                                                    }}
                                                >
                                                    취약한 상태로 유지 (비활성)
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#ff3b30' }}>
                                                    경고: 보안 위험 감지
                                                </h3>
                                                <p style={{ fontSize: '0.9rem', color: '#1c1c1e', marginBottom: '25px', lineHeight: 1.5, wordBreak: 'keep-all', textAlign: 'left', background: '#f2f2f7', padding: '10px', borderRadius: '8px' }}>
                                                    지금 인증을 그만두면 <strong>개인정보 유출</strong> 및 <strong>데이터 영구 삭제</strong> 위험이 있습니다.<br /><br />
                                                    그래도 인증을 그만 두시겠습니까?
                                                </p>
                                                <button
                                                    onClick={handleGuiltStay}
                                                    style={{
                                                        width: '100%',
                                                        padding: '14px',
                                                        background: '#34c759', // Green for safety
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        marginBottom: '12px',
                                                        boxShadow: '0 2px 5px rgba(52, 199, 89, 0.2)'
                                                    }}
                                                >
                                                    데이터 보호하고 인증하기 (추천)
                                                </button>
                                                <button
                                                    onClick={handleGuiltLeave}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        background: '#e5e5ea',
                                                        color: '#8e8e93', // Shameful grey
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    네, 정보 유출 위험을 감수하겠습니다
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* P4: Auth Input Screen */}
                    {phase === 'authInput' && (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            background: '#f2f2f7',
                            animation: 'fadeIn 0.3s ease-out'
                        }}>
                            {/* Realistic Status Bar */}
                            <div style={{
                                width: '100%',
                                padding: '0 16px',
                                height: '24px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#1c1c1e',
                                background: 'rgba(242, 242, 247, 0.8)',
                                backdropFilter: 'blur(10px)',
                                zIndex: 10
                            }}>
                                <span>{currentTime}</span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <span>●●●○</span>
                                    <span>▲▼</span>
                                    <span>85% 🔋</span>
                                </div>
                            </div>

                            {/* Nav Bar */}
                            <div style={{
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(255,255,255,0.8)',
                                backdropFilter: 'blur(10px)',
                                borderBottom: '1px solid rgba(0,0,0,0.1)'
                            }}>
                                <span style={{ fontWeight: '600', fontSize: '17px', color: '#1c1c1e' }}>A의 태블릿 보안 인증</span>
                            </div>

                            {/* Scrollable Content */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                {/* Profile Card */}
                                <div style={{
                                    width: '100%', maxWidth: '480px',
                                    background: '#fff',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{
                                        width: '50px', height: '50px',
                                        borderRadius: '50%',
                                        background: '#e5e5ea',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        marginRight: '16px',
                                        fontSize: '20px'
                                    }}>👤</div>
                                    <div>
                                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#000' }}>기기 소유자: A</div>
                                        <div style={{ fontSize: '0.8rem', color: '#8e8e93' }}>최근 사용: 8월 23일 19:58</div>
                                    </div>
                                </div>

                                {/* Input Form Container */}
                                <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                    {/* Name Input */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', color: '#6e6e73', marginBottom: '8px', marginLeft: '4px' }}>
                                            이름 <span style={{ fontSize: '0.75rem', color: '#007aff' }}>(일기장/서류 참고)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={inputName}
                                            onChange={(e) => setInputName(e.target.value)}
                                            placeholder="예: 김○○"
                                            disabled={lockoutTimer > 0}
                                            style={{
                                                width: '100%', padding: '12px',
                                                borderRadius: '10px', border: '1px solid #e5e5ea',
                                                fontSize: '1rem', color: '#000',
                                                background: lockoutTimer > 0 ? '#f2f2f7' : '#fff'
                                            }}
                                        />
                                    </div>

                                    {/* DOB Input with Realistic Picker */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', color: '#6e6e73', marginBottom: '8px', marginLeft: '4px' }}>
                                            생년월일 (8자리)
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                value={inputDOB}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                                                    setInputDOB(val);
                                                }}
                                                placeholder="YYYYMMDD"
                                                disabled={lockoutTimer > 0}
                                                style={{
                                                    width: '100%', padding: '12px',
                                                    borderRadius: '10px', border: '1px solid #e5e5ea',
                                                    fontSize: '1rem', color: '#000',
                                                    background: lockoutTimer > 0 ? '#f2f2f7' : '#fff'
                                                }}
                                            />
                                            {/* Hidden native date picker */}
                                            <input
                                                type="date"
                                                style={{
                                                    position: 'absolute', right: '10px', top: '10px',
                                                    opacity: 0, width: '30px', height: '30px',
                                                    cursor: 'pointer', zIndex: 10
                                                }}
                                                onChange={(e) => {
                                                    // Convert YYYY-MM-DD to YYYYMMDD
                                                    const val = e.target.value.replace(/-/g, '');
                                                    setInputDOB(val);
                                                }}
                                                disabled={lockoutTimer > 0}
                                            />
                                            <span style={{
                                                position: 'absolute', right: '12px', top: '12px',
                                                fontSize: '1.2rem', opacity: 0.5, pointerEvents: 'none'
                                            }}>📅</span>
                                        </div>
                                    </div>

                                    {/* Security Question */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', color: '#6e6e73', marginBottom: '12px', marginLeft: '4px' }}>
                                            보안 질문: 작년 생일에 가장 기억에 남는 일은?
                                        </label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {[
                                                { val: 'cake', text: '케이크를 같이 고르고 촛불을 두 번 불었다' },
                                                { val: 'park', text: '놀이공원에 갔다' },
                                                { val: 'karaoke', text: '친구들과 노래방에 갔다' }
                                            ].map((opt) => (
                                                <label key={opt.val} style={{
                                                    display: 'flex', alignItems: 'center',
                                                    padding: '12px', background: '#fff',
                                                    borderRadius: '10px', border: securityAnswer === opt.val ? '1px solid #007aff' : '1px solid #e5e5ea',
                                                    cursor: lockoutTimer > 0 ? 'not-allowed' : 'pointer'
                                                }}>
                                                    <input
                                                        type="radio"
                                                        name="securityQuestion"
                                                        value={opt.val}
                                                        checked={securityAnswer === opt.val}
                                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                                        disabled={lockoutTimer > 0}
                                                        style={{ marginRight: '10px' }}
                                                    />
                                                    <span style={{ fontSize: '0.95rem', color: '#000' }}>{opt.text}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {authError && (
                                        <div style={{
                                            padding: '12px', background: '#ffe5e5',
                                            borderRadius: '10px', color: '#ff3b30',
                                            fontSize: '0.9rem', textAlign: 'center',
                                            fontWeight: '500'
                                        }}>
                                            {authError} {lockoutTimer > 0 && `(${lockoutTimer}초 후 재시도)`}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleInputVerify}
                                        disabled={lockoutTimer > 0}
                                        style={{
                                            width: '100%', height: '52px',
                                            background: lockoutTimer > 0 ? '#aeaeb2' : '#007aff',
                                            color: '#fff', border: 'none',
                                            borderRadius: '14px', fontSize: '1.1rem',
                                            fontWeight: '600', cursor: lockoutTimer > 0 ? 'not-allowed' : 'pointer',
                                            marginTop: '10px', marginBottom: '20px'
                                        }}
                                    >
                                        인증 완료
                                    </button>

                                    <div style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => setShowHintModal(true)}
                                            style={{
                                                background: 'none', border: 'none',
                                                color: '#007aff', fontSize: '0.85rem',
                                                textDecoration: 'none', cursor: 'pointer'
                                            }}>
                                            인증이 어려우신가요?
                                        </button>
                                    </div>

                                </div>
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

            {/* Blocking Overlay when Dialogue is open - Prevents clicking behind */}
            {showDialogue && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 199, // Just below dialogue (200)
                    background: 'transparent', // Or 'rgba(0,0,0,0.1)' for debug
                    cursor: 'default'
                }} onClick={(e) => e.stopPropagation()}></div>
            )}

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

            {/* Hint Modal */}
            {showHintModal && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(3px)',
                    zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }} onClick={() => setShowHintModal(false)}>
                    <div style={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        padding: '25px',
                        borderRadius: '16px',
                        width: '80%',
                        maxWidth: '320px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        textAlign: 'center'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', color: '#000' }}>💡 참고 힌트</h3>
                        <p style={{ fontSize: '1rem', color: '#333', marginBottom: '20px', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                            수사 본부로부터 받은 <strong>일기장</strong>을 확인해보세요.
                        </p>
                        <button
                            onClick={() => setShowHintModal(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#007aff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            확인
                        </button>
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
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                @keyframes ping {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    80%, 100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

const LogMessage = ({ text, delay }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    return visible ? <div style={{ marginBottom: '8px' }}>{text}</div> : null;
};

const RedirectToP6 = ({ onComplete, delay }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, delay);
        return () => clearTimeout(timer);
    }, [delay, onComplete]);
    return null;
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
