import type { Metadata } from "next";

import { getBaseUrl } from "@/config";
import type { Maybe } from "@/types";

interface OgImageOptions {
  type?: string;
  id?: string;
}

function getOgImage({ type, id }: OgImageOptions = {}): string {
  const params = new URLSearchParams();
  if (id) params.set("id", id);
  if (type) params.set("type", type);
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/api/og?${params.toString()}`;
  return logoUrl;
}

interface MetaDataInput {
  _type?: Maybe<string>;
  seoDescription?: Maybe<string>;
  seoTitle?: Maybe<string>;
  slug?: Maybe<{ current: string | null }> | string | null;
  title?: Maybe<string>;
  description?: Maybe<string>;
  _id?: Maybe<string>;
}

export function getMetaData(data: MetaDataInput): Metadata {
  const { _type, seoDescription, seoTitle, slug, title, description, _id } =
    data ?? {};

  const baseUrl = getBaseUrl();
  const pageSlug = typeof slug === "string" ? slug : (slug?.current ?? "");
  const pageUrl = `${baseUrl}${pageSlug}`;

  const meta = {
    title: seoTitle ?? title ?? "",
    description: seoDescription ?? description ?? "",
  };

  const ogImage = getOgImage({
    type: _type ?? undefined,
    id: _id ?? undefined,
  });

  return {
    title: `${meta.title} | Mark H Mendez Group`,
    description: meta.description,
    metadataBase: new URL(baseUrl),
    creator: "Mark Mendez",
    authors: [{ name: "Mark Mendez" }],
    icons: {
      icon: `${baseUrl}/favicon.ico`,
    },
    keywords: [
      "los angeles architecture",
      "los angeles architecture broker",
      "los angeles luxury real estate agent",
      "los angeles real estate agent",
      "mark mendez",
    ],
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
      creator: "@studioroboto",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      countryName: "US",
      description: meta.description,
      title: meta.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
          secureUrl: ogImage,
        },
      ],
      url: pageUrl,
    },
  };
}
