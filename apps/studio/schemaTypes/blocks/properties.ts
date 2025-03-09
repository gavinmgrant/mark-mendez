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
