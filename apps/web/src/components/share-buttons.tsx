"use client";

import {
  IconBrandBluesky,
  IconBrandLinkedin,
  IconBrandThreads,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Button } from "@workspace/ui/components/button";

type Platform = "Android" | "Desktop" | "iOS";

interface ShareUrls {
  android: string;
  ios: string;
  web: string;
}

interface ShareButtonsProps {
  postTitle: string;
  postUrl: string;
}

interface ShareButtonProps {
  icon: ReactNode;
  urls: ShareUrls;
}

function getPlatform(): Platform {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return "iOS";
  if (/Android/i.test(navigator.userAgent)) return "Android";
  return "Desktop";
}

function getMobileUrl(platform: Platform, urls: ShareUrls): string {
  if (platform === "iOS") return urls.ios;
  if (platform === "Android") return urls.android;
  return urls.web;
}

function ShareButton({ icon, urls }: ShareButtonProps) {
  const handleClick = () => {
    const platform = getPlatform();
    const url = getMobileUrl(platform, urls);

    const newWindow = window.open(url, "_blank");

    setTimeout(() => {
      try {
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === "undefined"
        ) {
          window.location.href = urls.web;
        }
      } catch {
        window.location.href = urls.web;
      }
    }, 1000);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="rounded-full [&_svg]:size-6 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
      onClick={handleClick}
    >
      {icon}
    </Button>
  );
}

export function ShareButtons({ postTitle, postUrl }: ShareButtonsProps) {
  const titleAndUrl = `${postTitle}\n${postUrl}`;
  const encodedTitleAndUrl = encodeURIComponent(titleAndUrl);
  const encodedUrl = encodeURIComponent(postUrl);

  return (
    <div className="flex items-center gap-2">
      <ShareButton
        icon={<IconBrandLinkedin size={24} />}
        urls={{
          web: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          ios: `linkedin://shareArticle?mini=true&url=${encodedUrl}`,
          android: `linkedin://shareArticle?mini=true&url=${encodedUrl}`,
        }}
      />
      <ShareButton
        icon={<IconBrandThreads size={24} />}
        urls={{
          web: `https://www.threads.net/intent/post?text=${encodedTitleAndUrl}`,
          ios: `barcelona://create?text=${encodedTitleAndUrl}`,
          android: `barcelona://create?text=${encodedTitleAndUrl}`,
        }}
      />
      <ShareButton
        icon={<IconBrandBluesky size={24} />}
        urls={{
          web: `https://bsky.app/intent/compose?text=${encodedTitleAndUrl}`,
          ios: `https://bsky.app/intent/compose?text=${encodedTitleAndUrl}`,
          android: `https://bsky.app/intent/compose?text=${encodedTitleAndUrl}`,
        }}
      />
    </div>
  );
}
