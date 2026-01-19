import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import bgImage from '../assets/pc_bang_background_final.jpg';

const InvestigationInsight = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    // Remove unused fade state if not needed, or keep for animation

    // Narrative Sequence
    const dialogues = [
        // 0-2: Encounter & Relief
        { speaker: '나', text: "(구석진 자리에서 익숙한 뒷모습이 보인다...)" },
        { speaker: '나', text: "하얀 학생...!", effect: 'pulse' },
        { speaker: '하얀', text: "....?! 누구세요...?" },

        // 3-6: Insight (Dark Pattern)
        { speaker: '나', text: "걱정하지 마. 부모님 부탁을 받고 데리러 왔어." },
        { speaker: '나', text: "너의 잘못만은 아니야. 시스템이 그렇게 설계되어 있었을 뿐이지." },
        { speaker: '나', text: "이건 'UI와 UX의 함정'이야. 사용자의 착각이나 실수를 유도하거나 행동하게 해서 이익을 챙기는거지." },
        { speaker: '나', text: "하지만 그렇다고 해서 선택의 책임이 아예 없는 건 아니야. 이 함정을 꿰뚫어보는 눈을 가져야 해." },

        // 7-8: Hayan's breakdown
        { speaker: '하얀', text: "무서웠어요... 그냥 게임으로 돈을 벌어서 엄마를 기쁘게 해드리고 싶었는데... 나도 모르게 계속...", style: 'crying' },
        { speaker: '하얀', text: "다시는 이런 것에 속지 않을래요. 엄마 아빠가 보고 싶어요...", style: 'crying' },

        // 9-10: Safe Return (Narration)
        { speaker: 'System', text: "하얀 학생을 무사히 부모님의 품으로 데려다주었다.", style: 'narration' },
        { speaker: 'System', text: "디지털 그림자 속에 갇혔던 아이는 이제 다시 밝은 세상으로 돌아갔다.", style: 'narration' }
    ];

    // Themes
    const purpleTheme = {
        primary: '#BF5AF2',
        bg: 'rgba(15, 5, 25, 0.8)',
        border: 'rgba(191, 90, 242, 0.5)',
        glow: 'rgba(191, 90, 242, 0.3)'
    };

    const whiteTheme = {
        primary: '#FFFFFF',
        bg: 'rgba(20, 20, 20, 0.9)',
        border: 'rgba(255, 255, 255, 0.5)',
        glow: 'rgba(255, 255, 255, 0.3)'
    };

    const narrationTheme = {
        primary: '#AAAAAA',
        bg: 'rgba(0, 0, 0, 0.85)',
        border: 'rgba(100, 100, 100, 0.5)',
        glow: 'rgba(0,0,0,0)'
    };

    useEffect(() => {
        const currentData = dialogues[step];
        if (!currentData) return;

        setDisplayedText('');
        setIsTyping(true);

        let index = 0;
        const interval = setInterval(() => {
            if (index <= currentData.text.length) {
                setDisplayedText(currentData.text.slice(0, index));
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [step]);

    const handleNext = () => {
        if (isTyping) return;

        if (step < dialogues.length - 1) {
            setStep(prev => prev + 1);
        } else {
            if (onComplete) onComplete();
        }
    };

    const currentSpeaker = dialogues[step]?.speaker;
    const currentStyle = dialogues[step]?.style || 'normal';

    // Determine current theme
    let currentTheme = purpleTheme; // Default 'Me'
    if (currentSpeaker === '하얀') currentTheme = whiteTheme;
    if (currentSpeaker === 'System') currentTheme = narrationTheme;

    return (
        <div
            onClick={handleNext}
            style={{
                width: '100vw', height: '100vh',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                animation: 'fadeIn 1s ease-out',
                fontFamily: '"Pretendard Variable", Pretendard, sans-serif'
            }}
        >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}></div>

            {/* Dialogue Box Container - ARoom Style */}
            <div style={{
                position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                width: '70%', maxWidth: '1000px', minHeight: '200px',
                background: currentTheme.bg,
                border: `1px solid ${currentTheme.border}`,
                boxShadow: `0 0 30px ${currentTheme.glow}`,
                backdropFilter: 'blur(16px)',
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                zIndex: 100, display: 'flex', flexDirection: 'column', padding: '0',
                transition: 'all 0.3s ease'
            }}>
                {/* Header Line */}
                <div style={{
                    width: '100%', height: '35px',
                    background: `linear-gradient(90deg, ${currentTheme.border.replace('0.5', '0.15')} 0%, transparent 100%)`,
                    borderBottom: `1px solid ${currentTheme.border}`,
                    display: 'flex', alignItems: 'center', paddingLeft: '40px'
                }}>
                    <div style={{ width: '8px', height: '8px', background: currentTheme.primary, marginRight: '15px', borderRadius: '50%', boxShadow: `0 0 8px ${currentTheme.primary}` }}></div>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: currentTheme.primary, letterSpacing: '2px', fontWeight: 'bold' }}>
                        {currentSpeaker === 'System' ? 'SYSTEM // LOG' : 'DIGITAL INVESTIGATION // INSIGHT'}
                    </span>
                </div>

                {/* Content Area */}
                <div style={{ padding: '2rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {/* Name Tag */}
                    {currentSpeaker !== 'System' && (
                        <div style={{
                            display: 'inline-block',
                            background: currentTheme.border.replace('0.5', '0.15'), // Low opacity version of border color
                            padding: '0.4rem 1.5rem',
                            borderLeft: `4px solid ${currentTheme.primary}`,
                            marginBottom: '1.2rem',
                            width: 'fit-content'
                        }}>
                            <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.05em' }}>{currentSpeaker}</span>
                        </div>
                    )}

                    {/* Text */}
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '1.6rem',
                        lineHeight: '1.6',
                        margin: 0,
                        fontWeight: '400',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        textAlign: currentSpeaker === 'System' ? 'center' : 'left'
                    }}>
                        {displayedText}
                        {isTyping && <span className="cursor-blink" style={{ color: currentTheme.primary, marginLeft: '5px' }}>|</span>}
                    </p>
                </div>

                {/* Next Indicator */}
                {!isTyping && (
                    <div style={{ position: 'absolute', bottom: '20px', right: '30px', color: currentTheme.primary, fontSize: '1.2rem', fontWeight: 'bold', animation: 'bounce 1s infinite', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        NEXT <span style={{ fontSize: '1.0rem' }}>▼</span>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
                .cursor-blink { animation: blink 1s step-end infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

export default InvestigationInsight;
