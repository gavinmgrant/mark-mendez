import { Contact2Icon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const contactForm = defineType({
  name: "contactForm",
  type: "object",
  icon: Contact2Icon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The large text above the contact form",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Untitled",
      subtitle: "Contact Form",
    }),
  },
});
