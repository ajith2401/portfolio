// app/api/og/route.jsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          padding: '40px',
          justifyContent: 'center',
          backgroundColor: '#FCF6F5',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <div style={{ fontSize: 36, color: '#000000', marginBottom: 10 }}>
          அஜித்குமார்
        </div>
        <div style={{ 
          fontSize: 64, 
          fontWeight: 'bold', 
          color: '#000000',
          marginBottom: 10,
        }}>
          AJITHKUMAR
        </div>
        <div style={{ fontSize: 28, color: '#0ea5e9' }}>
          POET • WRITER • LYRICIST
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}