```javascript
import React, { useState, useEffect, useRef } from 'react';
import '../styles/FlashlightEffect.css';
import AuthCard from './AuthCard';
import LiquidEther from './LiquidEther';

// Simple Typewriter Component internal to this file for now, or could be separate
const Typewriter = ({ text, delay = 50, textstyle = {} }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        setDisplayedText(''); // Reset on text change
        
        const intervalId = setInterval(() => {
            if (index < text.length) {
                // Safe char access
                const char = text.charAt(index); 
                setDisplayedText((prev) => prev + char);
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, delay);

        return () => clearInterval(intervalId);
    }, [text, delay]);

    return (
        <div style={{ ...textstyle, whiteSpace: 'pre-line', textAlign: 'center' }}>
            {displayedText}
        </div>
    );
};

export default function IntroPage({ onComplete }) {
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showAuth, setShowAuth] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // For "Scanning" logic: Track horizontal coverage
    const [scannedZones, setScannedZones] = useState(new Set());
    const TOTAL_ZONES = 15;

    useEffect(() => {
        // Initialize CSS variables
        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', `- 1000px`);
            containerRef.current.style.setProperty('--y', `- 1000px`);
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Always update physics/cursor position
                setMousePos({ x, y });
                containerRef.current.style.setProperty('--x', `${ x } px`);
                containerRef.current.style.setProperty('--y', `${ y } px`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                // Still update center vars just in case
                containerRef.current.style.setProperty('--center-x', `${ centerX } px`);
                containerRef.current.style.setProperty('--center-y', `${ centerY } px`);

                // Light beam offset logic matching CSS
                const lightX = x + 110;
                const lightY = y - 110;

                // Scanning Logic: Only scan if vertical position is near the text (center) AND not already referencing/authenticated
                if (Math.abs(lightY - centerY) < 100 && !showAuth && !isAuthenticated) {
                    // Expanded width to cover "DIGITAL SHADOW" completely (approx 1200-1300px at 8rem)
                    const textStart = centerX - 650;
                    const textWidth = 1300;

                    if (lightX >= textStart && lightX <= textStart + textWidth) {
                        const zoneIndex = Math.floor(((lightX - textStart) / textWidth) * TOTAL_ZONES);

                        setScannedZones(prev => {
                            if (prev.has(zoneIndex)) return prev;
                            const next = new Set(prev);
                            next.add(zoneIndex);
                            return next;
                        });
                    }
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [showAuth, isAuthenticated]);

    // Check scanning progress
    useEffect(() => {
        const progress = (scannedZones.size / TOTAL_ZONES) * 100;
        if (progress >= 100 && !showAuth) {
            setShowAuth(true);
        }
    }, [scannedZones, showAuth]);

    const handleAuth = () => {
        setIsAuthenticated(true);
        // Removed auto-complete timeout, now waits for user to click "ENTRANCE"
    };

    if (isAuthenticated) {
        return (
            <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', cursor: 'default' }}>
                <LiquidEther
                    mouseForce={20}
                    cursorSize={100}
                    isViscous
                    viscous={30}
                    colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
                    autoDemo
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    isBounce={false}
                    resolution={0.5}
                />
                
                {/* Welcome Content Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                }}>
                    <Typewriter
                        text={"디지털 본부에 오신 것을\n환영합니다. 요원님."}
                        delay={80}
                        textstyle={{
                            fontSize: '3.5rem',
                            fontWeight: '800',
                            color: '#ffffff',
                            fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
                            textShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                            marginBottom: '4rem',
                            lineHeight: '1.4'
                        }}
                    />
                    
                    {/* Glassmorphism Entrance Button */}
                    <button
                        onClick={onComplete}
                        className="entrance-btn"
                        style={{
                            padding: '1.2rem 4rem',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            color: 'white',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            letterSpacing: '0.2em',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
                        }}
                    >
                        ENTRANCE
                    </button>
                    
                    {/* Fade-in animation style for button if needed, or keeping it simple */}
                    <style>{`
    .entrance - btn {
    animation: fadeIn 2s ease - out 2s forwards;
    opacity: 0;
}
@keyframes fadeIn {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
}
`}</style>
                </div>
            </div>
        );
    }

    return (
        <div
            className="intro-container"
            ref={containerRef}
            style={{
                cursor: 'none' /* Always hide system cursor, we use custom ones */
            }}
        >
            {/* Show Text and Flashlight only when NOT in Auth mode */}
            {!showAuth && (
                <>
                    {/* Layer 1: Base Text */}
                    <div className="text-base">DIGITAL SHADOW</div>

                    {/* Layer 2: Illuminated Text */}
                    <div className="text-illuminated">
                        DIGITAL SHADOW
                    </div>

                    {/* Layer 3: Flashlight Beam */}
                    <div className="flashlight-beam"></div>

                    {/* Layer 4: Flashlight Cursor Image */}
                    <div className="custom-cursor">
                        <img src="/flashlight.png" alt="Flashlight" className="flashlight-icon-img" />
                    </div>
                </>
            )}

            {/* Layer 5: Digital Cursor - Only when Auth is visible */}
            {showAuth && <div className="digital-cursor"></div>}

            {/* Auth Card Overlay */}
            {showAuth && (
                <div style={{ position: 'absolute', zIndex: 1000 }}>
                    <AuthCard onAuthenticate={handleAuth} />
                </div>
            )}
        </div>
    );
}
