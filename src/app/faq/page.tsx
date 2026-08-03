import { PageHeader } from "@/components/shared/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems, policies } from "@/lib/data/content";

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="FAQ & Policies"
        subtitle="Everything you need to know about booking, payments, and our service standards."
      />
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 lg:px-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
          <Accordion className="w-full">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Service Policies</h2>
          <Accordion className="w-full">
            {policies.map((policy) => (
              <AccordionItem key={policy.id} value={policy.id}>
                <AccordionTrigger>{policy.title}</AccordionTrigger>
                <AccordionContent>{policy.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </>
  );
}
