"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

import type { LightboxImage } from "@/hooks/use-lightbox";

import { Button } from "@workspace/ui/components/button";

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
  const containerRef = React.useRef<HTMLDivElement>(null);

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
    if (e.target === containerRef.current) onClose();
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Close button - top right */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-[999] rounded-full text-white hover:bg-white/20 hover:text-white"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Previous - left */}
      {totalImages > 1 && (
        <button
          type="button"
          className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30 md:left-4"
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" />
        </button>
      )}

      {/* Image - full width on mobile, arrows overlay; padded on desktop */}
      <div className="flex w-full max-w-[100vw] items-center justify-center px-0 py-12 md:max-w-[90vw] md:px-16">
        {currentImage && (
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-h-[85vh] w-full max-w-full object-contain md:w-auto"
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {/* Next - right */}
      {totalImages > 1 && (
        <button
          type="button"
          className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30 md:right-4"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-8 w-8 md:h-10 md:w-10" />
        </button>
      )}

      {/* Optional: counter */}
      {totalImages > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
          {currentIndex + 1} / {totalImages}
        </div>
      )}
    </div>,
    document.body,
  );
}
