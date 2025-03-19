import { HomeIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const properties = defineType({
  name: "properties",
  type: "object",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The large text above the properties",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      type: "url",
      title: "URL",
      description: "The URL of the properties page to show in the iframe",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "iframeHeight",
      type: "number",
      title: "Iframe Height",
      description: "The height of the iframe in pixels",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Untitled",
      subtitle: "Properties",
    }),
  },
});
