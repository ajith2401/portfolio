// Single entry point for rendering a public writing's content. Chooses the renderer by contentFormat.
import { resolveContentFormat } from "../content-contract/index.js";
import { StructuredContent } from "./structured.jsx";
import { MarkdownContent } from "./markdown.jsx";

export function WritingContent({ writing }) {
  const format = writing?.contentFormat || resolveContentFormat(writing);
  const lang = writing?.language === "English" ? "en" : "ta";
  return (
    <div className="writing-content" lang={lang} data-format={format}>
      {format === "tiptap" && writing.content ? (
        <StructuredContent doc={writing.content} />
      ) : (
        <MarkdownContent source={writing?.body} poem={writing?.category === "poem"} />
      )}
    </div>
  );
}

export default WritingContent;
