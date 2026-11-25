'use client';
// The only client JS for the reading experience: preferences (size, theme), progress, contents list.
// The article itself is server-rendered and passed in as children.
import { useCallback, useEffect, useRef, useState } from 'react';

const SIZES = [16, 18, 20, 22, 24, 28];
const THEMES = [
  { id: 'auto', label: 'Auto' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'sepia', label: 'Sepia' },
];
const KEY = 'reader-prefs-v1';

function load() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || '{}');
    return {
      size: SIZES.includes(p.size) ? p.size : 20,
      theme: THEMES.some((t) => t.id === p.theme) ? p.theme : 'auto',
    };
  } catch {
    return { size: 20, theme: 'auto' };
  }
}

export default function ReaderShell({ headings = [], lang = 'ta', children }) {
  const [prefs, setPrefs] = useState({ size: 20, theme: 'auto' });
  const [progress, setProgress] = useState(0);
  const articleRef = useRef(null);

  useEffect(() => { setPrefs(load()); }, []);

  const update = useCallback((patch) => {
    setPrefs((cur) => {
      const next = { ...cur, ...patch };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
      return next;
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.25, 0), Math.max(total, 1));
      setProgress(total > 0 ? Math.round((done / total) * 100) : 100);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const idx = SIZES.indexOf(prefs.size);
  const showToc = headings.length >= 3;

  return (
    <div className="reader" data-reader-theme={prefs.theme} style={{ '--reader-size': `${prefs.size}px` }}>
      <div
        className="reader-progress"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="reader-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="reader-toolbar" role="toolbar" aria-label="Reading preferences">
        <div className="reader-group" role="group" aria-label="Text size">
          <button type="button" onClick={() => update({ size: SIZES[idx - 1] })} disabled={idx <= 0} aria-label="Decrease text size">A−</button>
          <span className="reader-size" aria-live="polite">{prefs.size}px</span>
          <button type="button" onClick={() => update({ size: SIZES[idx + 1] })} disabled={idx >= SIZES.length - 1} aria-label="Increase text size">A+</button>
        </div>
        <div className="reader-group" role="radiogroup" aria-label="Reading theme">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={prefs.theme === t.id}
              data-active={prefs.theme === t.id}
              onClick={() => update({ theme: t.id })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {showToc && (
        <nav className="reader-toc" aria-label="Contents">
          <details>
            <summary>{lang === 'en' ? 'Contents' : 'உள்ளடக்கம்'}</summary>
            <ol>
              {headings.map((h, i) => (
                <li key={i} style={{ marginInlineStart: `${Math.max(h.level - 1, 0) * 0.75}rem` }}>
                  <a href={`#section-${i}`}>{h.text}</a>
                </li>
              ))}
            </ol>
          </details>
        </nav>
      )}

      <div ref={articleRef} className="reader-article">{children}</div>
    </div>
  );
}
