import { VideoIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const videosYoutube = defineType({
  name: "videosYoutube",
  type: "object",
  icon: VideoIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The large text above the video feed",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Untitled",
      subtitle: "Youtube Videos",
    }),
  },
});
