import React, { useState } from 'react';

const TabletUpgrade = ({ onBackClick, onPurchaseClick }) => {
    const [isChecked, setIsChecked] = useState(true);

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
                top: '50%',
                left: '0',
                transform: 'translate(-50%, -50%)',
                width: '16rem',
                height: '16rem',
                background: 'rgba(19, 91, 236, 0.05)',
                borderRadius: '50%',
                filter: 'blur(100px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '0',
                right: '0',
                transform: 'translate(25%, 25%)',
                width: '20rem',
                height: '20rem',
                background: 'rgba(0, 242, 255, 0.05)',
                borderRadius: '50%',
                filter: 'blur(120px)',
                pointerEvents: 'none'
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                zIndex: 10
            }}>
                <button
                    onClick={onBackClick}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgb(148, 163, 184)',
                        cursor: 'pointer',
                        padding: '8px'
                    }}
                >
                    <span style={{ fontSize: '24px' }}>✕</span>
                </button>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    color: '#135bec',
                    textTransform: 'uppercase'
                }}>Premium Upgrade</span>
                <div style={{ width: '24px' }}></div>
            </div>

            <div style={{
                flex: 1,
                padding: '0 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '480px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                {/* Visual Comparison Area */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(19, 91, 236, 0.1), transparent)',
                        borderRadius: '1.5rem'
                    }} />

                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        {/* Standard (Blurred) */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '7rem',
                                height: '7rem',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <img
                                    src="https://tile.openstreetmap.org/16/55797/25271.png"
                                    alt="Blurred Map"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        filter: 'blur(4px)',
                                        opacity: 0.6
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '1.8rem', color: 'rgb(148, 163, 184)' }}>?</span>
                                </div>
                            </div>
                            <span style={{ marginTop: '0.5rem', fontSize: '12px', color: 'rgb(100, 116, 139)', fontWeight: '500' }}>Standard</span>
                        </div>

                        {/* Arrow */}
                        <div style={{
                            zIndex: 10,
                            background: '#135bec',
                            borderRadius: '50%',
                            padding: '0.25rem',
                            boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '14px', color: '#fff' }}>➝</span>
                        </div>

                        {/* Premium (Clear) */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '9rem',
                                height: '9rem',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                border: '2px solid #135bec',
                                boxShadow: '0 0 30px rgba(19,91,236,0.3)'
                            }}>
                                <img
                                    src="https://tile.openstreetmap.org/16/55797/25271.png"
                                    alt="Clear Map"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        filter: 'brightness(1.1)'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    background: '#135bec',
                                    color: 'white',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                    PRO
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '2.5rem' }}>📍</span>
                                </div>
                            </div>
                            <span style={{ marginTop: '0.5rem', fontSize: '12px', color: '#135bec', fontWeight: 'bold' }}>Premium High-Res</span>
                        </div>
                    </div>
                </div>

                {/* Main Text */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.025em'
                    }}>정밀 위치 확인하기</h1>
                    <p style={{
                        color: 'rgb(148, 163, 184)',
                        fontSize: '0.875rem',
                        lineHeight: '1.6',
                        maxWidth: '280px',
                        margin: '0 auto'
                    }}>
                        최첨단 GPS 보정 기술을 사용하여<br />오차 범위를 1m 이내로 단축합니다.
                    </p>
                </div>

                {/* Benefits List (Compact) */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '2rem',
                    width: '100%',
                    justifyContent: 'center'
                }}>
                    {['정확도 +30% Up', '1분 내 갱신', '히트맵 제공'].map((benefit, i) => (
                        <div key={i} style={{
                            padding: '6px 12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: '#e2e8f0'
                        }}>
                            ✓ {benefit}
                        </div>
                    ))}
                </div>

                {/* Pricing & CTA */}
                <div style={{ width: '100%', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        borderRadius: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        background: 'rgba(255, 255, 255, 0.05)'
                    }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgb(100, 116, 139)', marginBottom: '0.25rem' }}>일회성 정밀 분석 비용</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>1,100원</span>
                            <span style={{ color: 'rgb(148, 163, 184)', fontSize: '0.875rem' }}>/ 회</span>
                        </div>
                    </div>

                    <button
                        onClick={onPurchaseClick}
                        style={{
                            width: '100%',
                            background: '#135bec',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '1.25rem',
                            borderRadius: '1rem',
                            border: 'none',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.2)',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => e.target.style.background = '#2563eb'}
                        onMouseOut={(e) => e.target.style.background = '#135bec'}
                    >
                        지금 확인하기
                    </button>
                </div>
            </div>

            {/* Footer / Subscription Check */}
            <div style={{ padding: '1.5rem 2rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', maxWidth: '20rem' }}>
                    <div style={{ marginTop: '0.125rem' }}>
                        <input
                            type="checkbox"
                            id="subscription"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            style={{
                                appearance: 'none',
                                width: '16px',
                                height: '16px',
                                border: '1px solid #333',
                                borderRadius: '3px',
                                backgroundColor: isChecked ? '#fff' : 'transparent',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        />
                        {isChecked && (
                            <span style={{
                                position: 'absolute',
                                marginLeft: '-13px',
                                marginTop: '1px',
                                pointerEvents: 'none',
                                color: '#000',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>✓</span>
                        )}
                    </div>
                    <label htmlFor="subscription" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', userSelect: 'none' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.2' }}>
                            디지털 footprint 서비스 가입 (월 55,000원)
                        </span>
                        <span style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                            첫 2시간 무료, 이후 자동 결제
                        </span>
                    </label>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', opacity: 0.2 }}>
                    <button style={{ background: 'none', border: 'none', fontSize: '10px', color: 'rgb(100, 116, 139)', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</button>
                    <button style={{ background: 'none', border: 'none', fontSize: '10px', color: 'rgb(100, 116, 139)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</button>
                </div>

                <div style={{ marginTop: '2rem', fontSize: '9px', color: '#334', textAlign: 'center' }}>
                    본 서비스는 연결된 휴대폰 신호 기반 추적만 제공합니다.
                </div>
            </div>
        </div>
    );
};

export default TabletUpgrade;
