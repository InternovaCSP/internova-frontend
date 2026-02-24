import { useState, useEffect } from 'react';
import './StartupLoader.css';

export default function StartupLoader() {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2 seconds
        const fadeOutTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 2000);

        // Remove from DOM after transition completes (2s + 0.6s)
        const unmountTimer = setTimeout(() => {
            setIsVisible(false);
        }, 2600);

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(unmountTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`startup-overlay ${isFadingOut ? 'fade-out' : ''}`}>
            <div className="startup-brand">
                <img
                    src="/startup.png"
                    alt="Internova Startup"
                    className="startup-logo-pulse"
                />
            </div>
        </div>
    );
}
