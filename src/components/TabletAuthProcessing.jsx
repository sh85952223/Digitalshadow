import React, { useState, useEffect } from 'react';

// Helper component for timed log messages
const LogMessage = ({ text, delay }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    return visible ? <div style={{ marginBottom: '8px' }}>{text}</div> : null;
};

// Helper component for delayed phase transition
const RedirectToP6 = ({ onComplete, delay }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, delay);
        return () => clearTimeout(timer);
    }, [delay, onComplete]);
    return null;
};

// P5: Auth Processing (Console Logs) - 인증 후 로딩 화면
const TabletAuthProcessing = ({ onComplete }) => {
    return (
        <div style={{
            width: '100%', height: '100%',
            background: '#000',
            fontFamily: 'monospace',
            color: '#00ff00',
            padding: '40px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '20px' }}>SECURE_BOOT_LOADER v4.0.1</div>
            <LogMessage delay={0} text="> 보안 토큰 생성 중..." />
            <LogMessage delay={800} text="> 기기 소유자 확인 중... OK" />
            <LogMessage delay={1600} text="> 연결된 기기 탐색 중..." />
            <LogMessage delay={2400} text="> 탐색 정확도 계산 중..." />
            <RedirectToP6 onComplete={onComplete} delay={3500} />
        </div>
    );
};

export default TabletAuthProcessing;
