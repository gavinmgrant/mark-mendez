import type { PagebuilderType } from "@/types";

type ContactFormProps = PagebuilderType<"contactForm">;

export function ContactForm({ title }: ContactFormProps) {
  return (
    <section id="contact-form">
      <div className="container mx-auto px-4 md:px-6">
        <h1>{title}</h1>
      </div>
    </section>
  );
}

export default ContactForm;
