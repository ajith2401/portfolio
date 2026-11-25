// Server component: renders a validated structured document (the shared contract's JSON spec) to semantic HTML.
// No ProseMirror/Tiptap: it only walks the JSON. Invalid content never crashes the page; it falls back to plain text.
import { validateDoc, docToPlainText } from "../content-contract/index.js";
import { Fragment } from "react";
import { linkAttrs, imageSrc } from "./urls.js";

function applyMarks(node, key) {
  let el = node.text;
  const marks = node.marks || [];
  for (const m of marks) {
    if (m.type === "code") el = <code>{el}</code>;
    else if (m.type === "bold") el = <strong>{el}</strong>;
    else if (m.type === "italic") el = <em>{el}</em>;
    else if (m.type === "strike") el = <s>{el}</s>;
  }
  for (const m of marks) {
    if (m.type !== "link") continue;
    const a = linkAttrs(m.attrs?.href);
    if (!a) continue; // unsafe URL: keep the text, drop the link
    el = (
      <a href={a.href} rel={a.rel} title={m.attrs?.title || undefined} {...(a.external ? { target: "_blank" } : {})}>
        {el}
      </a>
    );
  }
  return <Fragment key={key}>{el}</Fragment>;
}


function Inline({ nodes }) {
  return (nodes || []).map((n, i) =>
    n.type === "hardBreak" ? <br key={i} /> : n.type === "text" ? applyMarks(n, i) : null,
  );
}

function Block({ node, ctx }) {
  switch (node.type) {
    case "paragraph": {
      const align = node.attrs?.textAlign;
      return (
        <p className={align ? `ta-${align}` : undefined}>
          <Inline nodes={node.content} />
        </p>
      );
    }
    case "heading": {
      const idx = ctx.ids.get(node);
      // The page title is the h1; document headings start at h2.
      const level = Math.min(Math.max(Number(node.attrs?.level) || 1, 1) + 1, 6);
      const Tag = `h${level}`;
      return (
        <Tag id={`section-${idx}`}>
          <Inline nodes={node.content} />
        </Tag>
      );
    }
    case "blockquote":
      return (
        <blockquote>
          <Blocks nodes={node.content} ctx={ctx} />
        </blockquote>
      );
    case "bulletList":
      return (
        <ul>
          <Blocks nodes={node.content} ctx={ctx} />
        </ul>
      );
    case "orderedList": {
      const start = Number.isInteger(node.attrs?.start) && node.attrs.start !== 1 ? node.attrs.start : undefined;
      return (
        <ol start={start}>
          <Blocks nodes={node.content} ctx={ctx} />
        </ol>
      );
    }
    case "listItem":
      return (
        <li>
          <Blocks nodes={node.content} ctx={ctx} />
        </li>
      );
    case "horizontalRule":
      return <hr />;
    case "codeBlock":
      return (
        <pre>
          <code>{(node.content || []).map((c) => c.text || "").join("")}</code>
        </pre>
      );
    case "image": {
      const src = imageSrc(node.attrs?.src);
      if (!src) return null;
      const caption = node.attrs?.title;
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={node.attrs?.alt || ""} loading="lazy" decoding="async" />
          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      );
    }
    case "poem":
      return (
        <div className={`poem${node.attrs?.align === "center" ? " poem-center" : ""}`} role="group" aria-label="Poem">
          {(node.content || []).map((stanza, i) => (
            <p className="stanza" key={i}>
              <Inline nodes={stanza.content} />
            </p>
          ))}
        </div>
      );
    default:
      return null;
  }
}

function Blocks({ nodes, ctx }) {
  return (nodes || []).map((n, i) => <Block key={i} node={n} ctx={ctx} />);
}

export function StructuredContent({ doc }) {
  let valid = false;
  try {
    valid = validateDoc(doc).ok;
  } catch {
    valid = false;
  }
  if (!valid) {
    let plain = "";
    try {
      plain = docToPlainText(doc);
    } catch {
      plain = "";
    }
    return (
      <div className="prose-writing prose-fallback">
        {plain
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((p, i) => (
            <p key={i} style={{ whiteSpace: "pre-wrap" }}>
              {p}
            </p>
          ))}
      </div>
    );
  }
  const ctx = { ids: new Map(doc.content.filter((n) => n.type === "heading").map((n, i) => [n, i])) };
  return (
    <div className="prose-writing">
      <Blocks nodes={doc.content} ctx={ctx} />
    </div>
  );
}

export default StructuredContent;
