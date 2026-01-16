import React, { useState } from 'react';
import { BadgeCheck, Lock } from 'lucide-react';

const AuthCard = ({ onAuthenticate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [scanned, setScanned] = useState(false);

    const handleInteraction = () => {
        // Simulate biometric scan or ID reading
        setScanned(true);
        setTimeout(() => {
            onAuthenticate();
        }, 1500);
    };

    return (
        <>
            <style>{`
        @keyframes modalEnter { 
            0% { opacity: 0; transform: translate(-50%, -40%) scale(0.9); filter: blur(10px); } 
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); } 
        }
        @keyframes pulseRing { 
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 255, 157, 0.7); } 
            70% { transform: scale(1.15); box-shadow: 0 0 0 10px rgba(0, 255, 157, 0); } 
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 255, 157, 0); } 
        }
      `}</style>
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100,
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 255, 0.1) inset',
                    width: '380px',
                    cursor: 'default',
                    animation: 'modalEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative gloss reflection */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 100%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '90px', height: '90px', borderRadius: '50%',
                        background: scanned ? 'linear-gradient(135deg, #00b09b, #96c93d)' : 'rgba(30, 30, 30, 0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: scanned ? '0 0 30px rgba(0, 255, 157, 0.4)' : 'none'
                    }}>
                        {scanned ? <BadgeCheck size={48} color="#fff" /> : <Lock size={40} color="rgba(255,255,255,0.5)" />}
                    </div>

                    {!scanned && (
                        <div style={{
                            position: 'absolute', top: '-8px', left: '-8px', right: '-8px', bottom: '-8px',
                            border: '2px solid rgba(0, 255, 255, 0.3)', borderRadius: '50%',
                            animation: 'pulseRing 2.5s infinite'
                        }} />
                    )}
                </div>

                <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <h2 style={{
                        fontSize: '2.2rem', fontWeight: '800', color: '#fff', margin: '0 0 0.75rem 0',
                        letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                        {scanned ? '접속 승인' : '신원 확인'}
                    </h2>
                    <p style={{
                        fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', margin: 0,
                        fontWeight: '500', letterSpacing: '-0.01em', lineHeight: '1.5'
                    }}>
                        {scanned ? '요원님, 환영합니다.' : 'Digital 수사 본부 보안 프로토콜'}
                    </p>
                </div>

                {!scanned && (
                    <button
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleInteraction}
                        style={{
                            background: isHovered ? 'rgba(0, 255, 157, 1)' : 'rgba(255, 255, 255, 0.08)',
                            color: isHovered ? '#000' : '#fff',
                            border: isHovered ? '1px solid #00ff9d' : '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '1.2rem 3.5rem',
                            borderRadius: '16px',
                            cursor: 'none', /* IMPORTANT: keep cursor none so our digital cursor works */
                            fontWeight: '700',
                            transition: 'all 0.3s ease',
                            textTransform: 'none',
                            letterSpacing: '-0.01em',
                            fontSize: '1.35rem',
                            backdropFilter: 'blur(4px)',
                            width: '100%',
                            boxShadow: isHovered ? '0 0 20px rgba(0, 255, 157, 0.5)' : '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                    >
                        ID 인증하기
                    </button>
                )}
            </div>
        </>
    );
};

export default AuthCard;
