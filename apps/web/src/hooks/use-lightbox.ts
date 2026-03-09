"use client";

import * as React from "react";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface UseLightboxOptions {
  images: LightboxImage[];
  initialIndex?: number;
}

interface UseLightboxReturn {
  isOpen: boolean;
  currentIndex: number;
  currentImage: LightboxImage | null;
  openAt: (index: number) => void;
  close: () => void;
  goNext: () => void;
  goPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function useLightbox({
  images,
  initialIndex = 0,
}: UseLightboxOptions): UseLightboxReturn {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const count = images.length;
  const currentImage = count > 0 ? images[currentIndex] ?? null : null;
  const canGoNext = count > 1 && currentIndex < count - 1;
  const canGoPrev = count > 1 && currentIndex > 0;

  const openAt = React.useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
    setIsOpen(true);
  }, [images.length]);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const goNext = React.useCallback(() => {
    if (!canGoNext) return;
    setCurrentIndex((i) => Math.min(i + 1, count - 1));
  }, [canGoNext, count]);

  const goPrev = React.useCallback(() => {
    if (!canGoPrev) return;
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, [canGoPrev]);

  return {
    isOpen,
    currentIndex,
    currentImage,
    openAt,
    close,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
  };
}
