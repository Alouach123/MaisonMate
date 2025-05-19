
import ContactForm from '@/components/support/contact-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: "What are your shipping options?",
    answer: "We offer standard (5-7 business days) and expedited (2-3 business days) shipping. Shipping costs vary based on order size and destination.",
  },
  {
    question: "What is your return policy?",
    answer: "You can return most new, unopened items within 30 days of delivery for a full refund. We'll also pay the return shipping costs if the return is a result of our error.",
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you will receive an email with a tracking number and a link to track your package.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we only ship within [Your Country/Region]. We are working on expanding our shipping options in the future.",
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pt-8"> {/* Added pt-8 (py-8 already exists) */}
      <div className="text-center mb-12">
        <LifeBuoy className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-foreground">Customer Support</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          We're here to help! Find answers to common questions or get in touch with our team.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="p-4 text-md font-medium text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 text-foreground/80">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
        
        <section>
           <ContactForm />
        </section>
      </div>
    </div>
  );
}
