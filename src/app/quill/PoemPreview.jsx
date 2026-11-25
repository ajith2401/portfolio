// First-stanza preview for poem cards. Plain text nodes only (React escapes them); line breaks are real <br>s.
// Rendered inside the card's <Link>, so the "Read the poem" cue is a span, not a nested anchor.
export default function PoemPreview({ preview }) {
  if (!preview?.lines?.length) return null;
  const { lines, more } = preview;
  return (
    <div>
      <blockquote
        className="poem-preview border-l-2 border-primary-500 pl-4 py-1 text-[15px] leading-[1.9] text-foreground break-words"
        data-testid="poem-preview"
      >
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 ? <br /> : null}
          </span>
        ))}
        {more ? <span aria-hidden="true" className="block text-secondary-500 leading-none mt-1">…</span> : null}
      </blockquote>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:underline">
        Read the poem <span aria-hidden="true">→</span>
      </span>
    </div>
  );
}
