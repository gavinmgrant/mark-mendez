import { notFound } from "next/navigation";

import { ExternalLink } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { RichText } from "@/components/richtext";
import { CaseStudyAside } from "@/components/case-study-aside";
import { CaseStudyGallery } from "@/components/case-study-gallery";
import { CaseStudyMeta } from "@/components/case-study-meta";
import { CaseStudyTimeline } from "@/components/case-study-timeline";
import { ShareButtons } from "@/components/share-buttons";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  queryCaseStudyPaths,
  queryCaseStudySlugPageData,
} from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";
import { getYoutubeEmbedSrc } from "@/lib/youtube-embed";

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
    program,
    structure,
    primaryIdea,
    videoUrl,
    listingUrl,
    timeline,
    gallery,
  } = data ?? {};

  const youtubeEmbedSrc =
    typeof videoUrl === "string" ? getYoutubeEmbedSrc(videoUrl) : null;

  const postTitle = title ?? "";
  const postUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="container mx-auto my-4 lg:my-6 px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main className="min-w-0 space-y-6 lg:space-y-8 mt-4">
          <header>
            <h1 className="text-2xl xl:text-3xl font-bold mb-2">{title}</h1>
            <div className="lg:hidden">
              <CaseStudyMeta
                description={description}
                location={location}
                architect={architect}
                yearBuilt={yearBuilt}
                tourDate={tourDate}
                program={program}
                structure={structure}
                primaryIdea={primaryIdea}
              />
            </div>
          </header>

          <div className="flex flex-col gap-4">
            {youtubeEmbedSrc && (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <iframe
                  src={youtubeEmbedSrc}
                  title={`Video: ${title}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            <div className="lg:hidden">
              <ShareButtons postTitle={postTitle} postUrl={postUrl} />
            </div>
          </div>

          {body && body.length > 0 && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <RichText richText={body} />
            </div>
          )}

          <CaseStudyTimeline milestones={timeline} cacheKey={slug} />

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

          {(heroImage?.asset || (gallery && gallery.length > 0)) && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Gallery</h2>
              <CaseStudyGallery gallery={gallery ?? []} heroImage={heroImage} />
            </div>
          )}
        </main>

        <aside className="hidden lg:block">
          <CaseStudyAside
            title={title}
            description={description}
            location={location}
            architect={architect}
            yearBuilt={yearBuilt}
            tourDate={tourDate}
            program={program}
            structure={structure}
            primaryIdea={primaryIdea}
            body={body}
          />
        </aside>
      </div>
    </div>
  );
}
