// Safe Markdown renderer for all content pages. Delegates to the AST-based renderer in lib/render:
// no dangerouslySetInnerHTML, no raw HTML pass-through, http/https/mailto/relative URLs only.
import { MarkdownContent } from '@/lib/render/markdown.jsx';

export const MarkdownRenderer = ({ content }) => {
  if (!content) return null;
  return <MarkdownContent source={String(content)} />;
};

export default MarkdownRenderer;
