import React, { useState, useEffect } from 'react';
import bgImage from '../assets/디지털수사본부.png';
import characterImage from '../assets/본부장.png';
import newsBackground from '../assets/news_background.jpg';

const InvestigationHQ = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [showNews, setShowNews] = useState(false);
    const [newsFinished, setNewsFinished] = useState(false); // ✅ 추가
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const dialogues = [
        "이번에 테스트를 통과한 신입요원인가?",
        "반갑군. 난 디지털 수사본부 본부장일세.",
        "들어오자마자 바쁘겠군. 화면에 뉴스를 보게.",
        "자네는 A가 사라진 이유와 어디 있는지를 알아내야하네.",
        "단, 특정 기업과 연관된 문제일 수 있으니 비밀스럽게 움직여야하네.",
        "A의 방에 비밀스럽게 잠입하여 사건을 해결하게."
    ];

    useEffect(() => {
        // Skip if news is showing or already finished this step
        if (showNews || (step === 2 && newsFinished)) return;

        const currentText = dialogues[step];
        setDisplayedText('');
        setIsTyping(true);

        let index = 0;
        const interval = setInterval(() => {
            if (index <= currentText.length) {
                setDisplayedText(currentText.slice(0, index));
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);

                // step 2에서는 자동으로 뉴스만 띄움
                if (step === 2 && !newsFinished) {
                    setTimeout(() => {
                        setShowNews(true);
                    }, 1000);
                }
            }
        }, 30);

        return () => clearInterval(interval);
    }, [step]); // Only depend on step - removed showNews to prevent infinite loop

    const handleNext = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 300);

        // 뉴스가 떠 있는 동안: 클릭 = 뉴스 닫고 다음 대화로
        if (showNews) {
            setShowNews(false);
            setNewsFinished(true);
            setStep(3); // Jump to "자네는 A가 사라진 이유와..."
            return;
        }

        if (isTyping) return;

        // step 2에서는 뉴스 끝나기 전까지 절대 step 증가 금지
        if (step === 2 && !newsFinished) return;

        if (step < dialogues.length - 1) {
            setStep(prev => prev + 1);
        } else {
            if (onComplete) onComplete();
        }
    };

    const navyTheme = {
        primary: '#4fc3f7',
        secondary: '#0d47a1',
        bg: 'rgba(2, 6, 23, 0.95)',
        glow: 'rgba(33, 150, 243, 0.3)',
        border: 'rgba(33, 150, 243, 0.5)'
    };

    return (
        <div
            onClick={handleNext}
            style={{
                width: '100vw',
                height: '100vh',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
                cursor: 'none'
            }}
        >

            {/* Character */}
            <img
                src={characterImage}
                alt="Head of HQ"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '5%',
                    height: '65%', /* Fixed at 65% as requested */
                    objectFit: 'contain',
                    filter: 'drop-shadow(10px 0 30px rgba(0,0,0,0.6))',
                    zIndex: 1,
                    animation: 'slideInLeft 0.8s ease-out'
                }}
            />

            {/* OUTER CONTAINER - CLIP PATH ONLY */}
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '7%',
                width: '60%',
                minHeight: '240px',
                /* The clip-path cuts off the top-left 20px corner visually */
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                zIndex: 10,
                opacity: 0,
                animation: 'fadeIn 0.8s ease-out 0.3s forwards',
            }}>
                {/* INNER CONTAINER - VISUAL STYLING (The Box) */}
                <div style={{
                    background: navyTheme.bg,
                    border: `2px solid ${navyTheme.border}`,
                    boxShadow: `0 0 40px ${navyTheme.glow}, inset 0 0 60px rgba(13, 71, 161, 0.2)`,
                    backdropFilter: 'blur(12px)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box' /* IMPORTANT: Ensures padding accounts for size */
                }}>

                    {/* Tech Header Line */}
                    <div style={{
                        width: '100%',
                        height: '40px',
                        background: `linear-gradient(90deg, rgba(33, 150, 243, 0.15) 0%, transparent 100%)`,
                        borderBottom: `1px solid ${navyTheme.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '40px',
                        flexShrink: 0
                    }}>
                        <div style={{ width: '10px', height: '10px', background: navyTheme.primary, marginRight: '15px', borderRadius: '50%', boxShadow: `0 0 10px ${navyTheme.primary}` }}></div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: navyTheme.primary, letterSpacing: '3px', fontWeight: 'bold' }}>DIGITAL INVESTIGATION HQ // CH_01</span>
                    </div>

                    {/* CONTENT AREA */}
                    <div style={{
                        padding: '2.5rem 3.5rem', /* Generous padding inside the box */
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        boxSizing: 'border-box'
                    }}>
                        {/* Name Tag */}
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(13, 71, 161, 0.3)',
                            padding: '0.4rem 1.5rem',
                            borderLeft: `5px solid ${navyTheme.primary}`,
                            marginBottom: '1rem',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }}>
                            <h3 style={{
                                color: '#fff',
                                margin: 0,
                                fontSize: '1.6rem',
                                fontWeight: '800',
                                letterSpacing: '0.05em'
                            }}>본부장</h3>
                        </div>

                        {/* Dialogue Text - Added explicit shim padding */}
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontSize: '1.6rem',
                            lineHeight: '1.5',
                            margin: 0,
                            fontWeight: '400',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            width: '100%',
                            paddingLeft: '5px' /* Explicit visual safety shim */
                        }}>
                            {displayedText}
                            {isTyping && <span className="cursor-blink" style={{ color: navyTheme.primary }}>|</span>}
                        </p>
                    </div>
                </div>

                {/* Decorative Elements (Outside Inner to avoid filtering/clipping weirdness if any) */}
                <div style={{ position: 'absolute', bottom: '0', right: '0', width: '30px', height: '30px', borderRight: `3px solid ${navyTheme.primary}`, borderBottom: `3px solid ${navyTheme.primary}`, zIndex: 11, pointerEvents: 'none' }}></div>

                {/* Click indicator */}
                {!isTyping && !showNews && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '40px',
                        color: navyTheme.primary,
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        animation: 'bounce 1s infinite',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 20
                    }}>
                        NEXT <span style={{ fontSize: '1.5rem' }}>▼</span>
                    </div>
                )}
            </div>

            {/* News Overlay */}
            {showNews && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.85)',
                    zIndex: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backdropFilter: 'blur(8px)',
                    opacity: showNews ? 1 : 0,
                    transition: 'opacity 0.6s ease'
                }}>
                    <div style={{
                        width: '85%',
                        maxWidth: '1200px',
                        aspectRatio: '16/9',
                        background: '#000',
                        border: '2px solid #333',
                        boxShadow: '0 0 150px rgba(200, 0, 0, 0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'scaleIn 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
                        position: 'relative'
                    }}>
                        <div style={{
                            background: 'linear-gradient(90deg, #cc0000 0%, #990000 80%, #660000 100%)',
                            color: 'white',
                            padding: '1.5rem 3rem',
                            fontWeight: '900',
                            fontSize: '2.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontStyle: 'italic',
                            letterSpacing: '-0.05em'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', animation: 'blinkRed 1s infinite' }}></div>
                                BREAKING NEWS
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '500', fontFamily: 'monospace', opacity: 0.9 }}>LIVE // 20:42 PM</span>
                        </div>

                        <div style={{
                            flex: 1,
                            backgroundImage: `url(${newsBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#fff',
                            flexDirection: 'column'
                        }}>
                            {/* Dark overlay for text readability */}
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', pointerEvents: 'none' }}></div>

                            <h2 style={{
                                fontSize: '5rem',
                                textAlign: 'center',
                                color: '#fff',
                                textTransform: 'uppercase',
                                lineHeight: '1.2',
                                fontWeight: '800',
                                textShadow: '4px 4px 0px #800000'
                            }}>
                                중학생 <span style={{ color: '#ff3333' }}>A</span> 실종<br />
                                <span style={{ fontSize: '3rem', fontWeight: '600', background: '#cc0000', padding: '0.2rem 2rem', display: 'inline-block', marginTop: '1rem', textShadow: 'none' }}>부모와 연락 두절</span>
                            </h2>
                        </div>

                        <div style={{
                            background: '#090909',
                            borderTop: '3px solid #cc0000',
                            color: '#fff',
                            padding: '1.2rem 0',
                            overflow: 'hidden',
                            fontFamily: '"Pretendard Variable", sans-serif',
                            fontSize: '1.8rem',
                            fontWeight: '600'
                        }}>
                            <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'ticker 20s linear infinite' }}>
                                <span style={{ color: '#ff3333', marginRight: '1.5rem' }}>● [속보]</span>
                                중학생 A, 행방불명... 부모 "평소와 다름없었다" 오열... 경찰 수사 착수... 특정 기업과의 연관성 조사 중... 시민들의 제보를 기다립니다. (02-XXX-XXXX) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 경찰, A군의 마지막 행적 CCTV 확보 주력...
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(8px); }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; filter: blur(20px); }
                    to { transform: scale(1); opacity: 1; filter: blur(0); }
                }
                @keyframes ticker {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes slideInLeft {
                    from { transform: translateX(-100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes blinkRed {
                    0%, 100% { opacity: 1; box-shadow: 0 0 20px white; }
                    50% { opacity: 0.4; box-shadow: 0 0 0 white; }
                }
                .cursor-blink {
                    animation: blink 1s step-end infinite;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default InvestigationHQ;
