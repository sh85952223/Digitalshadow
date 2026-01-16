import React, { useState } from 'react';

const TermsModal = ({ onClose, onWrongClause, onCorrectClause, foundClauses, purpleTheme }) => {
    const [celebrationClause, setCelebrationClause] = useState(null);
    const [scanningClause, setScanningClause] = useState(null);
    const [internalDialogue, setInternalDialogue] = useState(null); // Dialogue shown on top of modal
    const [isTyping, setIsTyping] = useState(false);
    const [dialogueText, setDialogueText] = useState('');

    const typeText = (text, callback) => {
        setDialogueText('');
        setIsTyping(true);
        let index = 0;
        const interval = setInterval(() => {
            if (index <= text.length) {
                setDialogueText(text.slice(0, index));
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
                if (callback) callback();
            }
        }, 30);
    };

    const handleClauseClick = (clauseId, successMessage, failMessage) => {
        if (clauseId) {
            // Toxic clause found!
            if (!foundClauses.includes(clauseId)) {
                // Start scan animation
                setScanningClause(clauseId);

                // After scan, show celebration
                setTimeout(() => {
                    setScanningClause(null);
                    onCorrectClause(clauseId); // Update parent state
                    setCelebrationClause(clauseId);

                    // After celebration, show dialogue ON TOP of modal (not closing)
                    setTimeout(() => {
                        setCelebrationClause(null);
                        setInternalDialogue(successMessage);
                        typeText(successMessage, null);
                    }, 1500);
                }, 600);
            }
        } else {
            // Non-toxic clause - close modal and show room dialogue with retry hint
            onWrongClause(failMessage);
        }
    };

    const handleInternalDialogueClick = () => {
        if (isTyping) return;
        setInternalDialogue(null);
        setDialogueText('');
    };

    const getClauseStyle = (clauseId) => {
        const isFound = foundClauses.includes(clauseId);
        const isScanning = scanningClause === clauseId;

        return {
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '5px',
            background: isScanning
                ? `linear-gradient(90deg, transparent 0%, ${purpleTheme.primary}40 50%, transparent 100%)`
                : isFound
                    ? 'rgba(255, 255, 0, 0.4)'
                    : 'transparent',
            border: isFound ? `2px solid ${purpleTheme.primary}` : '2px solid transparent',
            transition: 'all 0.3s',
            marginBottom: '5px',
            position: 'relative',
            overflow: 'hidden'
        };
    };

    const getNormalClauseStyle = () => ({
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '5px',
        background: 'transparent',
        border: '2px solid transparent',
        transition: 'all 0.3s',
        marginBottom: '5px'
    });

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 200, flexDirection: 'column', padding: '20px'
        }}>
            {/* Celebration Overlay */}
            {celebrationClause && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 350, pointerEvents: 'none',
                    animation: 'fadeInOut 1.5s ease-in-out'
                }}>
                    <div style={{
                        background: `linear-gradient(135deg, ${purpleTheme.primary}, #fff)`,
                        padding: '30px 60px',
                        borderRadius: '20px',
                        boxShadow: `0 0 60px ${purpleTheme.primary}, 0 0 120px ${purpleTheme.primary}50`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                        animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <span style={{ fontSize: '4rem' }}>🎉</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>독소조항 발견!</span>
                        <span style={{ fontSize: '2rem', fontWeight: '900', color: purpleTheme.primary }}>
                            제{celebrationClause.split('-')[0]}조 {celebrationClause.split('-')[1]}항
                        </span>
                    </div>
                </div>
            )}

            {/* Internal Dialogue (on top of modal) */}
            {internalDialogue && (
                <div
                    onClick={handleInternalDialogueClick}
                    style={{
                        position: 'fixed', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                        width: '70%', maxWidth: '900px', minHeight: '180px',
                        background: purpleTheme.bg || 'rgba(15, 5, 25, 0.95)',
                        border: `1px solid ${purpleTheme.border}`,
                        boxShadow: `0 0 30px ${purpleTheme.glow}, 0 0 60px rgba(0,0,0,0.8)`,
                        backdropFilter: 'blur(16px)',
                        clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                        zIndex: 400, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', padding: '0'
                    }}
                >
                    <div style={{
                        width: '100%', height: '35px',
                        background: `linear-gradient(90deg, rgba(191, 90, 242, 0.15) 0%, transparent 100%)`,
                        borderBottom: `1px solid ${purpleTheme.border}`,
                        display: 'flex', alignItems: 'center', paddingLeft: '40px'
                    }}>
                        <div style={{ width: '8px', height: '8px', background: purpleTheme.primary, marginRight: '15px', borderRadius: '50%', boxShadow: `0 0 8px ${purpleTheme.primary}` }}></div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: purpleTheme.primary, letterSpacing: '2px', fontWeight: 'bold' }}>ANALYSIS COMPLETE</span>
                    </div>
                    <div style={{ padding: '2rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(191, 90, 242, 0.15)', padding: '0.4rem 1.5rem', borderLeft: `4px solid ${purpleTheme.primary}`, marginBottom: '1.2rem', width: 'fit-content' }}>
                            <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.05em' }}>나</span>
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.4rem', lineHeight: '1.6', margin: 0, fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {dialogueText}
                            {isTyping && <span style={{ color: purpleTheme.primary, marginLeft: '5px', animation: 'blink 1s step-end infinite' }}>|</span>}
                        </p>
                    </div>
                    {!isTyping && (
                        <div style={{ position: 'absolute', bottom: '15px', right: '25px', color: purpleTheme.primary, fontSize: '1rem', fontWeight: 'bold', animation: 'bounce 1s infinite', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            NEXT <span style={{ fontSize: '0.9rem' }}>▼</span>
                        </div>
                    )}
                </div>
            )}

            <div style={{
                background: '#fff', color: '#000', width: '90%', maxWidth: '800px',
                maxHeight: '80vh', borderRadius: '10px', overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ background: '#222', color: '#fff', padding: '20px', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}>
                    📄 가챠VIP킹덤 서비스 이용약관
                </div>

                {/* Instruction */}
                <div style={{ background: purpleTheme.primary, color: '#fff', padding: '10px 20px', fontSize: '0.9rem', textAlign: 'center' }}>
                    💡 독소 조항을 찾아 클릭하세요! ({foundClauses.length}/4개 발견)
                </div>

                {/* Content */}
                <div style={{ padding: '20px', overflowY: 'auto', fontSize: '0.95rem', lineHeight: '1.8' }}>
                    {/* 제1조 - NOT TOXIC */}
                    <p
                        onClick={() => handleClauseClick(null, null, "이 조항은 약관의 목적을 명시하는 일반적인 조항이야. 서비스 제공자와 이용자 간의 관계를 정의하는 것은 당연한 내용이지.")}
                        style={getNormalClauseStyle()}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><strong>제1조 (목적)</strong></p>

                    <p
                        onClick={() => handleClauseClick(null, null, "서비스 이용과 관련된 권리, 의무, 책임 사항을 규정한다는 건 모든 약관의 기본적인 목적이야. 문제될 게 없어.")}
                        style={getNormalClauseStyle()}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >1항 본 약관은 '가챠VIP킹덤'(이하 '회사')이 제공하는 모바일 게임 및 제반 서비스 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>

                    {/* 제2조 - NOT TOXIC */}
                    <p
                        onClick={() => handleClauseClick(null, null, "용어의 정의는 약관에서 사용되는 단어의 뜻을 명확히 하기 위한 것이야. 혼란을 방지하는 필수 조항이지.")}
                        style={{ ...getNormalClauseStyle(), marginTop: '15px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><strong>제2조 (용어의 정의)</strong></p>

                    <p
                        onClick={() => handleClauseClick(null, null, "'유료 콘텐츠'가 무엇인지 정의하는 건 당연해. 이용자가 뭘 구매하는지 알아야 하니까.")}
                        style={getNormalClauseStyle()}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >1항 '유료 콘텐츠'란 회원이 서비스를 이용함에 있어 실제 현금으로 구매하는 게임 내 재화(다이아, 골드 등) 및 아이템을 의미합니다.</p>

                    <p
                        onClick={() => handleClauseClick(null, null, "구독 서비스가 뭔지 설명하는 것도 문제없어. 정기 결제라는 걸 미리 알려주는 건 좋은 거지.")}
                        style={getNormalClauseStyle()}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >2항 '구독 서비스'란 매월 정기적으로 결제되는 VIP 회원권을 의미합니다.</p>

                    {/* 제3조 */}
                    <p
                        onClick={() => handleClauseClick(null, null, "조항 제목 자체는 문제가 아니야. 내용을 자세히 살펴봐.")}
                        style={{ ...getNormalClauseStyle(), marginTop: '15px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><strong>제3조 (회원의 의무 및 동의)</strong></p>

                    <p
                        onClick={() => handleClauseClick(null, null, "'모두 동의' 버튼을 누르면 읽은 것으로 간주한다는 건... 사실 대부분의 서비스가 이렇게 해. 문제의 소지는 있지만 이것 자체가 불법은 아니야.")}
                        style={getNormalClauseStyle()}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >1항 회원은 서비스 이용 시 반드시 본 약관을 숙지해야 하며, [모두 동의] 버튼을 누를 경우 본 약관의 모든 내용을 읽고 이해한 것으로 간주합니다.</p>

                    {/* ★ TOXIC: 제3조 2항 */}
                    <p
                        onClick={() => handleClauseClick('3-2', "서비스 개선과 맞춤형 광고를 교묘히 묶어 놓았군....서비스를 제공하기 위한 것처럼 하면서 결국 광고를 위한 정보를 수집하겠다는 거네.", null)}
                        style={getClauseStyle('3-2')}
                        onMouseEnter={e => { if (!foundClauses.includes('3-2') && scanningClause !== '3-2') e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                        onMouseLeave={e => { if (!foundClauses.includes('3-2') && scanningClause !== '3-2') e.currentTarget.style.background = 'transparent'; }}
                    >
                        {scanningClause === '3-2' && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: `linear-gradient(90deg, transparent, ${purpleTheme.primary}60, transparent)`,
                                animation: 'scanLine 0.6s ease-out'
                            }}></div>
                        )}
                        {foundClauses.includes('3-2') && <span style={{ color: purpleTheme.primary, fontWeight: 'bold' }}>✓ [독소조항] </span>}
                        2항 회사는 서비스 개선 및 맞춤형 광고 제공을 위해 회원의 카메라 및 마이크 접근 권한을 요청할 수 있으며, 동의 시 수집된 데이터는 광고 타겟팅 및 분석에 활용될 수 있습니다.
                    </p>

                    {/* 제4조 */}
                    <p
                        onClick={() => handleClauseClick(null, null, "청약철회와 환불에 대한 조항이 있다는 것 자체는 좋아. 자세히 읽어봐야 해.")}
                        style={{ ...getNormalClauseStyle(), marginTop: '15px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><strong>제4조 (청약철회 및 환불)</strong></p>

                    <p
                        onClick={() => handleClauseClick(null, null, "7일 이내 청약철회 가능, 사용된 재화 환불 제한, 미성년자 법정대리인 동의... 이건 전자상거래법에 따른 표준적인 내용이야.")}
                        style={getNormalClauseStyle()}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >1항 회원이 구매한 유료 재화는 구매 후 7일 이내 청약철회가 가능하나, 이미 사용된 재화는 회사 귀책사유가 없는 한 환불이 제한되며 미성년자 결제 시 법정대리인 동의 여부에 따라 처리됩니다.</p>

                    {/* ★ TOXIC: 제4조 2항 */}
                    <p
                        onClick={() => handleClauseClick('4-2', "수시로 변경하겠다는 건 언제든 입맛에 맞게 확률을 변경하겠다는 이야기네. 게임 내 공지도 제대로 확인하지 못하면 확률형 아이템의 굴레에 빠질 수 있겠군.", null)}
                        style={getClauseStyle('4-2')}
                        onMouseEnter={e => { if (!foundClauses.includes('4-2') && scanningClause !== '4-2') e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                        onMouseLeave={e => { if (!foundClauses.includes('4-2') && scanningClause !== '4-2') e.currentTarget.style.background = 'transparent'; }}
                    >
                        {scanningClause === '4-2' && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: `linear-gradient(90deg, transparent, ${purpleTheme.primary}60, transparent)`,
                                animation: 'scanLine 0.6s ease-out'
                            }}></div>
                        )}
                        {foundClauses.includes('4-2') && <span style={{ color: purpleTheme.primary, fontWeight: 'bold' }}>✓ [독소조항] </span>}
                        2항 뽑기(가챠) 서비스의 구성 및 획득 확률은 게임 밸런스 조정 및 운영상 필요에 따라 수시로 변경될 수 있으며, 변경 내용은 별도의 개별 고지 없이 게임 내 공지를 통해 안내됩니다.
                    </p>

                    {/* 제5조 */}
                    <p
                        onClick={() => handleClauseClick(null, null, "유료 구독과 자동 결제에 대한 조항이야. 내용을 잘 살펴봐.")}
                        style={{ ...getNormalClauseStyle(), marginTop: '15px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><strong>제5조 (유료 구독 및 자동 결제)</strong></p>

                    {/* ★ TOXIC: 제5조 1항 */}
                    <p
                        onClick={() => handleClauseClick('5-1', "무료 체험이 끝나고 동의도 없이 자동 결제하겠다는거야? 거기다 모바일 게임인데 해지는 왜 컴퓨터에서 해야한다는거지? 결제일 이후 해지하면 잔여 기간은 이용하게 해주거나, 사용량을 빼고 환불해줘야지!", null)}
                        style={getClauseStyle('5-1')}
                        onMouseEnter={e => { if (!foundClauses.includes('5-1') && scanningClause !== '5-1') e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                        onMouseLeave={e => { if (!foundClauses.includes('5-1') && scanningClause !== '5-1') e.currentTarget.style.background = 'transparent'; }}
                    >
                        {scanningClause === '5-1' && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: `linear-gradient(90deg, transparent, ${purpleTheme.primary}60, transparent)`,
                                animation: 'scanLine 0.6s ease-out'
                            }}></div>
                        )}
                        {foundClauses.includes('5-1') && <span style={{ color: purpleTheme.primary, fontWeight: 'bold' }}>✓ [독소조항] </span>}
                        1항 '프리미엄 킹덤 패스'는 최초 1회 무료 체험 종료 후 자동 갱신됩니다. 해지는 PC버전 내 설정 메뉴에서 가능하나, 결제일 당일 이후 해지 시 해당 기간 이용권은 소멸합니다.
                    </p>

                    {/* 제6조 */}
                    <p
                        onClick={() => handleClauseClick(null, null, "개인정보 제3자 제공에 대한 조항이야. 어떤 정보를 누구에게 주는지 잘 확인해봐.")}
                        style={{ ...getNormalClauseStyle(), marginTop: '15px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><strong>제6조 (개인정보의 제3자 제공)</strong></p>

                    {/* ★ TOXIC: 제6조 1항 */}
                    <p
                        onClick={() => handleClauseClick('6-1', "국내외 제휴 광고사 및 파트너...이건 어디까지 제공하겠다는건지 감도 안오게 범위가 넓네. 거기다 위치정보....를 제공하고....추가로 동의를 취소하면 불이익을 주겠다고 강요하는거잖아.", null)}
                        style={getClauseStyle('6-1')}
                        onMouseEnter={e => { if (!foundClauses.includes('6-1') && scanningClause !== '6-1') e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                        onMouseLeave={e => { if (!foundClauses.includes('6-1') && scanningClause !== '6-1') e.currentTarget.style.background = 'transparent'; }}
                    >
                        {scanningClause === '6-1' && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: `linear-gradient(90deg, transparent, ${purpleTheme.primary}60, transparent)`,
                                animation: 'scanLine 0.6s ease-out'
                            }}></div>
                        )}
                        {foundClauses.includes('6-1') && <span style={{ color: purpleTheme.primary, fontWeight: 'bold' }}>✓ [독소조항] </span>}
                        1항 회사는 원활한 서비스 제공 및 마케팅을 위해 회원의 성명, 연락처, 위치 정보 등을 국내외 제휴 광고사 및 파트너에 제공할 수 있으며, 이는 개인정보처리방침에 명시된 동의 범위 내에서 이루어집니다. 동의 철회 시 일부 맞춤 서비스가 제한될 수 있습니다.
                    </p>

                    {/* 제7조 - NOT TOXIC */}
                    <p
                        onClick={() => handleClauseClick(null, null, "서비스 중단에 대한 조항이야. 내용을 확인해봐.")}
                        style={{ ...getNormalClauseStyle(), marginTop: '15px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><strong>제7조 (서비스의 중단)</strong></p>

                    <p
                        onClick={() => handleClauseClick(null, null, "30일 전 공지 후 종료하고, 유료 재화는 환불 또는 보상한다고 했어. 이건 이용자를 보호하려는 정당한 조항이야.")}
                        style={getNormalClauseStyle()}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >1항 회사는 경영상 또는 기술적 이유로 서비스를 중단할 수 있으며, 이 경우 최소 30일 전 게임 내 및 홈페이지에 공지 후 종료하며, 보유 유료 재화는 잔액 기준 환불 또는 보상합니다.</p>
                </div>

                {/* Found Hints Display */}
                {foundClauses.length > 0 && (
                    <div style={{ background: '#f0f0f0', padding: '15px 20px', borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>🔑 발견한 비밀번호:</span>
                        {foundClauses.map((clause) => {
                            const [article, section] = clause.split('-');
                            return <span key={clause} style={{ background: purpleTheme.primary, color: '#fff', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1rem' }}>{article}-{section}</span>;
                        })}
                        {foundClauses.length === 4 && <span style={{ marginLeft: 'auto', color: 'green', fontWeight: 'bold' }}>✅ 모두 찾았다! 비밀번호: 3-2-4-2-5-1-6-1</span>}
                    </div>
                )}

                {/* Close Button */}
                <button onClick={onClose} style={{ background: '#333', color: '#fff', border: 'none', padding: '15px', fontSize: '1rem', cursor: 'pointer' }}>
                    닫기 - 서랍으로 돌아가기
                </button>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes scanLine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes popIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeInOut {
                    0% { opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(5px); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default TermsModal;
