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
    defineField({
      name: "content",
      type: "richText",
      title: "Content",
      description: "The text below the title",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Untitled",
      content: "Contact Form",
    }),
  },
});
