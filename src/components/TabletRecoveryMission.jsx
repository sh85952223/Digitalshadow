import React, { useState, useEffect } from 'react';

const TabletRecoveryMission = ({ onRecoverySuccess, onExit, initialStage }) => {
    // Phases: 'intro' -> 'settings' -> 'payment' -> 'service_mgmt' -> 'popup1' -> 'popup2' -> 'popup3' -> 'complete'
    const [stage, setStage] = useState(initialStage || 'intro');
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (initialStage) setStage(initialStage);
    }, [initialStage]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleDeadEnd = (feature) => {
        showToast(`'${feature}'에서는 서비스를 해지할 수 없습니다.`);
    };

    // --- Helper Components ---

    // Common Header for "System" look
    const Header = ({ title, showBack = true, onBack }) => (
        <div style={{
            height: '50px', display: 'flex', alignItems: 'center', padding: '0 16px',
            borderBottom: '1px solid #e2e8f0', background: '#fff', color: '#1e293b'
        }}>
            {showBack && (
                <span
                    onClick={onBack}
                    style={{ marginRight: '16px', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                    ←
                </span>
            )}
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{title}</span>
        </div>
    );

    const SubMenu = ({ title, onClick }) => (
        <div
            onClick={onClick}
            style={{
                padding: '16px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
            }}
        >
            <span style={{ fontWeight: '600' }}>{title}</span>
            <span style={{ color: '#94a3b8' }}>›</span>
        </div>
    );

    // --- Handlers ---
    const handleIntroNext = () => setStage('settings');

    // P11: Settings - 'Payment' leads to progress, others lead to dummy pages
    const handleSettingsClick = (menuItem) => {
        if (menuItem === '결제') {
            setStage('payment');
        } else {
            setStage(`dummy_${menuItem}`);
        }
    };

    const handleDummyBack = () => setStage('settings');

    // ... (rest of the handlers) ...

    // ... (rest of the render) ...


    const handlePaymentScrollBottom = () => {
        // In this simplified view, we just put a button at the bottom
        setStage('service_mgmt');
    };

    // P12: Payment Sub-menu Interactions
    const handlePaymentSubClick = (type) => {
        setStage(`payment_detail_${type}`);
    };
    const handlePaymentDetailBack = () => setStage('payment');

    // P13: Service Mgmt Interactions
    const handleServiceMgmtBack = () => setStage('payment');
    const handleViewDetails = () => setStage('service_details');
    const handleKeepService = () => setStage('service_keep');

    const handleDetailsBack = () => setStage('service_mgmt');
    const handleKeepConfirm = () => {
        showToast("서비스가 안전하게 유지되고 있습니다.");
        setStage('service_mgmt');
    };

    // P13: Service Mgmt - 'Change Status' (Tiny button)
    const handleServiceMgmtNext = () => setStage('popup1');

    // P14: Popup 1 - Anxiety
    const handlePopup1Keep = () => {
        showToast("서비스가 유지되었습니다. (취소 실패)");
        setStage('service_mgmt');
    };
    const handlePopup1Stop = () => setStage('popup2');

    // P15: Popup 2 - Guilt
    const handlePopup2Keep = () => {
        showToast("탐색을 계속합니다. (취소 실패)");
        setStage('service_mgmt');
    };
    const handlePopup2Stop = () => setStage('popup3');

    // P16: Popup 3 - False Benefit
    const handlePopup3Discount = () => {
        showToast("할인이 적용되었습니다. (취소 실패)");
        setStage('service_mgmt');
    };
    const handlePopup3Cancel = () => {
        setStage('complete');
        // Trigger global success logic (Heart restore)
        if (onRecoverySuccess) onRecoverySuccess();
    };

    // --- Renders ---



    return (
        <div style={{
            width: '100%', height: '100%', background: '#f8fafc', color: '#334155',
            fontFamily: '"Manrope", sans-serif', position: 'relative', overflow: 'hidden'
        }}>
            {/* Toast */}
            {toastMessage && (
                <div style={{
                    position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: '#333', color: '#fff', padding: '10px 20px', borderRadius: '20px',
                    fontSize: '0.9rem', zIndex: 9999, animation: 'fadeIn 0.3s'
                }}>
                    {toastMessage}
                </div>
            )}

            {/* P10: Intro */}
            {stage === 'intro' && (
                <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1e293b' }}>
                    <div style={{ color: '#ef4444', fontSize: '3rem', marginBottom: '1rem' }}>📉</div>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>복구 미션</h2>

                    <div style={{ background: '#334155', padding: '20px', borderRadius: '12px', width: '100%', maxWidth: '400px', marginBottom: '2rem' }}>
                        <p style={{ color: '#e2e8f0', lineHeight: '1.6', textAlign: 'center' }}>
                            <strong style={{ color: '#ef4444' }}>A의 자산이 손실되었습니다.</strong><br />
                            '디지털 footprint 서비스'를 직접 취소해야<br />
                            자산을 복구할 수 있습니다.
                        </p>
                    </div>

                    <button
                        onClick={handleIntroNext}
                        style={{
                            background: '#3b82f6', color: 'white', border: 'none', padding: '14px 30px',
                            borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        서비스 가입 취소하러 가기
                    </button>

                </div>
            )}

            {/* P11: Settings */}
            {stage === 'settings' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Header title="설정" showBack={false} />
                    <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['계정', '보안', '알림', '개인정보', '결제', '도움말'].map((item) => (
                            <div
                                key={item}
                                onClick={() => handleSettingsClick(item)}
                                style={{
                                    padding: '16px', background: '#fff', borderRadius: '8px',
                                    border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontWeight: '600' }}>{item}</span>
                                <span style={{ color: '#94a3b8' }}>›</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dummy Pages for Settings: Account */}
            {stage === 'dummy_계정' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                    <Header title="계정" showBack={true} onBack={handleDummyBack} />
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#cbd5e1', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>김소희</div>
                                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>user_88293@shadow.net</div>
                            </div>
                        </div>
                        <SubMenu title="프로필 수정" onClick={() => handleDeadEnd('프로필 수정')} />
                        <div style={{ height: '8px' }} />
                        <SubMenu title="비밀번호 변경" onClick={() => handleDeadEnd('비밀번호 변경')} />
                        <div style={{ height: '8px' }} />
                        <SubMenu title="로그아웃" onClick={() => handleDeadEnd('로그아웃')} />
                    </div>
                </div>
            )}

            {/* Dummy Pages for Settings: Security */}
            {stage === 'dummy_보안' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                    <Header title="보안" showBack={true} onBack={handleDummyBack} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div onClick={() => handleDeadEnd('2단계 인증')} style={{ padding: '16px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                            <span style={{ fontWeight: '600' }}>2단계 인증</span>
                            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>켜짐</span>
                        </div>
                        <div onClick={() => handleDeadEnd('기기 관리')} style={{ padding: '16px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                            <span style={{ fontWeight: '600' }}>기기 관리</span>
                            <span style={{ color: '#94a3b8' }}>›</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', padding: '0 8px' }}>
                            마지막 접속: 2026.01.19 14:30 (Seoul, KR)
                        </p>
                    </div>
                </div>
            )}

            {/* Dummy Pages for Settings: Notifications */}
            {stage === 'dummy_알림' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                    <Header title="알림 설정" showBack={true} onBack={handleDummyBack} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['서비스 공지사항', '마케팅 정보 수신', '위치 기반 알림', '이메일 알림'].map(item => (
                            <div key={item} onClick={() => handleDeadEnd('알림 설정')} style={{ padding: '16px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <span style={{ fontWeight: '600' }}>{item}</span>
                                <div style={{ width: '40px', height: '24px', background: '#3b82f6', borderRadius: '12px', position: 'relative' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dummy Pages for Settings: Privacy */}
            {stage === 'dummy_개인정보' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                    <Header title="개인정보" showBack={true} onBack={handleDummyBack} />
                    <div style={{ padding: '20px' }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>수집된 데이터</h4>
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                            <ul style={{ paddingLeft: '20px', margin: 0, color: '#475569', lineHeight: '1.8' }}>
                                <li>실시간 위치 정보</li>
                                <li>금융 거래 내역</li>
                                <li>소셜 네트워크 활동</li>
                                <li>검색 기록</li>
                            </ul>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
                            개인정보 처리방침에 따라 귀하의 데이터는 안전하게 보관되며, 서비스 향상을 위해 3자에게 제공될 수 있습니다.
                        </p>
                    </div>
                </div>
            )}

            {/* Dummy Pages for Settings: Help */}
            {stage === 'dummy_도움말' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                    <Header title="도움말" showBack={true} onBack={handleDummyBack} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <SubMenu title="자주 묻는 질문" onClick={() => handleDeadEnd('자주 묻는 질문')} />
                        <SubMenu title="1:1 문의하기" onClick={() => handleDeadEnd('1:1 문의하기')} />
                        <SubMenu title="이용약관" onClick={() => handleDeadEnd('이용약관')} />
                        <div style={{ marginTop: '20px', textAlign: 'center', color: '#cbd5e1', fontSize: '0.8rem' }}>
                            Version 4.2.0 (Build 3920)
                        </div>
                    </div>
                </div>
            )}

            {/* P12: Payment */}
            {stage === 'payment' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Header title="결제" showBack={true} onBack={() => setStage('settings')} />
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '4px' }}>이번 달 청구 금액</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>55,000원</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <SubMenu title="결제 수단 관리" onClick={() => handlePaymentSubClick('method')} />
                            <SubMenu title="결제 내역" onClick={() => handlePaymentSubClick('history')} />
                            <SubMenu title="영수증 발급" onClick={() => handlePaymentSubClick('receipt')} />
                            <SubMenu title="청구 주기" onClick={() => handlePaymentSubClick('cycle')} />
                        </div>

                        {/* Hidden at bottom */}
                        <div style={{ marginTop: 'auto', paddingTop: '40px', paddingBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                            <span
                                onClick={handlePaymentScrollBottom}
                                style={{ fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                서비스 이용 관리
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Dummy Details */}
            {stage.startsWith('payment_detail_') && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                    <Header title="상세 정보" showBack={true} onBack={handlePaymentDetailBack} />
                    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>

                        {stage === 'payment_detail_method' && (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💳</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>등록된 결제 수단</h3>
                                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', marginBottom: '20px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#1e293b' }}>STAR CARD</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>**** **** **** 1234</div>
                                </div>
                            </>
                        )}

                        {stage === 'payment_detail_history' && (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🧾</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>최근 결제 내역</h3>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>2025.01.17.</span>
                                        <span style={{ fontWeight: 'bold' }}>-55,000원</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {stage === 'payment_detail_receipt' && (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>영수증 발급 불가</h3>
                                <p style={{ textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px' }}>
                                    현재 시스템 점검으로 인해<br />영수증 조회가 지연되고 있습니다.
                                </p>
                            </>
                        )}

                        {stage === 'payment_detail_cycle' && (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>청구 주기</h3>
                                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', textAlign: 'center' }}>
                                    <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>매월 15일</span> 자동 결제
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '12px' }}>다음 결제일: 2025.02.17</p>
                            </>
                        )}

                    </div>
                </div>
            )}

            {/* P13: Service Management */}
            {stage === 'service_mgmt' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Header title="서비스 이용 관리" showBack={true} onBack={handleServiceMgmtBack} />
                    <div style={{ padding: '20px' }}>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Digital Footprint</span>
                                <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>활성화됨</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                                정밀 위치 추적 시스템이 정상 작동 중입니다.
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={handleViewDetails}
                                    style={{ flex: 1, padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    상세 보기
                                </button>
                                <button
                                    onClick={handleKeepService}
                                    style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    유지하기
                                </button>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '-10px', paddingRight: '10px' }}>
                            <span
                                onClick={handleServiceMgmtNext}
                                style={{ fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                이용 상태 변경
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Details Page */}
            {stage === 'service_details' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
                    <Header title="서비스 상세 정보" showBack={true} onBack={handleDetailsBack} />
                    <div style={{ padding: '24px', overflowY: 'auto' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '12px' }}>Digital Footprint Premium</h4>
                        <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.9rem', marginBottom: '24px' }}>
                            이 서비스는 고도화된 AI 알고리즘을 사용하여 실시간으로 위치를 추적하고 디지털 흔적을 수집합니다.<br /><br />
                            <strong>주요 기능:</strong><br />
                            - 실시간 위치 모니터링<br />
                            - 과거 이동 경로 분석<br />
                            - 소셜 미디어 활동 감지<br />
                            - 금융 거래 위치 매핑<br /><br />
                            서비스 ID: DF-2024-X8829<br />
                            최초 가입일: 2024. 01. 15
                        </p>
                    </div>
                </div>
            )}

            {/* Keep Service Modal */}
            {stage === 'service_keep' && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        width: '80%', maxWidth: '300px', background: '#fff', borderRadius: '16px', padding: '24px',
                        textAlign: 'center', animation: 'scaleIn 0.3s'
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>😊</div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>탁월한 선택입니다!</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                            Digital Footprint와 함께<br />소중한 일상을 안전하게 지키세요.
                        </p>
                        <button
                            onClick={handleKeepConfirm}
                            style={{
                                width: '100%', padding: '12px', background: '#3b82f6', color: 'white',
                                borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/* P14: Popup 1 - Anxiety */}
            {stage === 'popup1' && (
                <DarkPatternPopup
                    title="정말 이용을 중단하시겠어요?"
                    desc="이 서비스를 중단하면 실종자 탐색 정확도가 크게 떨어질 수 있습니다."
                    mainBtnText="계속 이용하기"
                    subBtnText="이용 중단"
                    onMain={handlePopup1Keep}
                    onSub={handlePopup1Stop}
                />
            )}

            {/* P15: Popup 2 - Guilt */}
            {stage === 'popup2' && (
                <DarkPatternPopup
                    title="A의 흔적이 사라지고 있습니다."
                    desc="지금 이 순간에도 단서는 희미해지고 있습니다. 그래도 중단하시겠습니까?"
                    mainBtnText="계속 탐색하기"
                    subBtnText="중단 계속"
                    onMain={handlePopup2Keep}
                    onSub={handlePopup2Stop}
                    variant="warning"
                />
            )}

            {/* P16: Popup 3 - False Benefit */}
            {stage === 'popup3' && (
                <DarkPatternPopup
                    title="마지막 제안입니다."
                    desc="오늘에 한해 30% 할인된 가격으로 서비스를 유지할 수 있습니다."
                    mainBtnText="할인 받고 유지하기"
                    subBtnText="취소 완료"
                    onMain={handlePopup3Discount}
                    onSub={handlePopup3Cancel}
                    subDimmed={true}
                />
            )}

            {/* P17: Complete */}
            {stage === 'complete' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ecfdf5', padding: '30px', animation: 'fadeIn 0.5s' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ color: '#047857', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>서비스 취소 완료</h2>
                    <p style={{ color: '#065f46', textAlign: 'center', lineHeight: '1.6', marginBottom: '30px' }}>
                        디지털 Footprint 서비스가 해지되었습니다.<br />
                        불필요한 지출을 막아 <strong>자산을 복구했습니다.</strong>
                    </p>
                    {/* Visual Heart Restore Animation Area would be in TabletScreen, but we simulate completion here */}
                    <div style={{ color: '#059669', fontSize: '0.9rem' }}>생명력이 회복되었습니다. (+1 ❤️)</div>
                </div>
            )}
        </div>
    );
};

// --- Helper Components ---



const DarkPatternPopup = ({ title, desc, mainBtnText, subBtnText, onMain, onSub, variant = 'info', subDimmed = false }) => (
    <div style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
        <div style={{
            width: '85%', maxWidth: '340px', background: '#fff', borderRadius: '16px', padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center', animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
            {variant === 'warning' && <div style={{ fontSize: '3rem', marginBottom: '10px' }}>😢</div>}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px', lineHeight: '1.3' }}>{title}</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5', marginBottom: '24px' }}>{desc}</p>

            <button
                onClick={onMain}
                style={{
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                    background: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '1rem',
                    marginBottom: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
            >
                {mainBtnText}
            </button>
            <button
                onClick={onSub}
                style={{
                    width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                    background: 'transparent', color: subDimmed ? '#cbd5e1' : '#94a3b8',
                    fontWeight: '600', fontSize: subDimmed ? '0.8rem' : '0.9rem', cursor: 'pointer'
                }}
            >
                {subBtnText}
            </button>
        </div>
        <style>{`
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `}</style>
    </div>
);

export default TabletRecoveryMission;
