import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";

type RichTextBlockProps = PagebuilderType<"richTextBlock">;

export function RichTextBlock({ title, richText }: RichTextBlockProps) {
  return (
    <section id="rich-text" className="my-6 md:my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold md:text-5xl text-balance">
            {title}
          </h2>
          <RichText richText={richText} />
        </div>
      </div>
    </section>
  );
}
