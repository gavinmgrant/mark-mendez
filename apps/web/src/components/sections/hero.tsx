import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";

type HeroBlockProps = PagebuilderType<"hero">;

export function HeroBlock({
  title,
  buttons,
  badge,
  image,
  richText,
}: HeroBlockProps) {
  return (
    <section id="hero" className="mt-4 md:my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center flex-col lg:flex-row gap-6 lg:gap-20">
          <div className="h-full flex flex-col gap-4 lg:gap-6 items-center justify-items-center text-center lg:items-start lg:justify-items-start lg:text-left">
            {badge && <Badge variant="secondary">{badge}</Badge>}
            <div className="grid gap-4">
              <h1 className="text-4xl lg:text-5xl font-semibold text-balance">
                {title}
              </h1>
              <RichText
                richText={richText}
                className="text-base md:text-md font-normal"
              />
            </div>

            {buttons && (
              <SanityButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-4 sm:grid-flow-col lg:justify-start"
              />
            )}
          </div>

          {image && (
            <div className="h-full w-full lg:w-2/5 lg:shrink-0">
              <SanityImage
                asset={image}
                loading="eager"
                width={800}
                height={800}
                priority
                quality={80}
                className="max-h-124 lg:max-h-124 w-full rounded-2xl object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
