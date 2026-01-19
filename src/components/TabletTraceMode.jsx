import React from 'react';

// P6: Location Trace Mode (Main Interface) - 위치 추적 모드 화면
const TabletTraceMode = ({ currentTime, onUpgradeClick, onExitClick }) => {
    return (
        <div style={{
            width: '100%', height: '100%',
            background: '#1c1c1e', // Dark charcoal
            display: 'flex', flexDirection: 'column',
            position: 'relative',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Status Bar */}
            <div style={{
                height: '40px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0 20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                background: 'rgba(28, 28, 30, 0.9)',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div>{currentTime}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span>📶</span>
                    <span>28%</span>
                    <span style={{ fontSize: '1.1rem' }}>🔋</span>
                </div>
            </div>

            {/* App Header */}
            <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <span style={{ color: '#8e8e93', fontSize: '1.2rem' }}>←</span>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>Footprint Finder</div>
                    <div style={{ fontSize: '0.75rem', color: '#ff3b30', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>Emergency Trace Mode</div>
                </div>
                <div style={{ width: '20px' }}></div>
            </div>

            {/* Map Area */}
            <div style={{
                flex: 1,
                background: '#0a0a0a',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                {/* Placeholder Map - User will replace, just showing AI direction */}
                <div style={{
                    width: '100%', height: '100%',
                    background: 'radial-gradient(circle at center, #1a2a3a 0%, #000000 100%)',
                    position: 'absolute', opacity: 0.6
                }}></div>

                {/* Search Pulse Animation */}
                <div style={{
                    width: '200px', height: '200px',
                    border: '2px solid rgba(0, 255, 255, 0.5)',
                    borderRadius: '50%',
                    position: 'absolute',
                    animation: 'ping 2.5s infinite'
                }}></div>
                <div style={{
                    width: '100px', height: '100px',
                    background: 'rgba(0, 255, 255, 0.1)',
                    borderRadius: '50%',
                    position: 'absolute',
                    boxShadow: '0 0 20px rgba(0,255,255,0.2)'
                }}></div>

                <div style={{
                    position: 'absolute', top: '20px', left: '20px',
                    background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '5px',
                    fontSize: '0.8rem', color: '#00ffff', border: '1px solid rgba(0,255,255,0.3)'
                }}>
                    최근 신호 감지 범위
                </div>
            </div>

            {/* Bottom Information Panel */}
            <div style={{
                height: '50%',
                background: '#1c1c1e',
                padding: '20px',
                display: 'flex', flexDirection: 'column',
                gap: '15px'
            }}>
                {/* Location Log Cards */}
                <div style={{
                    background: 'rgba(44, 44, 46, 0.6)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '12px', padding: '15px',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#00ffff' }}></div>
                    <div style={{ fontSize: '0.8rem', color: '#8e8e93', marginBottom: '4px' }}>마지막 위치 기록</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>2025.08.24 08:13</span>
                        <span style={{ color: '#ffcc00', fontSize: '0.85rem', border: '1px solid #ffcc00', padding: '2px 6px', borderRadius: '4px' }}>신뢰도: 중간</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, background: '#2c2c2e', padding: '12px', borderRadius: '10px', opacity: 0.5 }}>
                        <div style={{ fontSize: '0.75rem', color: '#8e8e93' }}>이동 경로 기록</div>
                        <div style={{ fontSize: '0.9rem' }}>비활성화</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255, 59, 48, 0.1)', border: '1px solid rgba(255, 59, 48, 0.3)', padding: '12px', borderRadius: '10px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#ff3b30' }}>긴급 모드</div>
                        <div style={{ fontSize: '0.9rem', color: '#ff3b30' }}>User Action Reg</div>
                    </div>
                </div>

                {/* System Dialogue */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '10px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#00ffff', marginBottom: '4px', fontFamily: 'monospace' }}>SYSTEM: 마지막 감지 이후 추가 신호가 확인되지 않았습니다.</div>
                    <div style={{ fontSize: '0.85rem', color: '#00ffff', fontFamily: 'monospace' }}>SYSTEM: 현재 제공 가능한 정보는 제한적입니다.</div>
                </div>

                {/* Monologue Subtitle */}
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <span style={{
                        background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: '4px',
                        color: '#fff', fontSize: '0.9rem', fontStyle: 'italic',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        "생일날…? 왜 하필 생일날 사라진걸까…"
                    </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button style={{
                        width: '100%', padding: '15px',
                        background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
                        border: 'none', borderRadius: '12px',
                        color: '#fff', fontSize: '1rem', fontWeight: 'bold',
                        boxShadow: '0 0 15px rgba(0, 198, 255, 0.4)',
                        cursor: 'pointer'
                    }} onClick={onUpgradeClick}>
                        정확도 올리고 위치 추적
                        <div style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.8, marginTop: '2px' }}>
                            정확도를 높이면 보다 상세한 위치를 확인할 수 있습니다.
                        </div>
                    </button>

                    <button style={{
                        width: '100%', padding: '10px',
                        background: 'transparent',
                        border: '1px solid #3a3a3c', borderRadius: '12px',
                        color: '#8e8e93', fontSize: '0.9rem',
                        cursor: 'pointer'
                    }} onClick={onExitClick}>
                        앱 종료하고 다른 단서 찾기
                        <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '2px' }}>
                            현재 정보만으로는 추적이 어려울 수 있습니다.
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TabletTraceMode;
