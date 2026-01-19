import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const TabletHighPrecision = ({ onRecoveryClick, onHeartLoss }) => {
    // Phases: 'scanning' -> 'failed' -> 'realization' (monologue) -> 'payment_alert' -> 'asset_loss'
    const [phase, setPhase] = useState('scanning');
    const [monologuePhase, setMonologuePhase] = useState('none'); // none, active
    const [monologueIndex, setMonologueIndex] = useState(0);

    // Visual States
    const [flash, setFlash] = useState(false);
    const [showPaymentNotif, setShowPaymentNotif] = useState(false);
    const [showAssetPopup, setShowAssetPopup] = useState(false);

    // Guard Ref for strict mode
    const realizationTriggered = useRef(false);

    const monologueLines = [
        "아....!",
        "잘못된 걸 쫓고 있었어.",
        "휴대폰은 A의 방에 있었지...",
        "어차피 가지고 있지 않은 휴대폰을 찾고 있었어."
    ];

    // Sequence Controller
    useEffect(() => {
        // Prevent re-running if we are already deep in the sequence (handled by internal timeouts)
        // We only want to trigger the START of the sequence when phase changes to 'realization'

        if (phase === 'scanning') {
            const timer = setTimeout(() => {
                // User requirement: "Scanning -> Fail -> Monologue"
                setPhase('failed');
                // Show Fail UI for 1.5s then start monologue
                setTimeout(() => setMonologuePhase('active'), 1500);
            }, 3000);
            return () => clearTimeout(timer);
        }

        if (phase === 'realization') {
            // Trigger Payment Alert Sequence after monologue
            // Use Ref to strictly ensure this only runs once per lifecycle/reset
            if (realizationTriggered.current) return;
            realizationTriggered.current = true;

            setFlash(true);
            setTimeout(() => setFlash(false), 200);

            // 1. Payment Notification
            setShowPaymentNotif(true);

            // 2. Heart Break (Global) - after 1s
            setTimeout(() => {
                if (onHeartLoss) onHeartLoss();
            }, 1000);

            // 3. Asset Loss Popup - after 2.5s
            setTimeout(() => {
                setShowAssetPopup(true);
            }, 2500);
        }
    }, [phase, onHeartLoss]);

    const handleMonologueClick = () => {
        if (monologueIndex < monologueLines.length - 1) {
            setMonologueIndex(prev => prev + 1);
        } else {
            setMonologuePhase('none');
            setPhase('realization'); // Start consequences
        }
    };

    return (
        <div style={{
            width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
            background: '#101622', fontFamily: '"Manrope", sans-serif'
        }}>
            {/* Flash Effect */}
            {flash && <div style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 9999 }}></div>}

            {/* --- Dashboard UI --- */}

            {/* Map Background (Simulated) */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: "url('https://tile.openstreetmap.org/16/55797/25271.png')",
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: phase === 'failed' || phase === 'realization' ? 'grayscale(1) brightness(0.3)' : 'brightness(0.75)',
                    transition: 'filter 1s'
                }}></div>

                {/* Center Circle / Radar */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {phase === 'scanning' && (
                        <div style={{
                            width: '6rem', height: '6rem', borderRadius: '50%',
                            backgroundColor: 'rgba(19, 91, 236, 0.15)', border: '1.5px solid rgba(19, 91, 236, 0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                            boxShadow: '0 0 30px rgba(19, 91, 236, 0.2)'
                        }}>
                            <div style={{ position: 'absolute', width: '2rem', height: '2rem', background: 'rgba(19, 91, 236, 0.3)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                            <div style={{ width: '80px', height: '80px', border: '4px solid #135bec', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        </div>
                    )}
                    {phase === 'failed' && (
                        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 0 30px #ef4444', animation: 'pulse 2s infinite' }}>📡❌</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Header */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '1rem', justifyContent: 'space-between', zIndex: 30 }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(16, 22, 34, 0.5)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.5rem', color: 'white' }}>⌖</span>
                </div>
                <h2 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 'bold', flex: 1, textAlign: 'center', textShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>위치 대시보드</h2>
                <div style={{ width: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                    <button style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(16, 22, 34, 0.5)', backdropFilter: 'blur(12px)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        🔔
                    </button>
                </div>
            </div>

            {/* Bottom Status Panel - Dynamic Height & Style */}
            <div style={{
                marginTop: 'auto', zIndex: 30, padding: '1rem', paddingBottom: '2rem', position: 'absolute', bottom: 0, width: '100%', boxSizing: 'border-box',
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <div style={{
                    background: phase === 'failed' ? 'rgba(30, 10, 10, 0.95)' : 'rgba(16, 22, 34, 0.95)',
                    backdropFilter: 'blur(24px)',
                    border: phase === 'failed' ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '1.5rem', padding: phase === 'failed' ? '2rem' : '1.25rem',
                    boxShadow: phase === 'failed' ? '0 0 40px rgba(239, 68, 68, 0.2)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                    transform: phase === 'failed' ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.5s'
                }}>
                    {phase === 'scanning' ? (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(19, 91, 236, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ color: '#135bec', fontSize: '1.875rem', animation: 'pulse 2s infinite' }}>⌖</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 'bold' }}>정밀 위치 확인 중</h3>
                                    <div style={{ width: '0.375rem', height: '0.375rem', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                                </div>
                                <p style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500', marginTop: '0.125rem' }}>충청북도 청주시 청원구 율량동</p>
                                <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>오차 범위: 2m 이내 • 실시간 업데이트 중</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexDirection: 'column', textAlign: 'center' }}>
                            {/* Expanded Failed UI */}
                            <div style={{
                                width: '4.5rem', height: '4.5rem', borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
                            }}>
                                <span style={{ color: '#ef4444', fontSize: '2.5rem' }}>⚠️</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ color: '#ef4444', fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: ' -0.5px' }}>신호 감지 실패</h3>
                                <p style={{ color: '#e2e8f0', fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.6' }}>
                                    추적 대상의 신호가 <br />전혀 잡히지 않습니다.
                                </p>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px', display: 'inline-block' }}>
                                    연결된 휴대폰 기반 추적만 지원됩니다.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Overlays & Popups --- */}

            {/* Payment Notification (Inside Tablet) */}
            {showPaymentNotif && (
                <div style={{
                    position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    width: '90%', maxWidth: '380px', background: 'rgba(255, 255, 255, 0.95)',
                    color: '#1e293b', padding: '12px 16px', borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 100,
                    display: 'flex', alignItems: 'center', gap: '12px',
                    animation: 'slideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>💳</div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>결제 알림</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>55,000원이 결제되었습니다.</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Footprint Finder · Digital Footprint 서비스</div>
                    </div>
                </div>
            )}

            {/* Asest Loss Popup */}
            {showAssetPopup && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '85%', maxWidth: '360px', background: '#1e293b', borderRadius: '16px',
                    border: '1px solid #ef4444', boxShadow: '0 0 40px rgba(239, 68, 68, 0.5)',
                    padding: '24px', zIndex: 200, textAlign: 'center', animation: 'bounce 0.5s'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💸</div>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>자산 손실 감지</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                        체크 박스를 해제하지 않아, <br />
                        <strong style={{ color: '#ef4444' }}>A의 자산을 잃었습니다.</strong><br />
                        복구하기 위해서는 서비스 가입을 취소하세요.
                    </p>
                    <button
                        onClick={onRecoveryClick}
                        style={{
                            background: '#ef4444', color: 'white', border: 'none', padding: '12px',
                            width: '100%',
                            borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem',
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                        }}>
                        [ 복구 미션으로 이동 ]
                    </button>
                </div>
            )}

            {/* Monologue Overlay - Portal */}
            {monologuePhase === 'active' && createPortal(
                <div
                    onClick={handleMonologueClick}
                    style={{
                        position: 'fixed', bottom: '5%', left: '50%', transform: 'translateX(-50%)',
                        width: '70%', maxWidth: '1000px', minHeight: '180px',
                        background: 'rgba(15, 5, 25, 0.85)',
                        border: '1px solid rgba(191, 90, 242, 0.5)',
                        boxShadow: '0 0 30px rgba(191, 90, 242, 0.3)',
                        backdropFilter: 'blur(16px)',
                        clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                        zIndex: 9999, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', padding: '0'
                    }}
                >
                    <div style={{ width: '100%', height: '35px', background: 'linear-gradient(90deg, rgba(191, 90, 242, 0.15) 0%, transparent 100%)', borderBottom: '1px solid rgba(191, 90, 242, 0.5)', display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#BF5AF2', marginRight: '15px', borderRadius: '50%', boxShadow: '0 0 8px #BF5AF2' }}></div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#BF5AF2', letterSpacing: '2px', fontWeight: 'bold' }}>DIGITAL INVESTIGATION // REALIZATION</span>
                    </div>
                    <div style={{ padding: '2rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(191, 90, 242, 0.15)', padding: '0.4rem 1.5rem', borderLeft: '4px solid #BF5AF2', marginBottom: '1rem', width: 'fit-content' }}>
                            <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.05em' }}>나</span>
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.3rem', lineHeight: '1.6', margin: 0, fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {monologueLines[monologueIndex]}
                        </p>
                    </div>
                    <div style={{ position: 'absolute', bottom: '20px', right: '30px', color: '#BF5AF2', fontSize: '1.2rem', fontWeight: 'bold', animation: 'bounce 1s infinite', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        NEXT <span style={{ fontSize: '1.0rem' }}>▼</span>
                    </div>
                </div>,
                document.body
            )}
            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translate(-50%, -50%);}
                    40% {transform: translate(-50%, -60%);}
                    60% {transform: translate(-50%, -55%);}
                }
                @keyframes slideDown {
                    from { transform: translate(-50%, -100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default TabletHighPrecision;
