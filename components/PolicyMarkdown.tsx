import type { ReactNode } from "react";

function cleanEscapes(value: string) {
  return value.replace(/\\([\[\]().#+\-])/g, "$1");
}

function renderInline(value: string, keyPrefix: string): ReactNode[] {
  const source = cleanEscapes(value);
  const parts: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(source))) {
    if (match.index > last) parts.push(source.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;
    if (token.startsWith("**")) parts.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("*")) parts.push(<em key={key}>{token.slice(1, -1)}</em>);
    else if (token.startsWith("`")) parts.push(<code key={key}>{token.slice(1, -1)}</code>);
    else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = link[2];
        const safe = href.startsWith("/") || href.startsWith("https://") || href.startsWith("mailto:") ? href : "#";
        parts.push(<a key={key} href={safe} target={safe.startsWith("https://") ? "_blank" : undefined} rel={safe.startsWith("https://") ? "noreferrer" : undefined}>{link[1]}</a>);
      }
    }
    last = pattern.lastIndex;
  }
  if (last < source.length) parts.push(source.slice(last));
  return parts;
}

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "divider" };

function parse(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (!line.trim()) { i++; continue; }
    if (/^---+$/.test(line.trim())) { blocks.push({ type: "divider" }); i++; continue; }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) { blocks.push({ type: "heading", level: heading[1].length, text: heading[2] }); i++; continue; }
    if (line.trimStart().startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith(">")) quote.push(lines[i++].trimStart().replace(/^>\s?/, ""));
      blocks.push({ type: "quote", text: quote.join(" ") });
      continue;
    }
    if (/^\s*[*+-]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length) {
        const candidate = lines[i];
        const match = ordered ? candidate.match(/^\s*\d+[.)]\s+(.+)$/) : candidate.match(/^\s*[*+-]\s+(.+)$/);
        if (!match) break;
        items.push(match[1]);
        i++;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        const cells = lines[i].trim().slice(1, -1).split("|").map((cell) => cell.trim());
        if (!cells.every((cell) => /^:?-{3,}:?$/.test(cell))) rows.push(cells);
        i++;
      }
      if (rows.length) blocks.push({ type: "table", rows });
      continue;
    }
    const paragraph = [line.trim()];
    i++;
    while (i < lines.length) {
      const next = lines[i];
      if (!next.trim()) break;
      if (/^(#{1,6})\s+/.test(next) || /^\s*[*+-]\s+/.test(next) || /^\s*\d+[.)]\s+/.test(next) || next.trimStart().startsWith(">") || next.trim().startsWith("|") || /^---+$/.test(next.trim())) break;
      paragraph.push(next.trim());
      i++;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }
  return blocks;
}

export default function PolicyMarkdown({ markdown }: { markdown: string }) {
  const blocks = parse(markdown);
  return (
    <div className="policy-markdown">
      {blocks.map((block, index) => {
        const key = `policy-${index}`;
        if (block.type === "divider") return <hr key={key} />;
        if (block.type === "paragraph") return <p key={key}>{renderInline(block.text, key)}</p>;
        if (block.type === "quote") return <blockquote key={key}>{renderInline(block.text, key)}</blockquote>;
        if (block.type === "heading") {
          const text = renderInline(block.text, key);
          if (block.level <= 1) return <h2 key={key}>{text}</h2>;
          if (block.level === 2) return <h2 key={key}>{text}</h2>;
          if (block.level === 3) return <h3 key={key}>{text}</h3>;
          return <h4 key={key}>{text}</h4>;
        }
        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return <List key={key}>{block.items.map((item, itemIndex) => <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>)}</List>;
        }
        const [head, ...body] = block.rows;
        return (
          <div className="policy-table-wrap" key={key} tabIndex={0} role="region" aria-label="Scrollable policy table">
            <table>
              <thead><tr>{head.map((cell, cellIndex) => <th key={`${key}-h-${cellIndex}`}>{renderInline(cell, `${key}-h-${cellIndex}`)}</th>)}</tr></thead>
              <tbody>{body.map((row, rowIndex) => <tr key={`${key}-r-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${key}-${rowIndex}-${cellIndex}`}>{renderInline(cell, `${key}-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
