import { Pencil } from "lucide-react";
import { defineField, defineType } from "sanity";

import { richTextField } from "../common";

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich Text Block",
  icon: Pencil,
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    richTextField,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Rich Text Block",
    }),
  },
});
