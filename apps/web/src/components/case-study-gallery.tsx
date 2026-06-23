"use client";

import type { SanityImageSource } from "@sanity/asset-utils";
import * as React from "react";

import { Lightbox } from "@/components/lightbox";
import { SanityImage } from "@/components/sanity-image";
import type { LightboxImage } from "@/hooks/use-lightbox";
import { useLightbox } from "@/hooks/use-lightbox";
import { urlFor } from "@/lib/sanity/client";
import type { SanityImageProps } from "@/types";

const LIGHTBOX_WIDTH = 1920;

type GalleryImageWithAsset = SanityImageProps & {
  asset: NonNullable<SanityImageProps["asset"]>;
};

function isGalleryImageWithAsset(
  img: SanityImageProps,
): img is GalleryImageWithAsset {
  return Boolean(img?.asset);
}

function filterGalleryWithAssets(
  gallery: SanityImageProps[],
): GalleryImageWithAsset[] {
  return gallery.filter(isGalleryImageWithAsset);
}

function buildLightboxImages(
  displayGallery: GalleryImageWithAsset[],
): LightboxImage[] {
  return displayGallery.map((img) => ({
    src: urlFor(img as SanityImageSource)
      .width(LIGHTBOX_WIDTH)
      .auto("format")
      .quality(90)
      .url(),
    alt: img.alt ?? "Gallery image",
  }));
}

interface CaseStudyGalleryProps {
  gallery: SanityImageProps[];
  heroImage?: SanityImageProps | null;
}

export function CaseStudyGallery({
  gallery,
  heroImage,
}: CaseStudyGalleryProps) {
  const displayGallery = React.useMemo(() => {
    const images = heroImage ? [heroImage, ...gallery] : gallery;
    return filterGalleryWithAssets(images);
  }, [gallery, heroImage]);
  const lightboxImages = React.useMemo(
    () => buildLightboxImages(displayGallery),
    [displayGallery],
  );
  const lightbox = useLightbox({ images: lightboxImages });
  const count = displayGallery.length;

  if (count === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayGallery.map((img, index) => (
          <div
            key={"_ref" in img.asset ? img.asset._ref : index}
            className="cursor-pointer overflow-hidden rounded-md transition opacity-90 hover:opacity-100"
            onClick={() => lightbox.openAt(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                lightbox.openAt(index);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View image ${index + 1} of ${count}`}
          >
            <SanityImage
              asset={img}
              alt={img.alt ?? `Gallery image ${index + 1}`}
              width={600}
              height={400}
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
        ))}
      </div>

      <Lightbox
        isOpen={lightbox.isOpen}
        currentImage={lightbox.currentImage}
        currentIndex={lightbox.currentIndex}
        totalImages={lightboxImages.length}
        onClose={lightbox.close}
        onNext={lightbox.goNext}
        onPrev={lightbox.goPrev}
        canGoNext={lightbox.canGoNext}
        canGoPrev={lightbox.canGoPrev}
      />
    </>
  );
}
