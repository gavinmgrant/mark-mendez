import { Contact2Icon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { customRichText } from "../definitions/rich-text";

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
    customRichText(["block"], {
      name: "content",
      title: "Content",
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
