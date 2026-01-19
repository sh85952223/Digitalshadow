import React from 'react';

const HintBrowser = ({ onClose }) => {
    return (
        <div style={{
            position: 'absolute', inset: 0, background: '#fff', zIndex: 200, display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            {/* Fake Browser Header */}
            <div style={{
                height: '50px', background: '#333', display: 'flex', alignItems: 'center', padding: '0 10px',
                color: '#fff', fontSize: '0.9rem', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, overflow: 'hidden' }}>
                    <span>🔒</span>
                    <div style={{
                        background: '#555', borderRadius: '4px', padding: '4px 10px', flex: 1,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#ccc', fontSize: '0.8rem'
                    }}>
                        m.blog.naver.com/daily_soso/2233...
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', marginLeft: '10px', cursor: 'pointer' }}
                >
                    ✕
                </button>
            </div>

            {/* Browser Content (Scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'sans-serif', color: '#333' }}>

                {/* Naver Blog Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                    <div style={{ fontSize: '0.8rem', color: '#03c75a', fontWeight: 'bold', marginBottom: '4px' }}>소소한 일상 ⭐</div>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', lineHeight: '1.4', margin: 0 }}>
                        [정보공유] 디지털 풋프린트 해지 방법... 진짜 욕나오네요 🤯
                    </h1>
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: '#888' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ddd', marginRight: '8px' }}></div>
                        <span>소소맘 · 10분 전</span>
                    </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '20px', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    <p>안녕하세요, 잇님들! <strong>소소한 일상</strong>입니다. ⭐</p>
                    <p>요즘 '디지털 풋프린트'라고 위치 추적해주는 서비스 많이들 쓰시죠?<br />
                        저도 처음엔 좋아서 가입했는데, 요즘엔 딱히 필요 없는 것 같아서 해지하려고 했거든요?</p>

                    <div style={{ height: '20px' }} />
                    <p style={{ background: '#fff0f0', padding: '10px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                        와... 근데 진짜 <strong>해지 버튼 꽁꽁 숨겨놓은 거 실화인가요?</strong> 🤬<br />
                        진짜 고객센터 전화할 뻔... 30분 동안 헤매다가 드디어 찾아서 공유합니다!
                    </p>
                    <div style={{ height: '20px' }} />

                    <h3>🔥 3분 만에 끝내는 해지 꿀팁</h3>
                    <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />

                    <p><strong>1단계: &lt;계정&gt; 말고 &lt;결제&gt;로 가세요!</strong></p>
                    <p>보통 탈퇴나 해지는 '계정'이나 '프로필'에 있잖아요?<br />
                        여긴 없습니다. (진짜 여기서부터 킹받음 ^^)<br />
                        <span style={{ background: '#ffff00' }}>[설정] 메뉴에서 [결제] 탭을 누르셔야 해요.</span></p>

                    <div style={{ height: '20px' }} />

                    <p><strong>2단계: 스크롤을 끝~까지 내리세요!</strong></p>
                    <p>결제 내역 나오고 카드 정보 나오는데, 거기에도 해지 버튼은 없습니다.<br />
                        화면을 <strong>맨 아래 바닥까지 쭉~~~</strong> 내리세요.<br />
                        그러면 아주 작게, 흐릿한 글씨로 <strong>'서비스 이용 관리'</strong>라고 있어요. 그거 클릭!</p>

                    <div style={{ height: '20px' }} />

                    <p><strong>3단계: '유지하기' 버튼에 속지 마세요! 🙅‍♀️</strong></p>
                    <p>들어가면 파란색으로 [상세 보기]랑 [유지하기] 버튼만 크게 보일 거예요.<br />
                        절대 그거 누르지 마시고요!!<br />
                        그 버튼들 바로 아래, 오른쪽 구석에...<br />
                        보호색마냥 숨겨져 있는 <span style={{ color: '#ef4444', fontWeight: 'bold', textDecoration: 'underline' }}>'이용 상태 변경'</span>이라는 아주 작은 글씨를 찾아야 합니다.</p>

                    <div style={{ height: '20px' }} />

                    <p><strong>4단계: 감정 호소 무시하기 (중요⭐⭐⭐)</strong></p>
                    <p>버튼 누르면 이제 시작입니다.<br />
                        - "정확도가 떨어진다" (협박?)<br />
                        - "흔적이 사라진다" (죄책감 유발;;)<br />
                        - "30% 할인해 주겠다" (솔깃하지만 낚이지 마세요!)</p>

                    <p>계속 막 팝업 뜨면서 <strong>[계속 탐색하기]</strong> 이런 긍정적인 말로 꼬시는데,<br />
                        무조건 <span style={{ background: '#eee', padding: '2px 4px' }}>[이용 중단] / [중단 계속] / [취소 완료]</span> 처럼 부정적인 말만 골라서 눌러야 합니다.<br />
                        좋은 말 누르면 바로 처음으로 돌아가요... 하... 🤦‍♀️</p>

                    <div style={{ height: '30px' }} />
                    <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                        공감과 댓글은 사랑입니다~ 💕
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default HintBrowser;
