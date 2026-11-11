import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Renders plain text with optional `[label](/path)` or external markdown links. */
export function ArticleRichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(LINK_RE);
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const label = match[1];
    const href = match[2];
    const external = /^https?:\/\//i.test(href);
    if (external) {
      nodes.push(
        <a
          key={`${match.index}-${href}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900"
        >
          {label}
        </a>
      );
    } else {
      nodes.push(
        <Link
          key={`${match.index}-${href}`}
          href={href}
          className="font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900"
        >
          {label}
        </Link>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  if (nodes.length === 0) return <>{text}</>;
  return <>{nodes}</>;
}
