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
      top: `${Math.random() * 50}%`,
      right: `${100 + Math.random() * 300}%`, // Start beyond the right edge
      duration: `${2 + Math.random() * 2}s`,
      delay: `${Math.random() * 5}s`,
      trailLength: 300 + Math.random() * 200,
    }));
  };

  const [stars] = useState(generateStars());
  const [clouds] = useState(generateClouds());

  useEffect(() => {
    setMounted(true);
    setCloudPositions(clouds.map((cloud) => cloud.initialLeft));
    setShootingStars(generateShootingStars());
  }, []);

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
      <div
        className="absolute inset-0 w-full h-full transition-colors duration-1000"
        style={{
          background: isDark
            ? '#0f172a'
            : 'linear-gradient(to bottom, #a4d4fa, #ffffff)',
        }}
      />

      {isDark ? (
        <>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 70% 20%, #1e3a8a 0%, transparent 50%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 30% 80%, #5b21b6 0%, transparent 50%)',
            }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 70% 10%, #fde68a 0%, transparent 50%)',
            }}
          />
          <div
            className="absolute bottom-0 w-full h-1/3 opacity-20"
            style={{
              background: 'linear-gradient(to top, #a7f3d0, transparent)',
            }}
          />
        </>
      )}

      {/* Stars - only visible in dark mode */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <span
            key={star.id}
            style={{
              top: star.top,
              right: star.right,
              animationDelay: star.delay,
              animationDuration: star.duration,
              '--trail-length': `${star.trailLength}px`
            }}
            className="shooting-star"
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