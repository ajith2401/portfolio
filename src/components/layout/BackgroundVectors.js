'use client';

import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../theme/themeProvider';

const BackgroundVectors = () => {
  const { theme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);
  const [cloudPositions, setCloudPositions] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  const isDark = theme === 'dark';

  // Generate random positions for stars
  const generateStars = () => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
  };

  // Generate random positions for clouds
  const generateClouds = () => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      initialLeft: -20 - i * 5,
      top: `${10 + Math.random() * 30}%`,
      width: 80 + Math.random() * 40,
      height: 40 + Math.random() * 20,
      speed: 0.02 + Math.random() * 0.01,
      opacity: 0.7 + Math.random() * 0.3,
    }));
  };

  // Generate shooting stars with more variation
  const generateShootingStars = () => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      right: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`,
      duration: `${1 + Math.random() * 3}s`,
      delay: `${Math.random() * 2}s`,
      trailLength: 300 + Math.random() * 200,
    }));
  };

  const [stars] = useState(generateStars());
  const [clouds] = useState(generateClouds());

  useEffect(() => {
    setMounted(true);
    setCloudPositions(clouds.map((cloud) => cloud.initialLeft));
    setShootingStars(generateShootingStars());
  }, [clouds]);

  // Animate clouds when in light mode
  useEffect(() => {
    if (!mounted || isDark) return;

    const intervalId = setInterval(() => {
      setCloudPositions((prevPositions) =>
        prevPositions.map((pos, index) => {
          const newPos = pos + clouds[index].speed;
          return newPos > 120 ? -20 : newPos; // Reset cloud position when off-screen
        })
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, [mounted, isDark, clouds]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
      {/* Layered radial gradients for depth */}
      <div
        className="absolute inset-0 w-full h-full transition-colors duration-1000"
        style={{
          background: isDark
            ? '#0f172a'
            : 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        }}
      />
      {/* Extra radial overlays for premium look */}
      <div className="absolute inset-0 opacity-30" style={{background: 'radial-gradient(circle at 70% 10%, #e0c3fc 0%, transparent 50%)'}} />
      <div className="absolute inset-0 opacity-20" style={{background: 'radial-gradient(circle at 30% 80%, #a78bfa 0%, transparent 50%)'}} />
      {/* Morphing blobs */}
      {isDark ? (
        <>
          <div className="morph-blob" style={{top: '10%', left: '5%', width: '320px', height: '220px'}} />
          <div className="morph-blob" style={{bottom: '8%', right: '8%', width: '260px', height: '180px'}} />
        </>
      ) : (
        <>
          <div className="morph-blob-light" style={{top: '8%', left: '4%', width: '340px', height: '240px'}} />
          <div className="morph-blob-light" style={{bottom: '10%', right: '10%', width: '280px', height: '200px'}} />
          <div className="morph-blob-light" style={{top: '40%', left: '60%', width: '180px', height: '120px'}} />
        </>
      )}
      {/* Floating particles */}
      {(isDark ? [...Array(18)] : [...Array(28)]).map((_, i) => (
        <div key={i} className={isDark ? 'particle' : 'particle-light'} style={{
          top: `${Math.random()*90}%`,
          left: `${Math.random()*90}%`,
          width: `${isDark ? 12 : 18 + Math.random()*18}px`,
          height: `${isDark ? 12 : 18 + Math.random()*18}px`,
          animationDelay: `${Math.random()*8}s`,
        }} />
      ))}
      {/* Shooting stars - visible in both modes */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        {shootingStars.map((star, index) => (
          <span
            key={star.id}
            style={{
              top: star.top,
              right: star.right,
              animationDelay: star.delay,
              animationDuration: star.duration,
              '--trail-length': `${star.trailLength}px`,
            }}
            className={isDark ? 'shooting-star' : 'shooting-star-light'}
          />
        ))}
      </div>
      {/* Clouds - only visible in light mode */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        {clouds.map((cloud, index) => (
          <div
            key={cloud.id}
            className="absolute"
            style={{
              left: `${cloudPositions[index]}%`,
              top: cloud.top,
              opacity: cloud.opacity,
              transition: 'opacity 1s ease',
            }}
          >
            <svg
              width={cloud.width}
              height={cloud.height}
              viewBox="0 0 200 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30 80 Q40 60 60 70 Q70 40 100 50 Q140 30 160 60 Q180 40 190 70 Q200 60 200 80 L30 80 Z"
                fill="white"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundVectors;