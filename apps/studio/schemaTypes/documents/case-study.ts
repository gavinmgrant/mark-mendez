import { defineArrayMember, defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { richTextField } from "../common";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Property Name",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      rows: 3,
      group: GROUP.MAIN_CONTENT,
      description: "Short description for cards and SEO",
      validation: (rule) => [
        rule
          .min(140)
          .warning(
            "The meta description should be at least 140 characters for optimal SEO visibility in search results",
          ),
        rule
          .max(160)
          .warning(
            "The meta description should not exceed 160 characters as it will be truncated in search results",
          ),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL",
      group: GROUP.MAIN_CONTENT,
      description: "Use path like /case-studies/your-property-name",
      components: {
        field: PathnameFieldComponent,
      },
      options: {
        source: "title",
        slugify: createSlug,
        isUnique,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "architect",
      type: "string",
      title: "Architect",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "yearBuilt",
      type: "string",
      title: "Year Built",
      description: "e.g. 1925 or circa 1920",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "location",
      type: "string",
      title: "Location",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "tourDate",
      type: "date",
      title: "Tour Date",
      description: "When the property was toured",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "videoUrl",
      type: "url",
      title: "YouTube Video URL",
      description:
        "YouTube only (watch, Shorts, youtu.be, or embed links). Other URLs are not embedded on the site.",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "listingUrl",
      type: "url",
      title: "Listing URL",
      description: "Link to the property listing (e.g. MLS or listing site)",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "heroImage",
      type: "image",
      title: "Main Hero Image",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      ...richTextField,
      name: "body",
      title: "Case Study Text",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "gallery",
      type: "array",
      title: "Image Gallery",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt text",
              description: "Important for accessibility",
            },
          ],
        }),
      ],
    }),
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      media: "heroImage",
      location: "location",
      isPrivate: "seoNoIndex",
      slug: "slug.current",
    },
    prepare: ({ title, media, location, slug, isPrivate }) => ({
      title,
      media,
      subtitle: [location, `${isPrivate ? "Private" : "Public"}: ${slug}`]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
