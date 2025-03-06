'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const AnimatedSkyBackground = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Original blurred vector backgrounds */}
      <div 
        className="absolute w-[777.57px] h-[600.48px]"
        style={{
          top: '-500.83px',
          left: '348px',
          transform: 'rotate(77.74deg)',
          opacity: 0.65
        }}
      >
        <div 
          className="w-full h-full rounded-[100px]"
          style={{
            background: theme === 'dark' ? '#2F2F2F' : '#FFF6E8',
            filter: 'blur(200px)'
          }}
        />
      </div>

      <div 
        className="absolute w-[597px] h-[645px]"
        style={{
          top: '100px',
          left: '-534px',
          opacity: 0.65
        }}
      >
        <div 
          className="w-full h-full rounded-[100px]"
          style={{
            background: theme === 'dark' ? '#2F2F2F' : '#FFF6E8',
            filter: 'blur(150px)'
          }}
        />
      </div>

      {/* Stars for dark mode */}
      {theme === 'dark' && (
        <div className="stars-container absolute inset-0">
          {/* Regular twinkling stars */}
          {[...Array(75)].map((_, i) => (
            <div
              key={i}
              className="star absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.8 + 0.2,
                animation: `starTwinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 5}s`
              }}
            />
          ))}

          {/* Larger stars with glow effect */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`glow-${i}`}
              className="star-glow absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 2 + 'px',
                height: Math.random() * 2 + 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.7)',
                animation: `starGlow ${Math.random() * 6 + 4}s infinite ${Math.random() * 5}s`
              }}
            />
          ))}

          {/* Shooting stars that appear occasionally */}
          <div className="shooting-stars-container">
            {[...Array(3)].map((_, i) => (
              <div
                key={`shooting-${i}`}
                className="shooting-star"
                style={{
                  top: `${Math.random() * 50}%`,
                  left: `${Math.random() * 50}%`,
                  animationDelay: `${i * 7 + Math.random() * 15}s`,
                  animationDuration: '1.5s',
                  transform: `rotate(${Math.random() * 45 - 22.5}deg)`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Clouds for light mode */}
      {theme === 'light' && (
        <div className="clouds-container absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="cloud absolute bg-white rounded-full"
              style={{
                width: Math.random() * 200 + 100 + 'px',
                height: Math.random() * 80 + 50 + 'px',
                top: Math.random() * 60 + '%',
                left: `-${Math.random() * 20 + 10}%`,
                opacity: Math.random() * 0.4 + 0.1,
                animation: `cloudMove ${Math.random() * 80 + 60}s linear infinite`,
                filter: 'blur(8px)',
                animationDelay: `${Math.random() * 40}s`
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes starTwinkle {
          0%, 100% { 
            opacity: 0.1; 
            transform: scale(0.8);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes starGlow {
          0%, 100% { 
            opacity: 0.7;
            box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.5);
          }
          50% { 
            opacity: 1;
            box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.8);
          }
        }
        
        @keyframes cloudMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 300px)); }
        }
        
        .cloud {
          position: relative;
        }

        .cloud::before,
        .cloud::after {
          content: '';
          position: absolute;
          background: white;
          border-radius: 50%;
        }
        
        .cloud::before {
          width: 60%;
          height: 100%;
          top: -50%;
          left: 20%;
        }
        
        .cloud::after {
          width: 50%;
          height: 100%;
          top: -30%;
          right: 15%;
        }

        .shooting-star {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
          opacity: 0;
          animation: shootingStar infinite;
        }

        @keyframes shootingStar {
          0% {
            opacity: 0;
            transform: translateX(0) translateY(0);
          }
          10% {
            opacity: 1;
          }
          40% {
            opacity: 1;
          }
          70% {
            opacity: 0;
            transform: translateX(200px) translateY(200px);
          }
          100% {
            opacity: 0;
            transform: translateX(200px) translateY(200px);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedSkyBackground;