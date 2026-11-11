import type { ArticleBlock, ArticleFaq } from "@/lib/types";
import { ArticleRichText } from "@/components/articles/article-rich-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-foreground/90">
      {blocks.map((block, index) => {
        const key = `b-${index}`;
        if (block.type === "p") {
          return (
            <p key={key}>
              <ArticleRichText text={block.text} />
            </p>
          );
        }
        if (block.type === "h2") {
          return (
            <h2
              key={key}
              className="scroll-mt-24 pt-2 text-2xl font-bold tracking-tight text-foreground"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={key}
              className="scroll-mt-24 pt-1 text-lg font-semibold text-foreground"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const ListTag = block.type === "ol" ? "ol" : "ul";
          return (
            <ListTag
              key={key}
              className={
                block.type === "ol"
                  ? "list-decimal space-y-2 pl-5"
                  : "list-disc space-y-2 pl-5"
              }
            >
              {block.items.map((item, i) => (
                <li key={`${key}-${i}`}>
                  <ArticleRichText text={item} />
                </li>
              ))}
            </ListTag>
          );
        }
        return null;
      })}
    </div>
  );
}

export function ArticleFaqSection({
  faqs,
  title,
}: {
  faqs: ArticleFaq[];
  title: string;
}) {
  if (!faqs.length) return null;
  return (
    <section className="mt-10 border-t pt-8">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      <Accordion>
        {faqs.map((faq, index) => (
          <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
            <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <ArticleRichText text={faq.answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
