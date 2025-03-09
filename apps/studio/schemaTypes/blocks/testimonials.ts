import { SpeechIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const testimonials = defineType({
  name: "testimonials",
  type: "object",
  icon: SpeechIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The large text above the testimonials",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "testimonials",
      type: "array",
      title: "Testimonials",
      description: "Select the testimonials to display",
      of: [
        {
          type: "reference",
          to: [{ type: "testimonial" }],
        },
      ],
      validation: (Rule) => [Rule.required(), Rule.unique()],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Untitled",
      subtitle: "Testimonials",
    }),
  },
});
