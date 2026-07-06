import { getImageDimensions } from "@sanity/asset-utils";
import { cn } from "@workspace/ui/lib/utils";
import Image, { type ImageProps as NextImageProps } from "next/image";

import { urlFor, urlForHighFidelity } from "@/lib/sanity/client";
import type { SanityImageProps } from "@/types";

type ImageProps = {
  asset: SanityImageProps;
  alt?: string;
  /** Skip WebP conversion, DPR scaling, and Next.js re-encoding. */
  highFidelity?: boolean;
} & Omit<NextImageProps, "alt" | "src">;

function getBlurDataURL(asset: SanityImageProps) {
  if (asset?.blurData) {
    return {
      blurDataURL: asset.blurData,
      placeholder: "blur" as const,
    };
  }
  return {};
}

export function SanityImage({
  asset,
  alt,
  width,
  height,
  className,
  quality = 75,
  highFidelity = false,
  fill,
  ...props
}: ImageProps) {
  if (!asset?.asset) return null;
  const dimensions = getImageDimensions(asset.asset);
  const imageWidth = Number(width ?? dimensions.width);
  const imageHeight = Number(height ?? dimensions.height);
  const imageSource = { ...asset, _id: asset?.asset?._ref };

  const builder = (highFidelity ? urlForHighFidelity : urlFor)(imageSource).size(
    imageWidth,
    imageHeight,
  );

  if (!highFidelity) {
    builder.dpr(2).auto("format");
  }

  const url = builder.quality(Number(highFidelity ? 100 : quality)).url();

  // Base image props
  const imageProps = {
    alt: alt ?? asset.alt ?? "Image",
    "aria-label": alt ?? asset.alt ?? "Image",
    src: url,
    className: cn(className),
    sizes: highFidelity
      ? "100vw"
      : "(max-width: 640px) 75vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
    unoptimized: highFidelity || props.unoptimized,
    ...getBlurDataURL(asset),
    ...props,
  };

  // Add width and height only if fill is not true
  if (!fill) {
    return (
      <Image
        {...imageProps}
        width={width ?? dimensions.width}
        height={height ?? dimensions.height}
      />
    );
  }

  return <Image {...imageProps} fill={fill} />;
}
