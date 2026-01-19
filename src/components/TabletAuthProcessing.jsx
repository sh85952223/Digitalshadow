import React, { useState, useEffect } from 'react';

const TabletAuthProcessing = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('GPS 신호 수신 중...');
    const [subText, setSubText] = useState('위성과 연결을 시도하고 있습니다');

    useEffect(() => {
        // Progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 80);

        // Status text changes
        const timers = [
            setTimeout(() => {
                setStatusText('위성 연결 중...');
                setSubText('9개 위성 신호 감지');
            }, 1500),
            setTimeout(() => {
                setStatusText('위치 분석 중...');
                setSubText('좌표 데이터를 처리하고 있습니다');
            }, 3000),
            setTimeout(() => {
                setStatusText('인증 완료');
                setSubText('추적 모드로 진입합니다');
            }, 4500),
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 5500)
        ];

        return () => {
            clearInterval(progressInterval);
            timers.forEach(t => clearTimeout(t));
        };
    }, [onComplete]);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: '#0a0c14',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: '"Manrope", -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
            {/* Grid Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                opacity: 0.5
            }} />

            {/* Radial gradient overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, transparent 0%, rgba(10, 12, 20, 0.7) 60%, #0a0c14 100%)'
            }} />

            {/* Radar Container */}
            <div style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
            }}>
                {/* Concentric circles */}
                <div style={{
                    position: 'absolute',
                    width: '260px',
                    height: '260px',
                    borderRadius: '50%',
                    border: '1px solid rgba(19, 91, 236, 0.15)'
                }} />
                <div style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    border: '1px solid rgba(19, 91, 236, 0.25)'
                }} />
                <div style={{
                    position: 'absolute',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    border: '1px solid rgba(19, 91, 236, 0.35)'
                }} />

                {/* Pulse rings */}
                <div style={{
                    position: 'absolute',
                    width: '260px',
                    height: '260px',
                    borderRadius: '50%',
                    border: '2px solid rgba(19, 91, 236, 0.4)',
                    animation: 'pulseRing 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
                }} />
                <div style={{
                    position: 'absolute',
                    width: '260px',
                    height: '260px',
                    borderRadius: '50%',
                    border: '2px solid rgba(19, 91, 236, 0.4)',
                    animation: 'pulseRing 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite 1.5s'
                }} />

                {/* Radar sweep */}
                <div style={{
                    position: 'absolute',
                    width: '260px',
                    height: '260px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, rgba(19, 91, 236, 0.5) 0deg, rgba(19, 91, 236, 0) 90deg)',
                    animation: 'radarSweep 4s linear infinite'
                }} />

                {/* Center point */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        position: 'absolute',
                        width: '16px',
                        height: '16px',
                        background: '#135bec',
                        borderRadius: '50%',
                        filter: 'blur(4px)',
                        animation: 'pulse 2s infinite'
                    }} />
                    <div style={{
                        width: '8px',
                        height: '8px',
                        background: '#fff',
                        borderRadius: '50%',
                        boxShadow: '0 0 15px #135bec'
                    }} />
                </div>

                {/* Coordinates - positioned below center */}
                <div style={{
                    position: 'absolute',
                    top: '60%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    whiteSpace: 'nowrap'
                }}>
                    <span style={{
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        color: 'rgba(19, 91, 236, 0.8)',
                        letterSpacing: '2px',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '4px 8px',
                        borderRadius: '4px'
                    }}>
                        37.5665° N, 126.9780° E
                    </span>
                </div>
            </div>

            {/* Status Text */}
            <div style={{
                marginTop: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10
            }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    letterSpacing: '-0.5px',
                    textShadow: '0 0 15px rgba(19, 91, 236, 0.8)',
                    animation: 'glowText 2s ease-in-out infinite'
                }}>
                    {statusText}
                </h1>
                <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(148, 163, 184, 1)',
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                }}>
                    {subText}
                </p>
            </div>

            {/* Progress Bar Section */}
            <div style={{
                position: 'absolute',
                bottom: '60px',
                left: '40px',
                right: '40px',
                zIndex: 10
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '8px'
                }}>
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#135bec',
                        letterSpacing: '-0.5px',
                        textTransform: 'uppercase'
                    }}>
                        Signal Acquisition
                    </span>
                    <span style={{
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        color: 'rgba(100, 116, 139, 1)'
                    }}>
                        {progress}%
                    </span>
                </div>
                <div style={{
                    height: '3px',
                    width: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '999px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: '#135bec',
                        boxShadow: '0 0 10px #135bec',
                        borderRadius: '999px',
                        transition: 'width 0.1s ease-out'
                    }} />
                </div>

                {/* Bottom Info */}
                <div style={{
                    marginTop: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: 0.5
                }}>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontSize: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                color: 'rgba(148, 163, 184, 1)'
                            }}>Satellites</span>
                            <span style={{
                                fontSize: '10px',
                                fontFamily: 'monospace',
                                color: '#fff'
                            }}>09 Active</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontSize: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                color: 'rgba(148, 163, 184, 1)'
                            }}>Latency</span>
                            <span style={{
                                fontSize: '10px',
                                fontFamily: 'monospace',
                                color: '#fff'
                            }}>12ms</span>
                        </div>
                    </div>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                    }}>
                        📡
                    </div>
                </div>
            </div>

            {/* Corner Decorations */}
            <div style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                width: '20px',
                height: '20px',
                borderTop: '2px solid rgba(19, 91, 236, 0.3)',
                borderLeft: '2px solid rgba(19, 91, 236, 0.3)'
            }} />
            <div style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '20px',
                height: '20px',
                borderTop: '2px solid rgba(19, 91, 236, 0.3)',
                borderRight: '2px solid rgba(19, 91, 236, 0.3)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                width: '20px',
                height: '20px',
                borderBottom: '2px solid rgba(19, 91, 236, 0.3)',
                borderLeft: '2px solid rgba(19, 91, 236, 0.3)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '24px',
                right: '24px',
                width: '20px',
                height: '20px',
                borderBottom: '2px solid rgba(19, 91, 236, 0.3)',
                borderRight: '2px solid rgba(19, 91, 236, 0.3)'
            }} />

            {/* Keyframe Animations */}
            <style>{`
                @keyframes radarSweep {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulseRing {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes glowText {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
};

export default TabletAuthProcessing;
