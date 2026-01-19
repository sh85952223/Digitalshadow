import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const TabletUpgrade = ({ onBackClick, onPurchaseClick }) => {
    const [isChecked, setIsChecked] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [monologuePhase, setMonologuePhase] = useState('none'); // none, active, complete
    const [monologueIndex, setMonologueIndex] = useState(0);

    // "Flashy" Benefit Cards Data
    const benefits = [
        { icon: '⚡', text: '정확도 +30% Up', sub: '초정밀 스캔' },
        { icon: '🔄', text: '1분 내 갱신', sub: '실시간 추적' },
        { icon: '🗺️', text: '히트맵 제공', sub: '동선 시각화' }
    ];

    const monologueLines = [
        "…잠깐.",
        "휴대폰 기반 추적이라고?",
        "김하얀의 휴대폰은 방에 있었잖아!",
        "그럼 이 앱으로 위치를 찾을 필요 자체가 없어."
    ];

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsChecked(checked);

        if (!checked) {
            // Trigger sequence when unchecked
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                setMonologuePhase('active');
            }, 1500);
        } else {
            setMonologuePhase('none');
            setMonologueIndex(0);
        }
    };

    const handleMonologueClick = () => {
        if (monologueIndex < monologueLines.length - 1) {
            setMonologueIndex(prev => prev + 1);
        } else {
            setMonologuePhase('complete'); // End of monologue
        }
    };

    const handleMainLessButtonClick = () => {
        if (monologuePhase === 'complete') {
            onPurchaseClick('exit'); // Special exit code
        } else {
            onPurchaseClick('purchase');
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: '#0a0c14',
            color: '#fff',
            fontFamily: '"Manrope", "Noto Sans KR", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowY: 'auto'
        }}>
            {/* Background Gradients */}
            <div style={{
                position: 'fixed',
                top: '50%', left: '0', transform: 'translate(-50%, -50%)',
                width: '20rem', height: '20rem',
                background: 'rgba(19, 91, 236, 0.08)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '0', right: '0', transform: 'translate(25%, 25%)',
                width: '22rem', height: '22rem',
                background: 'rgba(0, 242, 255, 0.08)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none'
            }} />

            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', zIndex: 10
            }}>
                <button onClick={onBackClick} style={{ background: 'none', border: 'none', color: 'rgb(148, 163, 184)', cursor: 'pointer', padding: '8px' }}>
                    <span style={{ fontSize: '24px' }}>✕</span>
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.15em', color: '#135bec', textTransform: 'uppercase', textShadow: '0 0 10px rgba(19, 91, 236, 0.4)' }}>
                    PREMIUM UPGRADE
                </span>
                <div style={{ width: '24px' }}></div>
            </div>

            <div style={{
                flex: 1, padding: '0 1.5rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', maxWidth: '520px', margin: '0 auto', width: '100%', boxSizing: 'border-box'
            }}>
                {/* Visual Comparison Area */}
                <div style={{
                    position: 'relative', width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginBottom: '2rem'
                }}>
                    <div style={{
                        position: 'relative', display: 'flex', alignItems: 'center', gap: '1.5rem'
                    }}>
                        {/* Standard */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
                            <div style={{
                                width: '7.5rem', height: '7.5rem', borderRadius: '1.2rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)',
                                overflow: 'hidden', position: 'relative'
                            }}>
                                <img src="https://tile.openstreetmap.org/16/55797/25271.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(5px) grayscale(0.5)' }} />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '2rem', color: '#fff' }}>?</span>
                                </div>
                            </div>
                            <span style={{ marginTop: '0.6rem', fontSize: '11px', color: '#94a3b8' }}>Standard</span>
                        </div>

                        {/* Arrow */}
                        <div style={{ color: '#135bec', fontSize: '1.2rem', animation: 'pulse 2s infinite' }}>➜</div>

                        {/* Premium */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '9.5rem', height: '9.5rem', borderRadius: '1.5rem',
                                border: '3px solid #135bec', boxShadow: '0 0 40px rgba(19, 91, 236, 0.4)',
                                overflow: 'hidden', position: 'relative', background: '#000'
                            }}>
                                <img src="https://tile.openstreetmap.org/16/55797/25271.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.1) contrast(1.1)' }} />
                                <div style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: 'linear-gradient(135deg, #135bec, #3b82f6)',
                                    color: 'white', fontSize: '10px', fontWeight: '900',
                                    padding: '4px 10px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(19, 91, 236, 0.5)'
                                }}>PRO</div>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>📍</span>
                                </div>
                            </div>
                            <span style={{ marginTop: '0.8rem', fontSize: '13px', color: '#3b82f6', fontWeight: '800', letterSpacing: '0.05em' }}>PREMIUM HIGH-RES</span>
                        </div>
                    </div>
                </div>

                {/* Main Text */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontSize: '2rem', fontWeight: '800', marginBottom: '0.8rem',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>정밀 위치 확인하기</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        최첨단 GPS 보정 기술을 사용하여<br />오차 범위를 1m 이내로 단축합니다.
                    </p>
                </div>

                {/* Benefits List (Flashy) */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2.5rem', width: '100%'
                }}>
                    {benefits.map((benefit, i) => (
                        <div key={i} style={{
                            flex: 1, padding: '12px 6px',
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)', backdropFilter: 'blur(5px)'
                        }}>
                            <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{benefit.icon}</div>
                            <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>{benefit.text}</div>
                            <div style={{ color: '#64748b', fontSize: '0.65rem' }}>{benefit.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Pricing & CTA */}
                <div style={{ width: '100%', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {monologuePhase === 'complete' ? (
                        <button
                            onClick={handleMainLessButtonClick}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', // Red for exit
                                color: 'white', fontWeight: 'bold', padding: '1.4rem',
                                borderRadius: '1.2rem', border: 'none', fontSize: '1.1rem',
                                cursor: 'pointer', boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)',
                                transition: 'all 0.3s',
                                animation: 'pulse 2s infinite'
                            }}
                        >
                            [ 앱 종료하고 다른 단서 찾기 ]
                        </button>
                    ) : (
                        <>
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: '1.2rem', borderRadius: '1.2rem',
                                border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.03)'
                            }}>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>일회성 정밀 분석 비용</span>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>1,100원</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>/ 회</span>
                                </div>
                            </div>
                            <button
                                onClick={handleMainLessButtonClick}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #135bec 0%, #3b82f6 100%)',
                                    color: 'white', fontWeight: 'bold', padding: '1.4rem',
                                    borderRadius: '1.2rem', border: 'none', fontSize: '1.1rem',
                                    cursor: 'pointer', boxShadow: '0 10px 30px -5px rgba(19, 91, 236, 0.4)',
                                    transition: 'all 0.2s',
                                    opacity: isChecked ? 1 : 0.5,
                                    pointerEvents: isChecked ? 'auto' : 'none', // Prevent clicking "Purchase" when unchecked
                                    filter: isChecked ? 'none' : 'grayscale(1)'
                                }}
                            >
                                지금 확인하기
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Footer / Subscription Check - Dark Pattern */}
            <div style={{ padding: '1.5rem 2rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', maxWidth: '22rem', opacity: 0.6 }}>
                    {/* opacity-60 to make it look less important/active */}
                    <div style={{ marginTop: '0.2rem', position: 'relative', width: '18px', height: '18px' }}>
                        <input
                            type="checkbox"
                            id="subscription"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            style={{
                                appearance: 'none',
                                width: '100%', height: '100%',
                                border: '1px solid #555', borderRadius: '4px',
                                backgroundColor: isChecked ? '#2a2a2a' : 'transparent',
                                display: 'block',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        />
                        {isChecked && (
                            <span style={{
                                position: 'absolute', pointerEvents: 'none',
                                color: '#6b7280', // Subtle grey checkmark
                                fontSize: '14px', fontWeight: 'bold',
                                top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                            }}>✓</span>
                        )}
                    </div>
                    <label htmlFor="subscription" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', userSelect: 'none' }}>
                        <span style={{ fontSize: '12px', color: '#777', lineHeight: '1.3', fontWeight: '600' }}>
                            디지털 footprint 서비스 가입 (월 55,000원)
                        </span>
                        <span style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>
                            첫 2시간 무료, 이후 자동 결제
                        </span>
                    </label>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', opacity: 0.3 }}>
                    <button style={{ background: 'none', border: 'none', fontSize: '10px', color: '#64748b', textDecoration: 'underline' }}>Terms of Service</button>
                    <button style={{ background: 'none', border: 'none', fontSize: '10px', color: '#64748b', textDecoration: 'underline' }}>Privacy Policy</button>
                </div>

                <div style={{ marginTop: '1.5rem', fontSize: '10px', color: '#334', textAlign: 'center' }}>
                    본 서비스는 <strong>연결된 휴대폰 신호 기반 추적</strong>만 제공합니다.
                </div>
            </div>

            {/* Toast Message */}
            {showToast && (
                <div style={{
                    position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(255, 50, 50, 0.9)', color: 'white', padding: '12px 24px',
                    borderRadius: '50px', fontSize: '0.9rem', fontWeight: 'bold',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.4)', zIndex: 100,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    ⚠️ 일부 기능이 제한될 수 있습니다.
                </div>
            )}

            {/* Monologue Overlay - Portal to Body for "Outside Tablet" look */}
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
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#BF5AF2', letterSpacing: '2px', fontWeight: 'bold' }}>DIGITAL INVESTIGATION // TABLET_ANALYSIS</span>
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
                        {monologueIndex < monologueLines.length - 1 ? 'NEXT' : 'DECIDE'} <span style={{ fontSize: '1.0rem' }}>▼</span>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    70% { transform: scale(1.02); box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
};

export default TabletUpgrade;
