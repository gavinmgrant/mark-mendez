import { SpeechIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { parseRichTextToString } from "../../utils/helper";
import { richTextField } from "../common";

export const testimonial = defineType({
  name: "testimonial",
  type: "document",
  icon: SpeechIcon,
  fields: [
    defineField({
      name: "title",
      title: "Person's name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ ...richTextField, title: "Testimonial" }),
  ],
  preview: {
    select: {
      title: "title",
      richText: "richText",
    },
    prepare: ({ title, richText }) => ({
      title: title ?? "Untitled",
      subtitle: parseRichTextToString(richText, 20),
    }),
  },
});
