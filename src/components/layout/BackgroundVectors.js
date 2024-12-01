'use client';

import { useTheme } from 'next-themes';

const BackgroundVectors = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Top Right Vector */}
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

      {/* Side Vector */}
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
  );
};

export default BackgroundVectors;