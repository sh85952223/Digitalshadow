import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import characterImage from '../assets/instructor.png';

const TabletHome = ({ onOpenApp, onReturnToRoom, initialApp }) => {
    const [showInstructor, setShowInstructor] = useState(false);
    const [openApp, setOpenApp] = useState(null); // 'notes' or null
    const [showReturnDialogue, setShowReturnDialogue] = useState(false);

    const yellowTheme = {
        primary: '#fbbf24',
        bg: 'rgba(20, 15, 5, 0.9)',
        border: 'rgba(251, 191, 36, 0.5)',
        glow: 'rgba(251, 191, 36, 0.3)'
    };

    useEffect(() => {
        if (initialApp) {
            setOpenApp(initialApp);
        }
        // Show instructor after a brief delay only if no initial app
        if (!initialApp) {
            const timer = setTimeout(() => setShowInstructor(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [initialApp]);

    const handleAppClick = (appName) => {
        if (appName === 'Notes') {
            setOpenApp('notes');
        }
    };

    const handleCloseApp = () => {
        setOpenApp(null);
    };

    const handleReturnHome = () => {
        setOpenApp(null);
        setTimeout(() => setShowReturnDialogue(true), 500);
    };

    return (
        <div style={{
            width: '100%', height: '100%',
            background: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat', // Abstract dark gradient
            position: 'relative',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Status Bar */}
            <div style={{
                height: '24px', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                color: '#fff', fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(5px)'
            }}>
                <span>9:41</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <span>🔋 85%</span>
                </div>
            </div>

            {/* App Grid */}
            <div style={{
                padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px',
                justifyItems: 'center'
            }}>
                {/* Apps - Only Notes is interactive */}
                <div
                    onClick={() => handleAppClick('Notes')}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        cursor: 'pointer', transition: 'transform 0.2s', opacity: 1, transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    <div style={{
                        width: '64px', height: '64px',
                        borderRadius: '16px',
                        background: 'linear-gradient(to bottom, #fdd835 25%, #fff 25%)',
                        position: 'relative', overflow: 'hidden',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(0,0,0,0.1)'
                    }}>
                        {/* Note Lines */}
                        <div style={{ position: 'absolute', top: '30%', left: '10%', right: '10%', height: '2px', background: '#e5e7eb' }}></div>
                        <div style={{ position: 'absolute', top: '45%', left: '10%', right: '10%', height: '2px', background: '#e5e7eb' }}></div>
                        <div style={{ position: 'absolute', top: '60%', left: '10%', right: '10%', height: '2px', background: '#e5e7eb' }}></div>
                        {/* Visual "Text" hint */}
                    </div>
                    <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>메모</span>
                </div>

                <AppIcon name="사진" icon="🖼️" color="#3b82f6" />
                <AppIcon name="설정" icon="⚙️" color="#94a3b8" />
                <AppIcon name="메일" icon="✉️" color="#ef4444" />
                <AppIcon name="파일" icon="📁" color="#0ea5e9" />
                <AppIcon name="인터넷" icon="🌍" color="#3b82f6" />
            </div>

            {/* Dock */}
            <div style={{
                position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(20px)',
                borderRadius: '24px', padding: '15px 25px', display: 'flex', gap: '25px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <AppIcon name="전화" icon="📞" color="#22c55e" dock />
                <AppIcon name="메시지" icon="💬" color="#22c55e" dock />
                <AppIcon name="음악" icon="🎵" color="#ef4444" dock />
            </div>

            {/* Instructor Dialogue Overlay (Portal) */}
            {showInstructor && !openApp && !showReturnDialogue && createPortal(
                <div style={{
                    position: 'fixed', inset: 0,
                    zIndex: 9999, // Highest priority
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    pointerEvents: 'none' // Allow clicking through to apps
                }}>
                    {/* Character - Clickable/Pass-through issue resolved by pointerEvents: none on container, auto on children if needed */}
                    <img
                        src={characterImage}
                        alt="Instructor"
                        style={{
                            position: 'absolute', bottom: 0, left: '5%', height: '55%', objectFit: 'contain',
                            filter: 'drop-shadow(10px 0 30px rgba(0,0,0,0.6))', zIndex: 10001,
                            animation: 'slideRight 0.5s ease-out'
                        }}
                    />

                    {/* Dialogue Box */}
                    <div style={{
                        width: '80%', maxWidth: '800px', marginBottom: '50px', zIndex: 10002,
                        background: 'rgba(2, 6, 23, 0.9)',
                        border: '2px solid rgba(33, 150, 243, 0.5)',
                        boxShadow: '0 0 50px rgba(33, 150, 243, 0.3), inset 0 0 60px rgba(13, 71, 161, 0.2)',
                        backdropFilter: 'blur(12px)', borderRadius: '4px', overflow: 'hidden',
                        pointerEvents: 'auto'
                    }}>
                        {/* Tech Header */}
                        <div style={{
                            height: '36px', background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.15) 0%, transparent 100%)',
                            borderBottom: '1px solid rgba(33, 150, 243, 0.5)', display: 'flex', alignItems: 'center', paddingLeft: '24px'
                        }}>
                            <div style={{ width: '8px', height: '8px', background: '#4fc3f7', borderRadius: '50%', boxShadow: '0 0 5px #4fc3f7', marginRight: '10px' }} />
                            <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#4fc3f7', letterSpacing: '2px' }}>INTERVENTION // INSTRUCTOR</span>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '30px 40px', color: '#fff' }}>
                            <div style={{
                                display: 'inline-block', background: 'rgba(13, 71, 161, 0.3)', padding: '6px 16px',
                                borderLeft: '4px solid #4fc3f7', marginBottom: '20px', fontSize: '1.4rem', fontWeight: 'bold'
                            }}>
                                교관
                            </div>
                            <p style={{ lineHeight: '1.7', fontSize: '1.2rem', marginBottom: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                "고생했네. 하지만 아직 끝나지 않았어.<br />
                                <strong>[메모]</strong> 앱을 확인해보게. 누군가 남긴 흔적이 있을걸세."
                            </p>
                            <button
                                onClick={() => setShowInstructor(false)}
                                style={{
                                    background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #4fc3f7',
                                    padding: '10px 24px', borderRadius: '4px', color: '#4fc3f7',
                                    cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                                    display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto',
                                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.1)'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.3)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.1)'; }}
                            >
                                확인 ▶
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Return to Home Dialogue (Yellow Theme) */}
            {showReturnDialogue && createPortal(
                <div onClick={onReturnToRoom} style={{
                    position: 'fixed', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                    width: '70%', maxWidth: '1000px', minHeight: '200px', background: yellowTheme.bg,
                    border: `1px solid ${yellowTheme.border}`, boxShadow: `0 0 30px ${yellowTheme.glow}`,
                    backdropFilter: 'blur(16px)', clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                    zIndex: 10003, cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: '0'
                }}>
                    <div style={{ width: '100%', height: '35px', background: `linear-gradient(90deg, rgba(251, 191, 36, 0.15) 0%, transparent 100%)`, borderBottom: `1px solid ${yellowTheme.border}`, display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                        <div style={{ width: '8px', height: '8px', background: yellowTheme.primary, marginRight: '15px', borderRadius: '50%', boxShadow: `0 0 8px ${yellowTheme.primary}` }}></div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: yellowTheme.primary, letterSpacing: '2px', fontWeight: 'bold' }}>PERSONAL LOG // RECOVERY</span>
                    </div>
                    <div style={{ padding: '2rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(251, 191, 36, 0.15)', padding: '0.4rem 1.5rem', borderLeft: `4px solid ${yellowTheme.primary}`, marginBottom: '1.2rem', width: 'fit-content' }}>
                            <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.05em' }}>나</span>
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.6rem', lineHeight: '1.6', margin: 0, fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            다시 A의 방으로 돌아가자. A가 어딘가에 휴대폰 암호에 대한 힌트를 숨겨놓은거야.
                        </p>
                    </div>
                    <div style={{ position: 'absolute', bottom: '20px', right: '30px', color: yellowTheme.primary, fontSize: '1.2rem', fontWeight: 'bold', animation: 'bounce 1s infinite', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        RETURN TO ROOM <span style={{ fontSize: '1.0rem' }}>▼</span>
                    </div>
                </div>,
                document.body
            )}

            {/* Notes App Modal - Dark Mode iOS Style */}
            {openApp === 'notes' && (
                <div style={{
                    position: 'absolute', inset: 0, background: '#000', zIndex: 50,
                    animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex', flexDirection: 'column'
                }}>
                    {/* Top Status Bar Placeholder (Tablet-like) */}
                    <div style={{ height: '24px' }}></div>

                    {/* Navigation Bar */}
                    <div style={{
                        height: '44px', display: 'flex', alignItems: 'center', padding: '0 16px',
                        justifyContent: 'space-between'
                    }}>
                        <button onClick={handleCloseApp} style={{
                            background: 'none', border: 'none', color: '#fbbf24', fontSize: '1.1rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                        }}>
                            <span style={{ fontSize: '1.4rem' }}>‹</span> 모든 iCloud
                        </button>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <span style={{ color: '#fbbf24', fontSize: '1.2rem', cursor: 'pointer' }}>↩</span>
                            <span style={{ color: '#fbbf24', fontSize: '1.2rem', cursor: 'pointer' }}>↪</span>

                            <span style={{ color: '#fbbf24', fontSize: '1.2rem', cursor: 'pointer', border: '1px solid #fbbf24', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem' }}>•••</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>진실의 파편</h1>
                        <div style={{
                            fontSize: '1.1rem', lineHeight: '1.6', color: '#fff',
                            opacity: 0.9, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
                        }}>
                            진실은 보이는 것이 아니라,<br />
                            비쳐진 것의 뒤에 숨어 있다.<br /><br />

                            한때 깨져 조각났던 진실은<br />
                            다시 바라보는 순간, 스스로 형태를 되찾는다.<br /><br />

                            나는 그 뒤에,<br />
                            반쪽짜리 진실을 남겨 두었다.<br /><br />

                            이를 찾아서 다시 비추었을 때<br />
                            휴대폰 안에서 나의 흔적을 찾을 수 있을거야.<br /><br />

                            그게 누구든 도와주세요....
                        </div>

                        {/* Home Button */}
                        <div style={{ marginTop: 'auto', paddingTop: '40px', paddingBottom: '40px', display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={handleReturnHome}
                                style={{
                                    background: '#333', color: '#fbbf24', border: '1px solid #fbbf24',
                                    padding: '12px 30px', borderRadius: '25px', fontSize: '1rem',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)', transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#fbbf24'; e.currentTarget.style.color = '#000'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = '#333'; e.currentTarget.style.color = '#fbbf24'; }}
                            >
                                홈으로 돌아가기 🏠
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

const AppIcon = ({ name, icon, color, onClick, interactive = false, dock = false }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'transform 0.2s',
            opacity: interactive ? 1 : 0.7,
            transform: 'scale(1)'
        }}
        onMouseEnter={(e) => { if (interactive) e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { if (interactive) e.currentTarget.style.transform = 'scale(1)'; }}
    >
        <div style={{
            width: dock ? '50px' : '64px', height: dock ? '50px' : '64px',
            borderRadius: '16px', background: color,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontSize: dock ? '1.8rem' : '2.2rem', color: '#fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}>
            {icon}
        </div>
        {!dock && <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{name}</span>}
    </div>
);

export default TabletHome;
