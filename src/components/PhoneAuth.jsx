import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import phoneBg from '../assets/phone_on_desk.png';

const PhoneAuth = ({ onComplete, onReturnToMirror }) => {
    // State management
    const [view, setView] = useState('lock'); // lock, entry, home
    const [passcode, setPasscode] = useState('');
    const [isWrong, setIsWrong] = useState(false);
    const [shake, setShake] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Dialogue & Interaction State
    const [dialogue, setDialogue] = useState({ show: false, text: '', onComplete: null });
    const [gachaUnlocked, setGachaUnlocked] = useState(false);
    const [appOpen, setAppOpen] = useState(false);
    const [appTab, setAppTab] = useState('main'); // main, log, prob, notice
    const [noticeOpen, setNoticeOpen] = useState(false);
    const [mapOpen, setMapOpen] = useState(false); // Map App State

    // Investigation State: 0:Init, 1:App, 2:NoticeRead, 3:MapUnlocked, 4:FoundPCBang, 5:Insight, 6:Done
    const [investigationStep, setInvestigationStep] = useState(0);

    // Visual Cue State
    const [visitedTabs, setVisitedTabs] = useState({ log: false, prob: false, notice: false });
    const [noticeRead, setNoticeRead] = useState(false);

    // Update time
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 10000);
        return () => clearInterval(timer);
    }, []);

    const timeString = "22:31";
    const dateString = currentTime.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

    // Theme for Dialogue (Exactly matching ARoomRecovered)
    const purpleTheme = {
        primary: '#BF5AF2',
        bg: 'rgba(15, 5, 25, 0.8)',
        border: 'rgba(191, 90, 242, 0.5)',
        glow: 'rgba(191, 90, 242, 0.3)'
    };

    // Initial Dialogue Trigger
    useEffect(() => {
        if (view === 'home' && !gachaUnlocked && !appOpen && investigationStep === 0) {
            const timer = setTimeout(() => {
                setDialogue({
                    show: true,
                    text: "저게 A가 하던 가챠 킹덤이라는 게임이군.",
                    onComplete: () => {
                        setGachaUnlocked(true);
                        setInvestigationStep(1);
                    }
                });
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [view, gachaUnlocked, appOpen, investigationStep]);

    // App Open Dialogue Trigger
    useEffect(() => {
        if (appOpen && investigationStep === 1) {
            setAppTab('main');
            setNoticeOpen(false);
            const timer = setTimeout(() => {
                setDialogue({
                    show: true,
                    text: "이게 그 '가챠 킹덤'이구나. 메인 화면엔 화려한 성공 사례만 가득해. 실패할 거란 생각은 전혀 들지 않게 만들어놨네.",
                    onComplete: null
                });
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [appOpen, investigationStep]);

    // Step 2 Post-Notice Trigger
    useEffect(() => {
        if (investigationStep === 2 && noticeOpen) {
            const timer = setTimeout(() => {
                setDialogue({
                    show: true,
                    text: "사전 공지를 하긴 했지만... 당일에 공지하고 당일에 적용하다니. 사용자를 기만하는 운영방식에 가까워.",
                    onComplete: () => {
                        setTimeout(() => {
                            setDialogue({
                                show: true,
                                text: "PC라도 가능하니 왠지 게임은 계속 접속해볼 것 같은데... PC방을 찾아봐야겠어.",
                                onComplete: () => {
                                    setNoticeOpen(false);
                                    setAppOpen(false);
                                    setInvestigationStep(3); // Map Unlocked
                                }
                            });
                        }, 300);
                    }
                });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [investigationStep, noticeOpen]);

    const handleKey_click = (val) => {
        if (passcode.length < 4) {
            const next = passcode + val;
            setPasscode(next);
            if (next.length === 4) {
                if (next.toUpperCase() === 'HIDE') { // Success
                    setShake(true); // Simple feedback
                    setTimeout(() => {
                        setPasscode('');
                        setShake(false);
                        setView('home');
                    }, 400);
                } else { // Failure
                    setShake(true);
                    setTimeout(() => {
                        setShake(false);
                        setPasscode('');
                        setIsWrong(true);
                        setTimeout(() => {
                            setIsWrong(false);
                            onReturnToMirror();
                        }, 1500);
                    }, 400);
                }
            }
        }
    };

    const handleDialogueClick = () => {
        if (dialogue.onComplete) dialogue.onComplete();
        setDialogue({ ...dialogue, show: false });
    };

    const playInsightSequence = () => {
        const insights = [
            "너의 잘못만은 아니야. 시스템이 그렇게 설계되어 있었을 뿐이지.",
            "이건 '다크 패턴'이야. 사용자의 착각이나 실수를 유도해서 이익을 챙기는 기만적인 디자인이지.",
            "하지만 그렇다고 해서 선택의 책임이 아예 없는 건 아니야. 이 함정을 꿰뚫어보는 눈을 가져야 해."
        ];

        let currentIdx = 0;

        const showNext = () => {
            if (currentIdx < insights.length) {
                setDialogue({
                    show: true,
                    text: insights[currentIdx],
                    onComplete: () => {
                        currentIdx++;
                        setTimeout(showNext, 300);
                    }
                });
            } else {
                // Handover
                if (onComplete) onComplete();
            }
        };

        showNext();
    };

    // --- SUB-COMPONENTS ---

    const StatusBar = () => (
        <div style={{
            width: '100%', height: '44px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '0 24px', fontSize: '15px', fontWeight: '600',
            color: '#fff', position: 'absolute', top: 0, left: 0, zIndex: 100
        }}>
            <span>{timeString}</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px' }}>LTE</span>
                <div style={{ width: '24px', height: '12px', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '3px', position: 'relative', padding: '1px' }}>
                    <div style={{ width: '12%', height: '100%', backgroundColor: '#ffca28', borderRadius: '1px' }}></div>
                    <div style={{ position: 'absolute', right: '-3px', top: '3px', width: '2px', height: '4px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '0 1px 1px 0' }}></div>
                </div>
            </div>
        </div>
    );

    const AppIcon = ({ icon, name, color, isGacha, onClick, disabled }) => (
        <div
            onClick={onClick}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                opacity: disabled ? 0.5 : 1, cursor: disabled ? 'default' : 'pointer',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isGacha && !disabled ? 'scale(1.05)' : 'scale(1)'
            }}
            className={isGacha && !disabled && !appOpen ? 'gacha-breathing' : ''}
        >
            <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', color: '#fff',
                boxShadow: isGacha && !disabled ? '0 8px 20px rgba(110, 60, 200, 0.4)' : '0 4px 10px rgba(0,0,0,0.2)',
                position: 'relative', overflow: 'hidden'
            }}>
                {icon}
                {/* Gloss effect */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' }}></div>
            </div>
            <span style={{ fontSize: '12px', color: '#fff', fontWeight: '400', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{name}</span>
        </div>
    );

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 30000,
            backgroundImage: `url(${phoneBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.8)', // Darken background to focus on phone
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>

            {/* --- PHONE DEVICE CONTAINER --- */}
            <div style={{
                width: '390px', height: '844px', // iPhone 13/14 Pro dimensions roughly
                maxHeight: '95vh', // Responsive safety
                backgroundColor: '#000',
                borderRadius: '48px',
                boxShadow: '0 0 0 12px #1c1c1e, 0 0 0 14px #333, 0 20px 60px rgba(0,0,0,0.8)', // Bezel & Shadow
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
            }}>
                {/* Notch / Dynamic Island placeholder */}
                <div style={{
                    position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
                    width: '120px', height: '32px', backgroundColor: '#000',
                    borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px',
                    zIndex: 200
                }}></div>

                <StatusBar />

                {/* --- WALLPAPER LAYER --- */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    background: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)', // Default wallpaper
                }}></div>

                {/* --- VIEW: LOCK SCREEN --- */}
                {view === 'lock' && (
                    <div
                        onClick={() => setView('entry')}
                        style={{
                            position: 'relative', zIndex: 1, flex: 1,
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            paddingTop: '60px', color: '#fff', cursor: 'pointer',
                            animation: 'fadeIn 0.6s ease-out'
                        }}
                    >
                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>🔒</div>
                        <div style={{ fontSize: '82px', fontWeight: '200', letterSpacing: '-2px', lineHeight: '1' }}>{timeString}</div>
                        <div style={{ fontSize: '18px', fontWeight: '500', opacity: 0.8, marginTop: '8px' }}>{dateString}</div>

                        <div style={{ marginTop: 'auto', marginBottom: '30px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '40%', height: '5px', backgroundColor: '#fff', borderRadius: '10px' }}></div>
                            <div style={{ fontSize: '13px', fontWeight: '400', opacity: 0.6 }}>Swipe up to unlock</div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: PASSCODE --- */}
                {view === 'entry' && (
                    <div style={{
                        position: 'relative', zIndex: 2, flex: 1,
                        backdropFilter: 'blur(30px) saturate(180%)', backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        animation: 'slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}>
                        <button onClick={() => onReturnToMirror()} style={{ position: 'absolute', top: '50px', left: '30px', background: 'none', border: 'none', color: '#fff', fontSize: '16px', fontWeight: '500', cursor: 'pointer', zIndex: 10 }}>Cancel</button>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', marginBottom: '20px' }}>
                            {/* Input Display Group */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                                <div style={{ fontSize: '17px', fontWeight: '500', color: '#fff' }}>
                                    {isWrong ? 'Try Again' : 'Enter Passcode'}
                                </div>

                                {/* Dots */}
                                <div style={{ display: 'flex', gap: '24px', transform: shake ? 'translateX(10px)' : 'none', transition: 'transform 0.1s' }}>
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} style={{
                                            width: '14px', height: '14px', borderRadius: '50%',
                                            border: '1.5px solid #fff',
                                            backgroundColor: passcode.length > i ? '#fff' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Keypad */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                                    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                                    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
                                ].map((row, rI) => (
                                    <div key={rI} style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                        {row.map(char => (
                                            <button
                                                key={char}
                                                onClick={() => handleKey_click(char)}
                                                style={{
                                                    width: '32px', height: '44px', borderRadius: '6px',
                                                    backgroundColor: 'rgba(255,255,255,0.3)', border: 'none',
                                                    color: '#fff', fontSize: '20px', fontWeight: '400',
                                                    boxShadow: '0 1px 0 rgba(0,0,0,0.3)', cursor: 'pointer',
                                                    transition: 'background-color 0.15s'
                                                }}
                                                onMouseDown={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.5)'}
                                                onMouseUp={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                                            >{char}</button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: HOME SCREEN --- */}
                {view === 'home' && (
                    <div style={{
                        position: 'relative', zIndex: 1, flex: 1,
                        display: 'flex', flexDirection: 'column',
                        padding: '60px 24px 20px',
                        animation: 'fadeIn 0.5s ease'
                    }}>
                        {/* Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px 14px' }}>
                            <AppIcon
                                icon="📓" name="일기" color="#8e8e93"
                                disabled={dialogue.show || true}
                            />
                            <AppIcon
                                icon="🎮" name="가챠킹덤" color="#5E5CE6" isGacha={true}
                                disabled={dialogue.show || (!gachaUnlocked)}
                                onClick={() => {
                                    if (!dialogue.show && gachaUnlocked) setAppOpen(true);
                                }}
                            />
                            <AppIcon
                                icon="⚙️" name="설정" color="#828282"
                                disabled={dialogue.show || true}
                            />
                        </div>

                        {/* Dock */}
                        <div style={{
                            marginTop: 'auto', marginBottom: '10px',
                            backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)',
                            borderRadius: '35px', padding: '16px 20px',
                            display: 'flex', justifyContent: 'space-around', alignItems: 'center'
                        }}>
                            <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: '#34c759', display: 'grid', placeItems: 'center', fontSize: '28px', color: '#fff', opacity: 0.6 }}>📞</div>
                            <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: '#007aff', display: 'grid', placeItems: 'center', fontSize: '28px', color: '#fff', opacity: 0.6 }}>💬</div>
                            <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'linear-gradient(135deg, #ff9500, #ff3b30)', display: 'grid', placeItems: 'center', fontSize: '28px', color: '#fff', opacity: 0.6 }}>♫</div>

                            {/* COMPASS / MAP ICON */}
                            <div
                                onClick={() => {
                                    if (investigationStep >= 3) {
                                        setMapOpen(true);
                                    }
                                }}
                                className={investigationStep === 3 ? 'guide-pulse' : ''}
                                style={{
                                    width: '54px', height: '54px', borderRadius: '14px', background: '#e5e5ea',
                                    display: 'grid', placeItems: 'center', fontSize: '28px', color: '#000',
                                    opacity: investigationStep >= 3 ? 1 : 0.6,
                                    cursor: investigationStep >= 3 ? 'pointer' : 'default',
                                    position: 'relative',
                                    transition: 'opacity 0.3s'
                                }}
                            >
                                🧭
                                {investigationStep === 3 && (
                                    <div style={{
                                        position: 'absolute', top: -5, right: -5, width: '12px', height: '12px',
                                        borderRadius: '50%', background: '#ff3b30', border: '2px solid #fff',
                                        zIndex: 10
                                    }}></div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- APP POPUP (GACHA) --- */}
                {appOpen && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 50,
                        backgroundColor: '#121212',
                        display: 'flex', flexDirection: 'column',
                        animation: 'appLaunch 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
                    }}>
                        {/* Fake App Status Bar overlap */}
                        <div style={{ height: '44px', background: '#1a1a1a' }} />

                        {/* App Header */}
                        <div style={{ padding: '10px 20px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #333' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#5E5CE6', display: 'grid', placeItems: 'center' }}>🎮</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Hayan_0824</span>
                                    <span style={{ fontSize: '11px', color: '#888' }}>VIP Member (Expired)</span>
                                </div>
                            </div>
                            <button onClick={() => setAppOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '28px', height: '28px', borderRadius: '50%', color: '#fff', cursor: 'pointer' }}>✕</button>
                        </div>

                        {/* Warning Banner */}
                        <div style={{ background: '#FF3B30', color: '#fff', padding: '8px', fontSize: '12px', textAlign: 'center', fontWeight: '700' }}>
                            ⚠ 분석 모드 (READ ONLY)
                        </div>

                        {/* Content Area */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', color: '#fff' }}>
                            {/* MAIN TAB */}
                            {appTab === 'main' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'center' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)',
                                        borderRadius: '20px', padding: '24px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #333',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Result</div>
                                        <div style={{ fontSize: '22px', fontWeight: '800', color: '#FF3B30', marginBottom: '5px' }}>FAILURE</div>
                                        <div style={{ fontSize: '16px', color: '#ddd' }}>플래티넘 레전드 획득 실패</div>
                                        <div style={{ height: '1px', background: '#444', margin: '15px 0' }}></div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>2025.08.22 23:45</div>
                                    </div>

                                    <button disabled style={{
                                        width: '100%', padding: '16px', borderRadius: '14px',
                                        background: '#2c2c2e', color: '#555', border: '2px solid #333',
                                        fontSize: '16px', fontWeight: '600', cursor: 'not-allowed'
                                    }}>
                                        재화 부족 (0 Coins)
                                    </button>
                                </div>
                            )}

                            {/* LOG TAB */}
                            {appTab === 'log' && (
                                <div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '15px', paddingLeft: '5px' }}>기록 (History)</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[
                                            { d: "22", t: "23:45" }, { d: "22", t: "20:30" },
                                            { d: "21", t: "21:15" }, { d: "20", t: "18:20" },
                                            { d: "19", t: "22:10" }, { d: "18", t: "21:40" },
                                            { d: "17", t: "20:05" }, { d: "17", t: "19:30" }
                                        ].map((item, i) => (
                                            <div key={i} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '12px 16px', background: '#1c1c1e', borderRadius: '12px',
                                                borderLeft: '4px solid #FF3B30'
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '14px' }}>플래티넘 뽑기</span>
                                                    <span style={{ fontSize: '11px', color: '#666' }}>2025.08.{item.d} {item.t}</span>
                                                </div>
                                                <span style={{ color: '#FF3B30', fontWeight: 'bold', fontSize: '13px' }}>실패</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PROB TAB */}
                            {appTab === 'prob' && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ marginTop: '30px', marginBottom: '10px', fontSize: '14px', color: '#888' }}>현재 적용 확률</div>
                                    <div style={{ fontSize: '48px', fontWeight: '800', background: 'linear-gradient(to right, #30cfd0 0%, #330867 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        10%
                                    </div>
                                    <div style={{ fontSize: '16px', color: '#fff', fontWeight: '600' }}>플래티넘 레전드</div>

                                    <div style={{ margin: '40px 0', height: '1px', background: '#333' }}></div>

                                    <div style={{ textAlign: 'left', padding: '15px', background: '#1c1c1e', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Previous Cycle</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>플래티넘 레전드</span>
                                            <span style={{ color: '#aaa', textDecoration: 'line-through' }}>40%</span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#555', marginTop: '10px' }}>Ended: 2025.08.13</div>
                                    </div>
                                </div>
                            )}

                            {/* NOTICE TAB */}
                            {appTab === 'notice' && (
                                <div>
                                    {!noticeOpen ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            {[
                                                { t: "⚡ [긴급] 서버 안정화 안내", d: "Today" },
                                                { t: "💎 [이벤트] 여름맞이 패키지", d: "Yesterday" },
                                                { t: "📢 [공지] 아이템 확률 조정 안내", d: "2025.08.13", highlight: true },
                                                { t: "🛡 [클린] 불량이용자 제재", d: "2025.08.10" }
                                            ].map((n, i) => (
                                                <div key={i}
                                                    onClick={() => {
                                                        if (n.highlight) {
                                                            setNoticeOpen(true);
                                                            setNoticeRead(true);
                                                            if (investigationStep < 2) setInvestigationStep(2);
                                                        }
                                                    }}
                                                    className={n.highlight && !noticeRead ? 'guide-pulse' : ''}
                                                    style={{
                                                        padding: '16px', background: n.highlight ? 'rgba(94, 92, 230, 0.15)' : 'transparent',
                                                        borderBottom: '1px solid #222', cursor: n.highlight ? 'pointer' : 'default',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative'
                                                    }}
                                                >
                                                    <span style={{ color: n.highlight ? '#bf5af2' : '#fff', fontSize: '14px' }}>{n.t}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '12px', color: '#666' }}>{n.d}</span>
                                                        {n.highlight && !noticeRead && (
                                                            <div style={{
                                                                width: '6px', height: '6px', borderRadius: '50%',
                                                                background: '#ff3b30', boxShadow: '0 0 5px #ff3b30'
                                                            }}></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ animation: 'fadeIn 0.3s' }}>
                                            <button onClick={() => setNoticeOpen(false)} style={{ background: 'none', border: 'none', color: '#0A84FF', fontSize: '14px', marginBottom: '15px', cursor: 'pointer' }}>&lt; 목록</button>
                                            <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>[공지] 아이템 확률 조정 안내</h2>
                                            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#ccc' }}>
                                                안녕하세요, 가챠킹덤입니다.<br /><br />
                                                게임 내 경제 밸런스 유지를 위해 부득이하게 일부 아이템의 획득 확률이 조정됩니다.<br /><br />
                                                변경 대상: <strong style={{ color: '#FF3B30' }}>플래티넘 레전드 등급</strong><br />
                                                변경 내용: <strong style={{ color: '#FF3B30' }}>40% → 10%</strong><br /><br />
                                                이는 8월 13일 점검 후 즉시 적용됩니다.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* App Nav */}
                        <div style={{
                            height: '60px', background: '#1a1a1a', borderTop: '1px solid #333',
                            display: 'flex', justifyContent: 'space-around', alignItems: 'center'
                        }}>
                            {[
                                { id: 'main', icon: '🏠', l: "홈", msg: "메인 화면은 화려한 성공담뿐이야. 실패할 거란 생각은 들지 않게 설계되었군." },
                                { id: 'log', icon: '📝', l: "기록", msg: "8월 17일부터 실패가 계속되었어. 일기장에 적힌 '이상하다'는 시점과 일치해.", highlight: true },
                                { id: 'prob', icon: '📊', l: "확률", msg: "10%라... 하얀이는 분명 40%로 알고 있었지. 아무런 알림 없이 수치를 바꾼 거야.", highlight: true },
                                { id: 'notice', icon: '🔔', l: "공지", msg: "수많은 이벤트 공지 사이에 '확률 조정'을 숨겨놨어. 사용자가 일부러 못 보게 하려는 의도야.", highlight: true }
                            ].map(item => (
                                <div key={item.id}
                                    onClick={() => {
                                        setAppTab(item.id);
                                        setDialogue({ show: true, text: item.msg, onComplete: null });
                                        if (item.highlight) {
                                            setVisitedTabs(prev => ({ ...prev, [item.id]: true }));
                                        }
                                    }}
                                    className={item.highlight && appTab !== item.id && !visitedTabs[item.id] ? 'guide-pulse' : ''}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        opacity: appTab === item.id ? 1 : 0.4, cursor: 'pointer',
                                        position: 'relative'
                                    }}>
                                    <div style={{ fontSize: '20px' }}>{item.icon}</div>
                                    <div style={{ fontSize: '10px', marginTop: '2px' }}>{item.l}</div>
                                    {item.highlight && appTab !== item.id && !visitedTabs[item.id] && (
                                        <div style={{
                                            position: 'absolute', top: -5, right: -5, width: '8px', height: '8px',
                                            borderRadius: '50%', background: '#ff3b30', border: '1px solid #1a1a1a'
                                        }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- MAP APP OVERLAY --- */}
                {mapOpen && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 60,
                        backgroundColor: '#1c1c1e',
                        display: 'flex', flexDirection: 'column',
                        animation: 'appLaunch 0.3s cubic-bezier(0.19, 1, 0.22, 1)'
                    }}>
                        {/* Map Header */}
                        <div style={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', zIndex: 10, background: 'rgba(28,28,30,0.8)', backdropFilter: 'blur(10px)' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#333', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
                                onClick={() => setMapOpen(false)}
                            >✕</div>
                            <div style={{ fontWeight: 'bold', color: '#fff' }}>Map</div>
                            <div style={{ width: '30px' }}></div>
                        </div>

                        {/* Map Content (Mock) */}
                        <div style={{ flex: 1, position: 'relative', background: '#2c2c2e', overflow: 'hidden' }}>
                            {/* Map Grid/Context */}
                            <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(#555 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            {/* Pin */}
                            <div
                                onClick={() => {
                                    setDialogue({
                                        show: true,
                                        text: "여기군. 자주 가던 'S-Planet' PC방. 여기서 마지막으로 접속했을 거야.",
                                        onComplete: () => {
                                            setMapOpen(false); // Close map
                                            setInvestigationStep(5); // Insight Phase
                                            playInsightSequence();
                                        }
                                    });
                                }}
                                style={{
                                    position: 'absolute', top: '40%', left: '60%',
                                    width: '40px', height: '40px', transform: 'translate(-50%, -50%)',
                                    cursor: 'pointer', zIndex: 20
                                }}
                                className="guide-pulse"
                            >
                                <div style={{ fontSize: '30px' }}>📍</div>
                                <div style={{
                                    position: 'absolute', top: '35px', left: '50%', transform: 'translateX(-50%)',
                                    whiteSpace: 'nowrap', background: '#000', padding: '2px 6px', borderRadius: '4px',
                                    fontSize: '10px', color: '#fff'
                                }}>S-Planet PC</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- DIALOGUE OVERLAY (EXACT AROOM THEME) --- */}
                {dialogue.show && createPortal(
                    <div
                        onClick={handleDialogueClick}
                        style={{
                            position: 'fixed', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                            width: '70%', maxWidth: '1000px', minHeight: '250px',
                            background: purpleTheme.bg,
                            border: `1px solid ${purpleTheme.border}`,
                            boxShadow: `0 0 30px ${purpleTheme.glow}`,
                            backdropFilter: 'blur(16px)',
                            clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                            zIndex: 50000, cursor: 'pointer', display: 'flex', flexDirection: 'column',
                            padding: '0',
                            fontFamily: '"Pretendard Variable", Pretendard, sans-serif'
                        }}
                    >
                        <div style={{ width: '100%', height: '35px', background: `linear-gradient(90deg, rgba(191, 90, 242, 0.15) 0%, transparent 100%)`, borderBottom: `1px solid ${purpleTheme.border}`, display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                            <div style={{ width: '8px', height: '8px', background: purpleTheme.primary, marginRight: '15px', borderRadius: '50%', boxShadow: `0 0 8px ${purpleTheme.primary}` }}></div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: purpleTheme.primary, letterSpacing: '2px', fontWeight: 'bold' }}>DIGITAL INVESTIGATION // {investigationStep >= 5 ? 'INSIGHT_REPORT' : 'PHONE_LOG'}</span>
                        </div>
                        <div style={{ padding: '2.5rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'inline-block', background: 'rgba(191, 90, 242, 0.15)', padding: '0.4rem 1.5rem', borderLeft: `4px solid ${purpleTheme.primary}`, marginBottom: '1rem', width: 'fit-content' }}>
                                <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.05em' }}>{investigationStep >= 5 ? '수사관' : '나'}</span>
                            </div>
                            <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.6rem', lineHeight: '1.6', margin: 0, fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                {dialogue.text}
                            </p>
                        </div>
                        <div style={{ position: 'absolute', bottom: '20px', right: '30px', color: purpleTheme.primary, fontSize: '1.2rem', fontWeight: 'bold', animation: 'bounce 1s infinite', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            NEXT <span style={{ fontSize: '1.0rem' }}>▼</span>
                        </div>
                    </div>,
                    document.body
                )}

                <style>{`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    @keyframes appLaunch { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                    @keyframes gachaGlow { 
                        0% { box-shadow: 0 0 10px rgba(94, 92, 230, 0.2); }
                        100% { box-shadow: 0 0 25px rgba(94, 92, 230, 0.8); }
                    }
                    .gacha-breathing { animation: gachaPulse 2s infinite ease-in-out; }
                    @keyframes gachaPulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
                    @keyframes dialogueSlideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
                    .guide-pulse { animation: navPulse 2s infinite; }
                    @keyframes navPulse { 0% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); filter: drop-shadow(0 0 5px #BF5AF2); } 100% { opacity: 0.4; transform: scale(1); } }
                `}</style>
            </div>
        </div>
    );
};

export default PhoneAuth;
