"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { PortableTextBlock } from "next-sanity";

import { convertToSlug } from "@/utils";

interface TableOfContentProps<T> {
  richText?: T | null;
}

interface ProcessedHeading {
  href: string;
  text: string;
}

const VIEWPORT_BOTTOM_PADDING = 16;

function getStickyAncestor(element: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = element.parentElement;
  while (node) {
    if (getComputedStyle(node).position === "sticky") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function getMaxContainerHeight(container: HTMLElement): number {
  const { top } = container.getBoundingClientRect();
  const viewportBottom = window.innerHeight - VIEWPORT_BOTTOM_PADDING;

  const stickyAncestor = getStickyAncestor(container);
  const stickyTop = stickyAncestor
    ? Number.parseFloat(getComputedStyle(stickyAncestor).top) || 0
    : 0;

  const heightFromStickyTop = viewportBottom - Math.max(top, stickyTop);
  const heightToViewportBottom = viewportBottom - top;

  let height = Math.min(heightFromStickyTop, heightToViewportBottom);

  if (stickyAncestor) {
    const stickyBottom = stickyAncestor.getBoundingClientRect().bottom;
    height = Math.min(height, stickyBottom - top);
  }

  return Math.max(0, height);
}

function filterHeadings(
  richText?: PortableTextBlock[] | null,
): ProcessedHeading[] {
  if (!Array.isArray(richText)) return [];

  return richText.reduce<ProcessedHeading[]>((headings, block) => {
    if (block._type !== "block" || !block.style?.startsWith("h")) {
      return headings;
    }
    const text = block.children
      ?.map((child) => child.text)
      .join("")
      .trim();
    if (!text) return headings;
    const slug = convertToSlug(text);
    headings.push({ href: `#${slug}`, text });
    return headings;
  }, []);
}

function TableOfContentLink({ heading }: { heading: ProcessedHeading }) {
  return (
    <Link href={heading.href} className="text-sm justify-start !px-0">
      {heading.text}
    </Link>
  );
}

export function TableOfContent<T>({ richText }: TableOfContentProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const headings = useMemo(
    () => filterHeadings(richText as PortableTextBlock[]),
    [richText],
  );

  const updateHeight = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const height = getMaxContainerHeight(container);

    container.style.height = `${height}px`;
    container.style.maxHeight = `${height}px`;
  }, []);

  const clearHeight = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.height = "";
    container.style.maxHeight = "";
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      clearHeight();
      return;
    }

    updateHeight();
  }, [open, updateHeight, clearHeight]);

  useEffect(() => {
    if (!open) return;

    let rafId = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHeight);
    };

    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    const container = containerRef.current;
    const observeTarget = container
      ? (getStickyAncestor(container) ?? container.parentElement)
      : null;
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    if (observeTarget) {
      resizeObserver.observe(observeTarget);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
      resizeObserver.disconnect();
    };
  }, [open, updateHeight]);

  if (!headings.length) return null;

  return (
    <div
      ref={containerRef}
      className="flex flex-col overflow-hidden rounded-md bg-zinc-100 p-4 dark:bg-zinc-800"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full shrink-0 cursor-pointer items-center justify-between text-left text-lg font-semibold"
      >
        <span>Table of Contents</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <nav aria-label="Table of contents">
            <ul className="flex flex-col space-y-3">
              {headings.map((heading) => (
                <TableOfContentLink
                  key={`${heading.href}-${heading.text}-heading`}
                  heading={heading}
                />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
