'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const EnhancedStarAnimations = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Create shooting stars at random intervals
  useEffect(() => {
    if (!mounted || theme !== 'dark') return;
    
    const shootingStarInterval = setInterval(() => {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      
      // Random position and angle
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 60 - 30; // -30 to 30 degrees
      
      shootingStar.style.left = `${startX}%`;
      shootingStar.style.top = `${startY}%`;
      shootingStar.style.transform = `rotate(${angle}deg)`;
      
      const starsContainer = document.querySelector('.stars-container');
      if (starsContainer) {
        starsContainer.appendChild(shootingStar);
        
        // Remove shooting star after animation completes
        setTimeout(() => {
          if (starsContainer.contains(shootingStar)) {
            starsContainer.removeChild(shootingStar);
          }
        }, 1000);
      }
    }, 5000); // Create a shooting star every 5 seconds
    
    return () => clearInterval(shootingStarInterval);
  }, [mounted, theme]);

  if (!mounted) return null;
  
  // Only render in dark mode
  if (theme !== 'dark') return null;

  return (
    <div className="stars-container fixed inset-0 pointer-events-none overflow-hidden">
      {/* Background stars - different sizes and brightness */}
      {[...Array(100)].map((_, i) => {
        // Determine star size category (small, medium, large)
        const sizeFactor = Math.random();
        const size = sizeFactor > 0.9 ? 3 : sizeFactor > 0.7 ? 2 : 1;
        
        // Determine brightness
        const brightness = Math.random() * 0.7 + 0.3;
        
        // Determine twinkle animation parameters
        const twinkleSpeed = Math.random() * 4 + 2;
        const twinkleDelay = Math.random() * 10;
        
        return (
          <div
            key={i}
            className="star absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: `rgba(255, 255, 255, ${brightness})`,
              boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${brightness / 2})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${twinkleSpeed}s`,
              animationDelay: `${twinkleDelay}s`
            }}
          />
        );
      })}
      
      {/* Star clusters - concentrated areas */}
      {[...Array(5)].map((_, i) => {
        // Random cluster position
        const clusterX = Math.random() * 90 + 5;
        const clusterY = Math.random() * 90 + 5;
        
        return (
          <div key={`cluster-${i}`} className="star-cluster absolute" style={{
            top: `${clusterY}%`,
            left: `${clusterX}%`,
            width: '50px',
            height: '50px'
          }}>
            {[...Array(10)].map((_, j) => {
              const size = Math.random() * 2 + 0.5;
              const brightness = Math.random() * 0.8 + 0.2;
              const distance = Math.random() * 25;
              const angle = Math.random() * 360;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              
              return (
                <div
                  key={j}
                  className="star absolute rounded-full"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: `rgba(255, 255, 255, ${brightness})`,
                    boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${brightness / 2})`,
                    top: `calc(50% + ${y}px)`,
                    left: `calc(50% + ${x}px)`,
                    animationDuration: `${Math.random() * 5 + 3}s`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              );
            })}
          </div>
        );
      })}
      
      {/* Placeholder for dynamically added shooting stars */}
      
      <style jsx>{`
        .star {
          animation: twinkle infinite;
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .shooting-star {
          position: absolute;
          width: 100px;
          height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%);
          animation: shootingStar 1s linear forwards;
        }
        
        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateX(200px) translateY(200px) rotate(0deg);
            opacity: 0;
          }
        }
        
        .star-cluster {
          animation: subtlePulse 20s infinite;
        }
        
        @keyframes subtlePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedStarAnimations;