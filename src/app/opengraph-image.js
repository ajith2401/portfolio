// app/opengraph-image.js
import { ImageResponse } from 'next/og'

export const alt = 'Ajithkumar - Poet, Writer & Lyricist'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/jpeg'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #121212, #292929)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '20px' }}>
          Ajithkumar R
        </div>
        <div style={{ fontSize: '36px', opacity: 0.9 }}>
        Full stack developer, Poet, Writer & Lyricist
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}