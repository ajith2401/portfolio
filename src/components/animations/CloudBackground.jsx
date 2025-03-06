'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import EnhancedStarAnimations from './StarryBackground';


const ImprovedSkyBackground = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Original blurred vector backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
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
      </div>

      {/* Enhanced star animations (dark mode only) */}
      {theme === 'dark' && <EnhancedStarAnimations />}

      {/* Clouds for light mode */}
      {theme === 'light' && (
        <div className="clouds-container fixed inset-0 pointer-events-none overflow-hidden">
          {/* Milky Way effect for dark mode */}
          <div className="milky-way"></div>
          
          {/* Nebula effects */}
          <div className="nebula" style={{ 
            width: '300px', 
            height: '300px', 
            top: '20%', 
            left: '70%' 
          }}></div>
          
          <div className="nebula" style={{ 
            width: '200px', 
            height: '200px', 
            top: '60%', 
            left: '30%',
            background: 'radial-gradient(circle at center, rgba(255, 100, 100, 0.2), rgba(255, 100, 100, 0.1) 50%, transparent 70%)'
          }}></div>
          
          {/* Clouds */}
          {[...Array(8)].map((_, i) => {
            const width = Math.random() * 150 + 100;
            const height = Math.random() * 60 + 40;
            const top = Math.random() * 60 + 10;
            const delay = Math.random() * 40;
            const duration = Math.random() * 60 + 40;
            const opacity = Math.random() * 0.4 + 0.1;
            
            return (
              <div
                key={i}
                className="cloud absolute bg-white rounded-full"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  top: `${top}%`,
                  left: `-${Math.random() * 20 + 10}%`,
                  opacity: opacity,
                  animation: `cloudMove ${duration}s linear infinite ${delay}s`,
                  filter: 'blur(8px)',
                }}
              />
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes cloudMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 300px)); }
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
      `}</style>
    </>
  );
};

export default ImprovedSkyBackground;