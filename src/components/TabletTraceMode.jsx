import React, { useState, useEffect } from 'react';

const TabletTraceMode = ({ onUpgradeClick, onExitClick }) => {
    const [currentTime, setCurrentTime] = useState('');
    const [stage, setStage] = useState('intro');
    const [showDialogue, setShowDialogue] = useState(false);
    const [dialogueText, setDialogueText] = useState('');
    const [dialogueQueue, setDialogueQueue] = useState([]);
    const [dateHighlighted, setDateHighlighted] = useState(false);
    const [showUpgradeCard, setShowUpgradeCard] = useState(false);

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

    useEffect(() => {
        setTimeout(() => {
            setDialogueText('드디어 위치 추적 화면이다. A가 마지막으로 있었던 위치를 확인해보자.');
            setDialogueQueue(['저기 왼쪽에 마지막 위치 기록이 보인다...']);
            setShowDialogue(true);
            setStage('mapView');
        }, 800);
    }, []);

    const handleDateClick = () => {
        if (stage !== 'mapView') return;
        setDateHighlighted(true);
        setStage('dateClicked');

        setTimeout(() => {
            setDialogueText('2025년 8월 24일... 잠깐, 이 날짜...');
            setDialogueQueue([
                'A의 생일이 8월 24일이었지.',
                '생일날…? 왜 하필 생일날 사라진걸까...',
                '마지막 기록은 확인했지만...위치 범위가 너무 넓은데....'
            ]);
            setShowDialogue(true);
        }, 500);
    };

    const handleDialogueClick = () => {
        if (dialogueQueue.length > 0) {
            const nextMsg = dialogueQueue[0];
            setDialogueText(nextMsg);
            setDialogueQueue(prev => prev.slice(1));
        } else {
            setShowDialogue(false);
            if (stage === 'dateClicked') {
                setStage('decision');
                setShowUpgradeCard(true);
            }
        }
    };

    const handleUpgrade = () => {
        if (onUpgradeClick) onUpgradeClick();
    };

    const handleExit = () => {
        if (onExitClick) onExitClick();
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: '#0a0a12',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* 지도 배경 */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                opacity: 0.6,
                filter: 'saturate(0.25) brightness(0.55) contrast(1.1)'
            }}>
                {[
                    'https://tile.openstreetmap.org/16/55982/25646.png',
                    'https://tile.openstreetmap.org/16/55983/25646.png',
                    'https://tile.openstreetmap.org/16/55984/25646.png',
                    'https://tile.openstreetmap.org/16/55982/25647.png',
                    'https://tile.openstreetmap.org/16/55983/25647.png',
                    'https://tile.openstreetmap.org/16/55984/25647.png',
                ].map((url, i) => (
                    <div key={i} style={{
                        backgroundImage: `url('${url}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }} />
                ))}
            </div>

            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 45%, rgba(10,10,18,0.4) 0%, rgba(10,10,18,0.9) 100%)'
            }} />

            {/* 상단 앱 바 */}
            <div style={{
                position: 'relative',
                zIndex: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                background: 'rgba(10, 10, 18, 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                    }}>📍</div>
                    <span style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Footprint Finder</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        padding: '8px 16px',
                        background: 'rgba(255, 80, 80, 0.2)',
                        border: '1px solid rgba(255, 80, 80, 0.4)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#ff5050',
                            animation: 'blink 1s infinite'
                        }} />
                        긴급 추적 모드
                    </div>
                    <div style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '1.2rem',
                        fontWeight: '500'
                    }}>{currentTime}</div>
                </div>
            </div>

            {/* 블러 위치 영역 - 더 크게 */}
            <div style={{
                position: 'absolute',
                top: '55%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10
            }}>
                <div style={{
                    width: '380px',
                    height: '380px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,70,70,0.25) 0%, rgba(255,70,70,0.1) 40%, transparent 70%)',
                    border: '3px dashed rgba(255, 90, 90, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    animation: 'breathe 3s ease-in-out infinite'
                }}>
                    {/* 정확도 부족 경고 - 더 크게 */}
                    <div style={{
                        position: 'absolute',
                        top: '-55px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        padding: '10px 20px',
                        borderRadius: '24px',
                        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.5)'
                    }}>
                        <span style={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: '#fff'
                        }}>⚠️ 정확도 부족 - 약 500m 오차</span>
                    </div>

                    {/* 중간 원 */}
                    <div style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'rgba(255, 120, 80, 0.12)',
                        border: '2px dashed rgba(255, 120, 80, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* 중심점 */}
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: 'rgba(255, 160, 100, 0.3)',
                            border: '3px solid rgba(255, 160, 100, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '3px solid rgba(255, 140, 100, 0.7)',
                                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                            }} />
                            <span style={{ fontSize: '28px', filter: 'blur(1px)' }}>📍</span>
                        </div>
                    </div>

                    {/* 위치 텍스트 */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-45px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.8)',
                        padding: '10px 24px',
                        borderRadius: '12px',
                        backdropFilter: 'blur(8px)'
                    }}>
                        <span style={{
                            fontSize: '1.1rem',
                            color: '#fff',
                            fontWeight: '600'
                        }}>충북 청주시 흥덕구 율량동</span>
                    </div>
                </div>
            </div>

            {/* 마지막 위치 기록 카드 - 더 크게 */}
            <div
                onClick={handleDateClick}
                style={{
                    position: 'absolute',
                    top: '110px',
                    left: '24px',
                    zIndex: 25,
                    background: dateHighlighted
                        ? 'linear-gradient(135deg, rgba(255, 180, 100, 0.95) 0%, rgba(255, 140, 80, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(50, 80, 150, 0.9) 0%, rgba(80, 60, 150, 0.9) 100%)',
                    backdropFilter: 'blur(16px)',
                    border: dateHighlighted
                        ? '3px solid #fff'
                        : '2px solid rgba(100, 150, 255, 0.5)',
                    borderRadius: '20px',
                    padding: '20px 28px',
                    cursor: stage === 'mapView' ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    boxShadow: dateHighlighted
                        ? '0 10px 40px rgba(255, 140, 80, 0.6)'
                        : '0 8px 35px rgba(59, 130, 246, 0.4)',
                    animation: stage === 'mapView' ? 'cardPulse 1.5s ease-in-out infinite' : 'none',
                    minWidth: '220px'
                }}
            >
                {stage === 'mapView' && (
                    <div style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '-12px',
                        width: '36px',
                        height: '36px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'bounce 0.8s ease-in-out infinite',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.6)',
                        border: '3px solid #fff'
                    }}>
                        <span style={{ fontSize: '16px' }}>👆</span>
                    </div>
                )}

                <div style={{
                    fontSize: '0.9rem',
                    color: dateHighlighted ? 'rgba(0,0,0,0.6)' : 'rgba(180, 200, 255, 1)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    📅 마지막 위치 기록
                </div>
                <div style={{
                    fontSize: dateHighlighted ? '1.8rem' : '1.5rem',
                    fontWeight: 'bold',
                    color: dateHighlighted ? '#000' : '#fff',
                    transition: 'all 0.3s ease',
                    letterSpacing: '-0.5px'
                }}>
                    2025.08.24 08:13
                </div>
                {dateHighlighted && (
                    <div style={{
                        marginTop: '12px',
                        fontSize: '1.1rem',
                        color: '#7c2d12',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        🎂 A의 생일날!
                    </div>
                )}
            </div>

            {/* 신호 상태 표시 - 더 크게 */}
            <div style={{
                position: 'absolute',
                top: '110px',
                right: '24px',
                zIndex: 25,
                background: 'rgba(20, 25, 40, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '16px 24px'
            }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(148, 163, 184, 1)', marginBottom: '6px', fontWeight: '600' }}>신호 상태</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#fbbf24',
                        boxShadow: '0 0 10px #fbbf24'
                    }} />
                    <span style={{ color: '#fbbf24', fontSize: '1.2rem', fontWeight: '700' }}>약함</span>
                </div>
            </div>

            {/* 업그레이드 유도 카드 - 더 크게 */}
            {showUpgradeCard && (
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '24px',
                    right: '24px',
                    zIndex: 30,
                    background: 'linear-gradient(135deg, rgba(15, 25, 45, 0.98) 0%, rgba(25, 35, 55, 0.98) 100%)',
                    backdropFilter: 'blur(24px)',
                    border: '2px solid rgba(100, 150, 255, 0.3)',
                    borderRadius: '28px',
                    padding: '28px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)'
                        }}>🎯</div>
                        <div>
                            <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '6px' }}>
                                정확도 업그레이드
                            </h3>
                            <p style={{ color: 'rgba(148, 163, 184, 1)', fontSize: '1rem' }}>
                                정확한 위치를 확인하려면 업그레이드가 필요합니다
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                        <div style={{
                            flex: 1,
                            padding: '16px 20px',
                            background: 'rgba(255, 100, 100, 0.15)',
                            border: '2px solid rgba(255, 100, 100, 0.4)',
                            borderRadius: '16px'
                        }}>
                            <div style={{ fontSize: '0.85rem', color: '#ff6b6b', marginBottom: '6px', fontWeight: '700' }}>현재</div>
                            <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '700' }}>~500m 오차</div>
                        </div>
                        <div style={{
                            flex: 1,
                            padding: '16px 20px',
                            background: 'rgba(100, 255, 150, 0.15)',
                            border: '2px solid rgba(100, 255, 150, 0.4)',
                            borderRadius: '16px'
                        }}>
                            <div style={{ fontSize: '0.85rem', color: '#4ade80', marginBottom: '6px', fontWeight: '700' }}>업그레이드 후</div>
                            <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '700' }}>~5m 오차</div>
                        </div>
                    </div>

                    <div style={{
                        padding: '16px 20px',
                        background: 'rgba(100, 116, 139, 0.15)',
                        border: '1px solid rgba(100, 116, 139, 0.25)',
                        borderRadius: '14px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ color: 'rgba(180, 190, 200, 0.9)', fontSize: '1rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                            "선택의 기로에 있어. 선택해보자."
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={handleExit}
                            style={{
                                flex: 1,
                                padding: '18px 24px',
                                background: 'rgba(100, 116, 139, 0.25)',
                                border: '2px solid rgba(100, 116, 139, 0.4)',
                                borderRadius: '16px',
                                color: 'rgba(200, 210, 220, 1)',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            다시 생각해보기
                        </button>
                        <button
                            onClick={handleUpgrade}
                            style={{
                                flex: 1.3,
                                padding: '18px 24px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                border: 'none',
                                borderRadius: '16px',
                                color: '#fff',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                boxShadow: '0 8px 30px rgba(59, 130, 246, 0.5)'
                            }}
                        >
                            ⚡ 정확도 업그레이드
                        </button>
                    </div>
                </div>
            )}

            {/* 대화창 블로킹 오버레이 */}
            {showDialogue && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 199,
                    background: 'rgba(0,0,0,0.5)',
                    cursor: 'default'
                }} onClick={(e) => e.stopPropagation()} />
            )}

            {/* 독백 대화창 */}
            {showDialogue && (
                <div onClick={handleDialogueClick} style={{
                    position: 'absolute',
                    bottom: '50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '94%',
                    maxWidth: '850px',
                    minHeight: '150px',
                    background: 'rgba(15, 5, 25, 0.95)',
                    border: '2px solid rgba(191, 90, 242, 0.6)',
                    boxShadow: '0 0 50px rgba(191, 90, 242, 0.4)',
                    backdropFilter: 'blur(24px)',
                    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                    zIndex: 200,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        width: '100%',
                        height: '36px',
                        background: 'linear-gradient(90deg, rgba(191, 90, 242, 0.25) 0%, transparent 100%)',
                        borderBottom: '1px solid rgba(191, 90, 242, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '28px'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            background: '#BF5AF2',
                            marginRight: '12px',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px #BF5AF2'
                        }} />
                        <span style={{
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            color: '#BF5AF2',
                            letterSpacing: '1.5px',
                            fontWeight: 'bold'
                        }}>DIGITAL INVESTIGATION // 위치 추적</span>
                    </div>
                    <div style={{
                        padding: '1.5rem 2rem',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(191, 90, 242, 0.2)',
                            padding: '0.4rem 1rem',
                            borderLeft: '4px solid #BF5AF2',
                            marginBottom: '0.8rem',
                            width: 'fit-content'
                        }}>
                            <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '800' }}>나</span>
                        </div>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontSize: '1.3rem',
                            lineHeight: '1.7',
                            margin: 0
                        }}>
                            {dialogueText}
                        </p>
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '18px',
                        right: '24px',
                        color: '#BF5AF2',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        animation: 'bounce 1s infinite',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        다음 <span style={{ fontSize: '0.9rem' }}>▼</span>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.85; }
                    50% { transform: scale(1.015); opacity: 1; }
                }
                @keyframes cardPulse {
                    0%, 100% { 
                        transform: scale(1); 
                        box-shadow: 0 8px 35px rgba(59, 130, 246, 0.4);
                    }
                    50% { 
                        transform: scale(1.03); 
                        box-shadow: 0 12px 45px rgba(59, 130, 246, 0.6);
                    }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

export default TabletTraceMode;
