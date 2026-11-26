'use client';
import { useState } from 'react';
import Image from 'next/image';

// A cover that is always deliberate: the real image when it loads, otherwise a typographic panel
// (never a broken-image box, never a collapsed/empty block). `src` must come from resolveCoverSrc().
export default function CoverImage({ src, title = '', category = '', sizes, priority = false, className = '', imgClassName = 'object-cover', children }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const glyph = Array.from(String(title).trim())[0] || '✦';
  return (
    <div className={`relative w-full aspect-[16/9] overflow-hidden ${className}`} data-cover={showImage ? 'image' : 'fallback'}>
      {showImage ? (
        <Image src={src} alt={title} fill sizes={sizes} priority={priority} quality={75} className={imgClassName} onError={() => setFailed(true)} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.12] border border-foreground/10 text-foreground/70" role="img" aria-label={title ? `${title} (no cover image)` : 'No cover image'}>
          <span aria-hidden="true" className="text-5xl sm:text-6xl leading-none font-serif opacity-60">{glyph}</span>
          {category ? <span aria-hidden="true" className="text-xs uppercase tracking-[0.2em] opacity-60">{category}</span> : null}
        </div>
      )}
      {children}
    </div>
  );
}
