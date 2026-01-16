import React, { useState, useEffect } from 'react';

const DialLockPopup = ({ onClose, onSolved, purpleTheme }) => {
    const [dialValues, setDialValues] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [rotationAngles, setRotationAngles] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [dragging, setDragging] = useState({ active: false, index: null, startY: 0 });

    const correctCode = [3, 2, 4, 2, 5, 1, 6, 1];

    const handleDialChange = (index, direction) => {
        setDialValues(prev => {
            const newVals = [...prev];
            newVals[index] = (newVals[index] + direction + 10) % 10;
            return newVals;
        });
        setRotationAngles(prev => {
            const newAngles = [...prev];
            newAngles[index] = prev[index] + (direction * 36);
            return newAngles;
        });
    };

    const handleDialMouseDown = (index, e) => {
        e.preventDefault();
        setDragging({ active: true, index, startY: e.clientY });
    };

    const handleDialMouseMove = (e) => {
        if (!dragging.active) return;
        const deltaY = dragging.startY - e.clientY;
        const threshold = 30;
        if (Math.abs(deltaY) >= threshold) {
            const direction = deltaY > 0 ? -1 : 1;
            handleDialChange(dragging.index, direction);
            setDragging(prev => ({ ...prev, startY: e.clientY }));
        }
    };

    const handleDialMouseUp = () => {
        setDragging({ active: false, index: null, startY: 0 });
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleDialMouseMove);
        window.addEventListener('mouseup', handleDialMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleDialMouseMove);
            window.removeEventListener('mouseup', handleDialMouseUp);
        };
    }, [dragging.active, dragging.index, dragging.startY]);

    const checkCode = () => {
        const isCorrect = dialValues.every((val, idx) => val === correctCode[idx]);
        if (isCorrect) {
            onSolved();
        }
    };

    const isCorrect = dialValues.every((val, idx) => val === correctCode[idx]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 200, flexDirection: 'column'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #101015 0%, #1a1a20 100%)',
                padding: '60px 80px', borderRadius: '40px',
                boxShadow: `0 40px 100px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.1), 0 0 0 1px ${purpleTheme.border}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'
            }}>
                {/* Decorative Scanner Line */}
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '200px', height: '4px', background: purpleTheme.primary,
                    boxShadow: `0 0 20px ${purpleTheme.primary}`
                }}></div>

                <h2 style={{
                    color: '#e0e0e0', marginBottom: '50px',
                    fontFamily: '"Share Tech Mono", monospace',
                    letterSpacing: '5px', fontSize: '1.8rem',
                    textShadow: `0 0 10px rgba(255,255,255,0.1)`
                }}>SECURITY PASSCODE</h2>

                {/* Dials Container */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '50px', padding: '15px' }}>
                    {dialValues.map((val, idx) => {
                        const angle = rotationAngles[idx];
                        return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => handleDialChange(idx, 1)}
                                    style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem', padding: '5px', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#555'}
                                >▲</button>

                                <div
                                    onMouseDown={(e) => handleDialMouseDown(idx, e)}
                                    style={{
                                        width: '60px', height: '80px', perspective: '1000px', position: 'relative',
                                        cursor: dragging.active && dragging.index === idx ? 'grabbing' : 'grab', userSelect: 'none'
                                    }}>
                                    <div style={{
                                        width: '100%', height: '100%', position: 'absolute',
                                        transformStyle: 'preserve-3d', transform: `rotateX(${angle * -1}deg)`,
                                        transition: 'transform 0.6s cubic-bezier(0.19, 1.0, 0.22, 1.0)'
                                    }}>
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                            <div key={num} style={{
                                                position: 'absolute', width: '60px', height: '80px',
                                                background: 'linear-gradient(180deg, #b0b0b0 0%, #f0f0f0 50%, #b0b0b0 100%)',
                                                color: '#1a1a1a', fontSize: '3rem', fontWeight: '800', fontFamily: 'sans-serif',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                backfaceVisibility: 'hidden', border: '1px solid #999', boxSizing: 'border-box',
                                                transform: `rotateX(${num * 36}deg) translateZ(123px)`
                                            }}>{num}</div>
                                        ))}
                                    </div>
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)',
                                        pointerEvents: 'none', zIndex: 10, borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)'
                                    }}></div>
                                    <div style={{
                                        position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px',
                                        background: 'rgba(255,255,255,0.3)', transform: 'translateY(-50%)', zIndex: 11, pointerEvents: 'none'
                                    }}></div>
                                </div>

                                <button
                                    onClick={() => handleDialChange(idx, -1)}
                                    style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem', padding: '5px', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#555'}
                                >▼</button>
                            </div>
                        );
                    })}
                </div>

                {/* Unlock Button */}
                <button
                    onClick={() => { if (isCorrect) checkCode(); }}
                    style={{
                        width: '100%', padding: '18px',
                        background: isCorrect ? `linear-gradient(90deg, ${purpleTheme.primary}, #fff)` : '#333',
                        color: isCorrect ? '#000' : '#888',
                        fontSize: '1.2rem', fontWeight: '900', letterSpacing: '3px', border: 'none', borderRadius: '50px',
                        boxShadow: isCorrect ? `0 0 30px ${purpleTheme.primary}, inset 0 2px 5px rgba(255,255,255,0.5)` : 'inset 0 2px 5px rgba(0,0,0,0.5)',
                        cursor: isCorrect ? 'pointer' : 'not-allowed',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transform: isCorrect ? 'scale(1.05)' : 'scale(1)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                    }}
                >
                    {isCorrect ? (<><span>🔓</span> ACCESS GRANTED</>) : (<><span>🔒</span> ACCESS DENIED</>)}
                </button>
            </div>

            {/* Hint Text */}
            <p style={{
                marginTop: '40px', color: 'rgba(255,255,255,0.7)', fontSize: '1.4rem',
                fontStyle: 'italic', textAlign: 'center', textShadow: '0 0 10px rgba(255,255,255,0.2)'
            }}>"A의 메모: 진실은 읽지 않은 약속에 있었다...방 안을 살펴보자"</p>

            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    marginTop: '1px', background: 'transparent', color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.3)', padding: '12px 30px', borderRadius: '8px',
                    fontSize: '1rem', cursor: 'pointer', letterSpacing: '1px', transition: 'all 0.3s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >다시 방 살펴보기</button>
        </div>
    );
};

export default DialLockPopup;
