import React, { useState, useEffect } from 'react';
import phoneBg from '../assets/phone_on_desk.png';

const PhoneAuth = ({ onComplete, onReturnToMirror }) => {
    // Overall view state: 'lock', 'entry', 'home', 'app'
    const [view, setView] = useState('lock');
    const [passcode, setPasscode] = useState('');
    const [isWrong, setIsWrong] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shake, setShake] = useState(false);
    const [unlockedMsg, setUnlockedMsg] = useState(false);

    // Gacha Kingdom App specific state
    const [appTab, setAppTab] = useState('main'); // 'main', 'log', 'prob', 'notice'
    const [noticeOpen, setNoticeOpen] = useState(false);

    const handleKeyClick = (key) => {
        if (passcode.length < 4) {
            const nextPasscode = passcode + key;
            setPasscode(nextPasscode);

            // Check immediately for "HIDE"
            if (nextPasscode.length === 4) {
                if (nextPasscode.toUpperCase() === 'HIDE') {
                    handleSuccess();
                } else {
                    handleFailure();
                }
            }
        }
    };

    const handleSuccess = () => {
        setIsSuccess(true);
        // Haptic feedback simulation
        setShake(true);
        setTimeout(() => setShake(false), 200);

        // 0.2s pause then unlock
        setTimeout(() => {
            setUnlockedMsg(true);
            setTimeout(() => {
                setView('home');
                setUnlockedMsg(false);
            }, 800);
        }, 300);
    };

    const handleFailure = () => {
        setShake(true);
        setTimeout(() => {
            setShake(false);
            setPasscode('');
            setIsWrong(true);
            setTimeout(() => {
                setIsWrong(false);
                onReturnToMirror();
            }, 2000);
        }, 500);
    };

    const handleDelete = () => {
        setPasscode(prev => prev.slice(0, -1));
    };

    // Time formatting
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 10000);
        return () => clearInterval(timer);
    }, []);

    const timeString = "22:31"; // Fixed for narrative
    const dateString = time.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

    const qwertyRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    // Home Screen Icons
    const homeIcons = [
        { id: 'diary', name: '일기', icon: '📓', locked: true },
        { id: 'gacha', name: '가챠킹덤 VIP', icon: '🎮', locked: false },
        { id: 'settings', name: '설정', icon: '⚙️', locked: true, gray: true }
    ];

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 30000,
            backgroundImage: `url(${phoneBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Global Dark Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: view !== 'lock' ? 'blur(40px) brightness(0.7)' : 'none',
                transition: 'backdrop-filter 0.5s ease',
                zIndex: 1
            }}></div>

            {/* Status Bar (Visible in Home and App) */}
            {(view === 'home' || view === 'app') && (
                <div style={{
                    zIndex: 10, width: '100%', height: '44px', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '0 40px', fontSize: '0.9rem', fontWeight: '500',
                    marginTop: '10px' // Status bar top margin
                }}>
                    <div>{timeString}</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>LTE</span>
                        <div style={{ width: '25px', height: '12px', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '2px', position: 'relative', display: 'flex', alignItems: 'center', padding: '1px' }}>
                            <div style={{ width: '12%', height: '100%', backgroundColor: '#ffcc00' }}></div>
                            <div style={{ position: 'absolute', right: '-4px', width: '2px', height: '4px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '0 1px 1px 0' }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem' }}>12%</span>
                    </div>
                </div>
            )}

            {/* 1. LOCK SCREEN */}
            {view === 'lock' && (
                <div
                    onClick={() => setView('entry')}
                    style={{
                        zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
                        width: '100%', height: '100%', cursor: 'pointer', paddingTop: '20%',
                        padding: '0 40px'
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

            {/* 2. PASSCODE ENTRY */}
            {view === 'entry' && (
                <div style={{
                    zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    width: '100%', height: '100%', paddingTop: '15%',
                    animation: 'slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}>
                    {/* Back Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onReturnToMirror(); }}
                        style={{ position: 'absolute', top: '30px', left: '40px', background: 'none', border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer', zIndex: 10 }}
                    >
                        취소
                    </button>

                    <h2 style={{ fontSize: '1.2rem', fontWeight: '400', marginBottom: '35px', textAlign: 'center' }}>
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

                    {/* Unlocked Message */}
                    {unlockedMsg && (
                        <div style={{ position: 'absolute', top: '30%', backgroundColor: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '15px', fontSize: '0.8rem', opacity: 0.8 }}>
                            잠금 해제됨
                        </div>
                    )}

                    {/* QWERTY Keyboard */}
                    <div style={{
                        marginTop: 'auto', marginBottom: '15%', width: '100%', padding: '0 20px',
                        display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'
                    }}>
                        {qwertyRows.map((row, rowIndex) => (
                            <div key={rowIndex} style={{
                                display: 'flex', gap: '6px',
                                width: '100%', justifyContent: 'center'
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
                </div>
            )}

            {/* 3. HOME SCREEN */}
            {view === 'home' && (
                <div style={{
                    zIndex: 2, display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
                    padding: '40px 10%', animation: 'fadeIn 0.5s ease-out'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px 20px', marginTop: '40px' }}>
                        {homeIcons.map(icon => (
                            <div
                                key={icon.id}
                                onClick={() => !icon.locked && setView('app')}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                    cursor: icon.locked ? 'default' : 'pointer',
                                    filter: icon.gray ? 'grayscale(1)' : 'none',
                                    opacity: icon.gray ? 0.5 : 1
                                }}
                            >
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '14px',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', backdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                }}>
                                    {icon.icon}
                                </div>
                                <span style={{ fontSize: '0.75rem', textAlign: 'center', fontWeight: '500' }}>{icon.name}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff' }}></div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. GACHA KINGDOM APP */}
            {view === 'app' && (
                <div style={{
                    zIndex: 2, display: 'flex', flexDirection: 'column', width: '100%', height: 'calc(100% - 44px)',
                    backgroundColor: '#111', animation: 'fadeIn 0.3s ease-out', position: 'relative'
                }}>
                    {/* App Header */}
                    <div style={{
                        padding: '20px 35px', borderBottom: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        backgroundColor: '#1a1a1a'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '5px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎮</div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Hayan_0824</div>
                                <div style={{ fontSize: '0.7rem', color: '#888' }}>VIP (만료됨)</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem' }}>
                            <div style={{ color: '#00ccff' }}>💎 0</div>
                            <div style={{ color: '#ffcc00' }}>🪙 120</div>
                        </div>
                    </div>

                    {/* Analysis Mode Banner */}
                    <div style={{
                        backgroundColor: '#ff3b30', color: '#fff', padding: '6px', fontSize: '0.75rem',
                        textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px'
                    }}>
                        이 계정은 현재 분석 모드입니다.
                    </div>

                    {/* Tab Content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                        {appTab === 'main' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px',
                                    border: '1px solid rgba(255,255,255,0.1)', position: 'relative'
                                }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>최근 뽑기 결과</h3>
                                    <div style={{ color: '#ff3b30', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                                        플래티넘 레전드 획득 실패
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                        마지막 시도: 2025.08.16 22:14
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                    <button disabled style={{
                                        width: '100%', padding: '18px', borderRadius: '12px',
                                        backgroundColor: '#333', color: '#888', border: 'none',
                                        fontSize: '1.1rem', fontWeight: 'bold', cursor: 'not-allowed',
                                        position: 'relative'
                                    }}>
                                        더 이상 뽑을 수 없습니다
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'radial-gradient(circle, rgba(191,90,242,0.1) 0%, transparent 70%)',
                                            pointerEvents: 'none'
                                        }}></div>
                                    </button>
                                    <p style={{ fontSize: '0.8rem', color: '#666' }}>잔액이 부족하거나 분석 모드에서는 이용이 불가합니다.</p>
                                </div>
                            </div>
                        )}

                        {appTab === 'log' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>최근 10회 뽑기 기록</h3>
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span style={{ color: '#888' }}>[22:{14 - (i + 1)}] 플래티넘 레전드</span>
                                        <span style={{ color: '#ff3b30' }}>실패</span>
                                    </div>
                                ))}
                                <div style={{
                                    padding: '15px', backgroundColor: 'rgba(255,59,48,0.1)', borderRadius: '8px',
                                    display: 'flex', flexDirection: 'column', gap: '5px', border: '1px solid rgba(255,59,48,0.3)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        <span>[22:14] 플래티넘 레전드</span>
                                        <span style={{ color: '#ff3b30' }}>실패</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#ff3b30', fontWeight: 'bold' }}>
                                        보유 재화 부족으로 종료
                                    </div>
                                </div>
                            </div>
                        )}

                        {appTab === 'prob' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px' }}>현재 적용 확률</div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00ccff' }}>10%</div>
                                    <div style={{ fontSize: '1rem', marginTop: '5px' }}>플래티넘 레전드</div>
                                </div>

                                <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center' }}>
                                    ※ 확률은 사전 고지 없이 변경될 수 있습니다.
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '15px' }}>과거 확률 기록</h4>
                                    <div style={{
                                        padding: '15px', borderLeft: '3px solid #666',
                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>플래티넘 레전드: 40%</div>
                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>적용 기간: ~2025.08.12</div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>[과거 기준]</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {appTab === 'notice' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {!noticeOpen ? (
                                    <>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>공지사항</h3>
                                        {[
                                            { title: '[이벤트] 여름 한정 코스튬 출시', date: '2025.08.15' },
                                            { title: '[중요] 일부 아이템 확률 조정 안내', date: '2025.08.13', special: true },
                                            { title: '[점검] 8월 10일 정기 점검 안내', date: '2025.08.09' },
                                            { title: '[커뮤니티] 불건전 이용자 제재 안내', date: '2025.08.05' }
                                        ].map((n, i) => (
                                            <div
                                                key={i}
                                                onClick={() => n.special && setNoticeOpen(true)}
                                                style={{
                                                    padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    cursor: n.special ? 'pointer' : 'default',
                                                    backgroundColor: n.special ? 'rgba(191,90,242,0.05)' : 'transparent'
                                                }}
                                            >
                                                <div style={{ fontSize: '0.9rem', fontWeight: n.special ? 'bold' : 'normal' }}>
                                                    {n.title}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{n.date}</div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                        <button
                                            onClick={() => setNoticeOpen(false)}
                                            style={{ background: 'none', border: 'none', color: '#00ccff', padding: '0', marginBottom: '20px', cursor: 'pointer' }}
                                        >
                                            ← 목록으로
                                        </button>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>[중요] 일부 아이템 확률 조정 안내</h3>
                                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '25px' }}>게시일: 2025.08.13</div>

                                        <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: '#ccc' }}>
                                            안녕하세요, 가챠킹덤 운영팀입니다.<br /><br />
                                            항상 저희 게임을 사랑해주시는 모험가님들께 감사의 말씀을 드립니다.<br /><br />
                                            지속적인 게임 밸런스 유지와 아이템의 가치 보존을 위해 일부 유료 아이템의 확률을 조정하게 되었습니다. 조정된 확률은 2025년 8월 13일 점검 이후부터 적용되오니 이용에 참고해 주시기 바랍니다.<br /><br />
                                            주요 조정 사항은 다음과 같습니다.<br /><br />
                                            - 골드 상자 보상 비율 개선<br />
                                            - 실버 상자 구성품 변경<br />
                                            - <span style={{ color: '#aaa' }}>플래티넘 레전드 확률이 40% → 10%로 조정됩니다.</span><br />
                                            - 기타 시스템 안정화 작업<br /><br />
                                            저희 운영팀은 앞으로도 쾌적한 게임 환경을 제공하기 위해 최선을 다하겠습니다.<br /><br />
                                            감사합니다.
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* App Bottom Navigation */}
                    {!noticeOpen && (
                        <div style={{
                            height: '60px', borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', backgroundColor: '#1a1a1a'
                        }}>
                            {[
                                { id: 'main', label: '홈', icon: '🏠' },
                                { id: 'log', label: '로그', icon: '📝' },
                                { id: 'prob', label: '확률', icon: '📊' },
                                { id: 'notice', label: '공지', icon: '🔔' }
                            ].map(tab => (
                                <div
                                    key={tab.id}
                                    onClick={() => setAppTab(tab.id)}
                                    style={{
                                        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        justifyContent: 'center', gap: '4px', cursor: 'pointer',
                                        color: appTab === tab.id ? '#BF5AF2' : '#888',
                                        backgroundColor: appTab === tab.id ? 'rgba(191,90,242,0.05)' : 'transparent'
                                    }}
                                >
                                    <div style={{ fontSize: '1.2rem' }}>{tab.icon}</div>
                                    <div style={{ fontSize: '0.65rem' }}>{tab.label}</div>
                                </div>
                            ))}
                        </div>
                    )}
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
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
};

export default PhoneAuth;
