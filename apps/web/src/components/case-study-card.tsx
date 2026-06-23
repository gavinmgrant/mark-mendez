import Link from "next/link";

import type { SanityImageProps } from "@/types";
import { formatTourDate } from "@/utils";

import { SanityImage } from "./sanity-image";

export type CaseStudy = {
  _id: string;
  _type: string;
  title: string | null;
  description: string | null;
  slug: string | null;
  location: string | null;
  architect: string | null;
  yearBuilt: string | null;
  tourDate: string | null;
  heroImage?: SanityImageProps | null;
};

interface CaseStudyImageProps {
  heroImage: CaseStudy["heroImage"];
  title?: string | null;
}

function CaseStudyImage({ heroImage, title }: CaseStudyImageProps) {
  if (!heroImage?.asset) return null;

  return (
    <SanityImage
      asset={heroImage}
      width={800}
      height={400}
      alt={title ?? "Case study image"}
      className="aspect-[16/9] w-full rounded-md bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
    />
  );
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

function CaseStudyMeta({
  location,
  tourDate,
}: {
  location: string | null;
  tourDate: string | null;
}) {
  const parts = [location, tourDate].filter(Boolean);
  if (parts.length === 0) return null;

  return (
    <div className="my-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {location && <span>{location}</span>}
      {tourDate && (
        <time dateTime={tourDate}>{formatTourDate(tourDate)}</time>
      )}
    </div>
  );
}

function CaseStudyContent({
  title,
  description,
  isFeatured,
}: {
  title: string | null;
  description: string | null;
  isFeatured?: boolean;
}) {
  const HeadingTag = isFeatured ? "h2" : "h3";
  const headingClasses = isFeatured
    ? "mt-2 text-3xl font-semibold leading-tight"
    : "mt-2 text-lg font-semibold leading-6";

  return (
    <div className="group relative">
      <HeadingTag className={headingClasses}>
        {title}
      </HeadingTag>
      {description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
          {description}
        </p>
      )}
    </div>
  );
}

export function FeaturedCaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const {
    title,
    slug,
    description,
    location,
    tourDate,
    heroImage,
  } = caseStudy ?? {};

  return (
    <Link href={slug ?? "#"}>
      <article className="flex flex-col items-start gap-x-8 lg:flex-row">
        <div className="relative w-full lg:w-1/2">
          <CaseStudyImage heroImage={heroImage} title={title} />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
        </div>
        <div className="mt-8 w-full lg:mt-0 lg:w-1/2">
          <CaseStudyMeta location={location} tourDate={tourDate} />
          <CaseStudyContent
            title={title}
            description={description}
            isFeatured
          />
        </div>
      </article>
    </Link>
  );
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const {
    title,
    slug,
    description,
    location,
    tourDate,
    heroImage,
  } = caseStudy;

  return (
    <Link href={slug ?? "#"}>
      <article className="flex w-full flex-col items-start">
        <CaseStudyImage heroImage={heroImage} title={title} />
        <div className="w-full sm:max-w-xl">
          <CaseStudyMeta location={location} tourDate={tourDate} />
          <CaseStudyContent
            title={title}
            description={description}
          />
        </div>
      </article>
    </Link>
  );
}

export function CaseStudyHeader({
  title,
  description,
}: {
  title: string | null;
  description: string | null;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">{title}</h1>
        {description && (
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
