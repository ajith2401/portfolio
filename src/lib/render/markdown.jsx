// Server component: renders the legacy Markdown `body` via the safe AST parser. No dangerouslySetInnerHTML.
import { Fragment } from "react";
import { parseMarkdown } from "./markdown-ast.js";
import { linkAttrs, imageSrc } from "./urls.js";

function Inline({ nodes }) {
  return (nodes || []).map((n, i) => {
    switch (n.t) {
      case "text":
        return <Fragment key={i}>{n.v}</Fragment>;
      case "br":
        return <br key={i} />;
      case "code":
        return <code key={i}>{n.v}</code>;
      case "strong":
        return <strong key={i}><Inline nodes={n.c} /></strong>;
      case "em":
        return <em key={i}><Inline nodes={n.c} /></em>;
      case "del":
        return <s key={i}><Inline nodes={n.c} /></s>;
      case "link": {
        const a = linkAttrs(n.href);
        if (!a) return <Fragment key={i}><Inline nodes={n.c} /></Fragment>;
        return (
          <a key={i} href={a.href} rel={a.rel} title={n.title || undefined} {...(a.external ? { target: "_blank" } : {})}>
            <Inline nodes={n.c} />
          </a>
        );
      }
      case "image": {
        const src = imageSrc(n.src);
        // eslint-disable-next-line @next/next/no-img-element
        return src ? <img key={i} src={src} alt={n.alt || ""} loading="lazy" decoding="async" /> : null;
      }
      default:
        return null;
    }
  });
}

function Block({ b, ctx }) {
  switch (b.t) {
    case "paragraph":
      return <p><Inline nodes={b.c} /></p>;
    case "heading": {
      const idx = ctx.ids.get(b);
      const Tag = `h${Math.min(b.level + 1, 6)}`;
      return <Tag id={`section-${idx}`}><Inline nodes={b.c} /></Tag>;
    }
    case "quote":
      return <blockquote><Blocks blocks={b.c} ctx={ctx} /></blockquote>;
    case "list": {
      const items = b.items.map((it, i) => <li key={i}><Inline nodes={it} /></li>);
      return b.ordered ? <ol start={b.start !== 1 ? b.start : undefined}>{items}</ol> : <ul>{items}</ul>;
    }
    case "hr":
      return <hr />;
    case "code":
      return <pre><code>{b.v}</code></pre>;
    case "image": {
      const src = imageSrc(b.src);
      if (!src) return null;
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={b.alt || ""} loading="lazy" decoding="async" />
          {b.title ? <figcaption>{b.title}</figcaption> : null}
        </figure>
      );
    }
    default:
      return null;
  }
}

function Blocks({ blocks, ctx }) {
  return blocks.map((b, i) => <Block key={i} b={b} ctx={ctx} />);
}

export function MarkdownContent({ source, poem = false }) {
  const blocks = parseMarkdown(source);
  const ctx = { ids: new Map(blocks.filter((b) => b.t === "heading").map((b, i) => [b, i])) };
  return (
    <div className={`prose-writing${poem ? " prose-poem" : ""}`}>
      <Blocks blocks={blocks} ctx={ctx} />
    </div>
  );
}

export default MarkdownContent;
