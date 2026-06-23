"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

import type { LightboxImage } from "@/hooks/use-lightbox";

interface LightboxProps {
  isOpen: boolean;
  currentImage: LightboxImage | null;
  currentIndex: number;
  totalImages: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function Lightbox({
  isOpen,
  currentImage,
  currentIndex,
  totalImages,
  onClose,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
}: LightboxProps) {
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleControlClick =
    (action: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      action();
    };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      className="fixed inset-0 z-[10000] isolate"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <button
        type="button"
        className="absolute right-2 top-4 z-20 flex items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/20 md:right-4"
        onClick={handleControlClick(onClose)}
        aria-label="Close lightbox"
      >
        <X className="h-8 w-8 md:h-10 md:w-10" />
      </button>

      {totalImages > 1 && (
        <button
          type="button"
          className="absolute left-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30 md:left-4"
          onClick={handleControlClick(onPrev)}
          disabled={!canGoPrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" />
        </button>
      )}

      <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center px-12 py-16 md:px-20">
        {currentImage && (
          <div
            className="flex max-h-[calc(100dvh-8rem)] max-w-full flex-col items-center justify-center gap-3"
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="min-h-0 w-auto max-w-full max-h-full flex-1 object-contain"
              draggable={false}
            />
            {currentImage.caption ? (
              <p className="max-w-3xl shrink-0 px-4 text-center text-sm text-white/80">
                {currentImage.caption}
              </p>
            ) : null}
          </div>
        )}
      </div>

      {totalImages > 1 && (
        <button
          type="button"
          className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30 md:right-4"
          onClick={handleControlClick(onNext)}
          disabled={!canGoNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-8 w-8 md:h-10 md:w-10" />
        </button>
      )}

      {totalImages > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
          {currentIndex + 1} / {totalImages}
        </div>
      )}
    </div>,
    document.body,
  );
}
