import React, { useState, useEffect } from 'react';
import phoneBg from '../assets/phone_on_desk.png';

const PhoneAuth = ({ onComplete, onReturnToMirror }) => {
    const [passcode, setPasscode] = useState('');
    const [isWrong, setIsWrong] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [view, setView] = useState('lock'); // 'lock', 'entry'
    const [shake, setShake] = useState(false);

    const handleKeyClick = (key) => {
        if (passcode.length < 4) {
            setPasscode(prev => prev + key);
        }
    };

    const handleDelete = () => {
        setPasscode(prev => prev.slice(0, -1));
    };

    useEffect(() => {
        if (passcode.length === 4) {
            if (passcode.toUpperCase() === 'HIDE') {
                setIsSuccess(true);
                setTimeout(() => {
                    onComplete();
                }, 1000);
            } else {
                setShake(true);
                setTimeout(() => {
                    setShake(false);
                    setPasscode('');
                    setIsWrong(true);
                    // Feedback to user
                    setTimeout(() => {
                        setIsWrong(false);
                        onReturnToMirror();
                    }, 2000);
                }, 500);
            }
        }
    }, [passcode, onComplete, onReturnToMirror]);

    // Format current time
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 10000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateString = time.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

    // QWERTY Layout
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 30000,
            backgroundImage: `url(${phoneBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Dark Overlay with Blur */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: view === 'entry' ? 'blur(40px) brightness(0.6)' : 'none',
                transition: 'backdrop-filter 0.5s ease, background-color 0.5s ease',
                zIndex: 1
            }}></div>

            {/* Lock Screen View */}
            {view === 'lock' && (
                <div
                    onClick={() => setView('entry')}
                    style={{
                        zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
                        width: '100%', height: '100%', cursor: 'pointer',
                        paddingTop: '15%'
                    }}
                >
                    <div style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '10px', opacity: 0.9 }}>
                        🔒 잠금됨
                    </div>
                    <div style={{ fontSize: '5rem', fontWeight: '200', marginBottom: '5px' }}>{timeString}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '400' }}>{dateString}</div>

                    <div style={{ position: 'absolute', bottom: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }}></div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '400', opacity: 0.8, animation: 'pulse 2s infinite' }}>위로 쓸어서 열기</div>
                    </div>
                </div>
            )}

            {/* Entry Screen View */}
            {view === 'entry' && (
                <div style={{
                    zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    width: '100%', height: '100%', paddingTop: '15%',
                    animation: 'slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '500', marginBottom: '40px', textAlign: 'center' }}>
                        {isWrong ? '다시 한 번 거울을 보고 와봐.' : '암호 입력'}
                    </h2>

                    {/* Indicators */}
                    <div style={{
                        display: 'flex', gap: '22px', marginBottom: '60px',
                        transform: shake ? 'translateX(10px)' : 'none',
                        transition: 'transform 0.1s'
                    }}>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} style={{
                                width: '13px', height: '13px', borderRadius: '50%',
                                border: '1.5px solid #fff',
                                backgroundColor: passcode.length > i ? '#fff' : 'transparent',
                                transition: 'background-color 0.2s'
                            }}></div>
                        ))}
                    </div>

                    {/* QWERTY Keyboard */}
                    <div style={{
                        marginTop: 'auto', marginBottom: '10%', width: '100%', padding: '0 5px',
                        display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'
                    }}>
                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex} style={{
                                display: 'flex', gap: '6px',
                                width: '100%', justifyContent: 'center',
                                padding: rowIndex === 1 ? '0 15px' : '0'
                            }}>
                                {row.map(char => (
                                    <button
                                        key={char}
                                        onClick={() => handleKeyClick(char)}
                                        style={{
                                            flex: 1, maxWidth: '40px', height: '52px',
                                            borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.15)',
                                            border: 'none', color: '#fff', fontSize: '1.4rem',
                                            fontWeight: '400', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'background-color 0.1s',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                                        }}
                                        onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)'}
                                        onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                                    >
                                        {char}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Bottom Controls */}
                    <div style={{
                        position: 'absolute', bottom: '5%', width: '100%', maxWidth: '340px',
                        display: 'flex', justifyContent: 'space-between', padding: '0 25px',
                        fontSize: '1.05rem', fontWeight: '400'
                    }}>
                        <div style={{ cursor: 'pointer', color: '#fff' }}>긴급 내용</div>
                        <div
                            style={{ cursor: 'pointer', color: '#fff' }}
                            onClick={passcode.length > 0 ? handleDelete : () => setView('lock')}
                        >
                            {passcode.length > 0 ? '지우기' : '취소'}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 0.3; }
                }
                @keyframes slideUp {
                    from { transform: translateY(100vh); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-10px); }
                    40%, 80% { transform: translateX(10px); }
                }
            `}</style>
        </div>
    );
};

export default PhoneAuth;
