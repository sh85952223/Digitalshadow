import React, { useState, useEffect } from 'react';

const TabletScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('off'); // off, booting, lockscreen, notification
    const [showNotification, setShowNotification] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        // Update time
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

        // Boot animation sequence
        setTimeout(() => {
            setPhase('lockscreen');

            // Show notification after lock screen appears
            setTimeout(() => {
                setShowNotification(true);
            }, 1500);
        }, 2000);
    };

    const handleNotificationClick = () => {
        setShowNotification(false);
        if (onComplete) onComplete();
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
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
                    background: phase === 'off' ? '#000' : phase === 'booting' ? '#000' : 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'background 0.5s ease'
                }}>
                    {/* OFF State - Press to Power On */}
                    {phase === 'off' && (
                        <div
                            onClick={handlePowerOn}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                color: '#333'
                            }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '3px solid #333',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '2rem',
                                marginBottom: '20px',
                                transition: 'all 0.3s'
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#666';
                                    e.currentTarget.style.color = '#666';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#333';
                                    e.currentTarget.style.color = '#333';
                                }}
                            >⏻</div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>터치하여 전원 켜기</p>
                        </div>
                    )}

                    {/* Booting State */}
                    {phase === 'booting' && (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#000'
                        }}>
                            {/* Logo */}
                            <div style={{
                                fontSize: '3rem',
                                color: '#fff',
                                marginBottom: '30px',
                                animation: 'pulse 1.5s infinite'
                            }}>
                                🍎
                            </div>
                            {/* Loading bar */}
                            <div style={{
                                width: '150px',
                                height: '4px',
                                background: '#333',
                                borderRadius: '2px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: '#fff',
                                    animation: 'loadingBar 2s ease-out forwards'
                                }}></div>
                            </div>
                        </div>
                    )}

                    {/* Lock Screen */}
                    {(phase === 'lockscreen' || phase === 'notification') && (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            animation: 'fadeIn 0.5s ease-out'
                        }}>
                            {/* Status Bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '35px',
                                padding: '0 25px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                color: '#fff',
                                fontSize: '0.85rem',
                                fontWeight: '600'
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
                                    fontSize: '6rem',
                                    fontWeight: '200',
                                    color: '#fff',
                                    letterSpacing: '-5px',
                                    textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                                }}>
                                    {currentTime}
                                </div>
                                <div style={{
                                    fontSize: '1.3rem',
                                    color: 'rgba(255,255,255,0.9)',
                                    fontWeight: '400'
                                }}>
                                    1월 17일 금요일
                                </div>
                            </div>

                            {/* Swipe Hint */}
                            <div style={{
                                position: 'absolute',
                                bottom: '40px',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{
                                    width: '50px',
                                    height: '5px',
                                    background: 'rgba(255,255,255,0.5)',
                                    borderRadius: '3px'
                                }}></span>
                            </div>

                            {/* Push Notification */}
                            {showNotification && (
                                <div
                                    onClick={handleNotificationClick}
                                    style={{
                                        position: 'absolute',
                                        top: '50px',
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
                                        animation: 'slideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateX(-50%) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.4)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
                                    }}
                                >
                                    {/* App Icon */}
                                    <div style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '1.5rem',
                                        flexShrink: 0
                                    }}>
                                        📍
                                    </div>

                                    {/* Notification Content */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '4px'
                                        }}>
                                            <span style={{
                                                fontWeight: '700',
                                                color: '#333',
                                                fontSize: '0.95rem'
                                            }}>위치 추적</span>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                color: '#888'
                                            }}>지금</span>
                                        </div>
                                        <p style={{
                                            margin: 0,
                                            color: '#555',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.4
                                        }}>
                                            A의 위치가 궁금하신가요? 위치 추적하기
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <div style={{
                                        color: '#aaa',
                                        fontSize: '1.2rem'
                                    }}>›</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Home Button (Physical) */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '10px',
                    height: '10px',
                    background: '#333',
                    borderRadius: '50%'
                }}></div>

                {/* Camera */}
                <div style={{
                    position: 'absolute',
                    top: '22px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '8px',
                    background: '#1a1a1a',
                    borderRadius: '50%',
                    border: '1px solid #333'
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
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideDown {
                    from { 
                        opacity: 0;
                        transform: translateX(-50%) translateY(-30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TabletScreen;
