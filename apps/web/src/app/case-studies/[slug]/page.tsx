import { notFound } from "next/navigation";

import { ExternalLink } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { RichText } from "@/components/richtext";
// import { SanityImage } from "@/components/sanity-image";
import { TableOfContent } from "@/components/table-of-content";
import { CaseStudyGallery } from "@/components/case-study-gallery";
import { CaseStudyMeta } from "@/components/case-study-meta";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  queryCaseStudyPaths,
  queryCaseStudySlugPageData,
} from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

export const revalidate = 3600;

async function fetchCaseStudySlugData(slug: string) {
  return await sanityFetch({
    query: queryCaseStudySlugPageData,
    params: { slug: `/case-studies/${slug}` },
    tags: [`case-study-${slug}`, "caseStudies"],
  });
}

async function fetchCaseStudyPaths() {
  const slugs = await client.fetch(queryCaseStudyPaths);
  const paths: { slug: string }[] = [];
  for (const fullSlug of slugs) {
    if (!fullSlug) continue;
    const parts = fullSlug.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) paths.push({ slug: last });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchCaseStudySlugData(slug);
  if (!data) return getMetaData({});
  return getMetaData(data);
}

export async function generateStaticParams() {
  return await fetchCaseStudyPaths();
}

export default async function CaseStudySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchCaseStudySlugData(slug);
  if (!data) return notFound();

  const {
    title,
    description,
    heroImage,
    body,
    location,
    architect,
    yearBuilt,
    tourDate,
    videoUrl,
    listingUrl,
    gallery,
  } = data ?? {};

  return (
    <div className="container mx-auto my-4 lg:my-10 px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main className="space-y-8 lg:space-y-10">
          <header>
            <h1 className="text-4xl font-bold">{title}</h1>
            <div className="mt-4 lg:hidden">
              <CaseStudyMeta
                description={description}
                location={location}
                architect={architect}
                yearBuilt={yearBuilt}
                tourDate={tourDate}
              />
            </div>
          </header>

          {/* {heroImage && (
            <SanityImage
              asset={heroImage}
              alt={title ?? "Case study hero"}
              width={1600}
              loading="eager"
              height={900}
              quality={100}
              className="h-auto w-full rounded-lg"
            />
          )} */}

          {videoUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <iframe
                src={
                  videoUrl.includes("youtube.com")
                    ? `https://www.youtube.com/embed/${new URL(videoUrl).searchParams.get("v") ?? ""}`
                    : videoUrl
                }
                title={`Video: ${title}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {body && body.length > 0 && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <RichText richText={body} />
            </div>
          )}

          {listingUrl && (
            <Button asChild variant="default" size="sm" className="w-full sm:w-auto">
              <a
                href={listingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Listing
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}

          {gallery && gallery.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Gallery</h2>
              <CaseStudyGallery gallery={gallery} />
            </div>
          )}
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6 rounded-lg">
            <CaseStudyMeta
              description={description}
              location={location}
              architect={architect}
              yearBuilt={yearBuilt}
              tourDate={tourDate}
            />
            {body && body.length > 0 && (
              <TableOfContent richText={body} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
