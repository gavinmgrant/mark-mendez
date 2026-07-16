"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";

export type TimelineMilestone = {
  year: string;
  text: string;
  _key?: string;
};

type PositionedMilestone = TimelineMilestone & {
  offset: number;
};

const STAGGER = 0.25;
const DOT_SIZE = 28;
const TRACK_HEIGHT = 8;
const MIN_DOT_GAP = 10;
const MIN_LABEL_GAP = 8;
const CHAR_WIDTH = 8.5;
const LABEL_PAD_X = 2;
const ENTRANCE_DURATION = 0.5;
const YEAR_ROW_HEIGHT = 24;

/**
 * Survive React remounts (e.g. Sanity Live / router.refresh on tab focus).
 * Without this, a brief empty `milestones` prop returns null and removes the
 * entire section — including the "Timeline" heading.
 */
let lastGoodMilestones: TimelineMilestone[] | null = null;
/** Once the entrance has played in this JS session, remounts show the finished UI. */
let entrancePlayed = false;

function parseYear(year: string): number | null {
  const match = year.match(/\d{3,4}/);
  if (!match) return null;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function estimateLabelWidth(year: string): number {
  return year.length * CHAR_WIDTH + LABEL_PAD_X * 2;
}

function idealOffsets(milestones: TimelineMilestone[]): number[] {
  const numericYears = milestones.map((m) => parseYear(m.year));
  const allNumeric = numericYears.every((y) => y !== null);
  const years = numericYears as number[];

  if (!allNumeric) {
    return milestones.map((_, index) =>
      milestones.length === 1 ? 0 : index / (milestones.length - 1),
    );
  }

  const min = Math.min(...years);
  const max = Math.max(...years);
  const span = max - min;
  if (span === 0) {
    return milestones.map((_, index) =>
      milestones.length === 1 ? 0 : index / (milestones.length - 1),
    );
  }

  return years.map((year) => (year - min) / span);
}

function minCenterGap(
  index: number,
  count: number,
  labelWidths: number[],
): number {
  const dotGap = DOT_SIZE + MIN_DOT_GAP;
  const wA = labelWidths[index] ?? 0;
  const wB = labelWidths[index + 1] ?? 0;
  const halfDot = DOT_SIZE / 2;

  let labelGap: number;
  if (index === 0 && index + 1 === count - 1) {
    labelGap = 0;
  } else if (index === 0) {
    labelGap = wA + MIN_LABEL_GAP + wB / 2 - halfDot;
  } else if (index + 1 === count - 1) {
    labelGap = wA / 2 + MIN_LABEL_GAP + wB - halfDot;
  } else {
    labelGap = (wA + wB) / 2 + MIN_LABEL_GAP;
  }

  return Math.max(dotGap, labelGap);
}

function resolveOffsets(
  ideal: number[],
  years: string[],
  containerWidth: number,
): number[] {
  const n = ideal.length;
  if (n === 0) return [];
  if (n === 1 || containerWidth <= 0) return ideal.map(() => 0);

  const halfDot = DOT_SIZE / 2;
  const start = halfDot;
  const end = containerWidth - halfDot;
  const available = end - start;
  if (available <= 0) return ideal.map((_, i) => (i === n - 1 ? 1 : 0));

  const labelWidths = years.map(estimateLabelWidth);
  const gaps = Array.from({ length: n - 1 }, (_, i) =>
    minCenterGap(i, n, labelWidths),
  );
  const totalMin = gaps.reduce((sum, gap) => sum + gap, 0);

  if (totalMin > available + 0.5) {
    return Array.from({ length: n }, (_, i) => i / (n - 1));
  }

  let xs = ideal.map((offset) => start + offset * available);
  xs[0] = start;
  xs[n - 1] = end;

  for (let i = 1; i < n; i++) {
    xs[i] = Math.max(xs[i] ?? start, (xs[i - 1] ?? start) + (gaps[i - 1] ?? 0));
  }

  xs[n - 1] = end;
  for (let i = n - 2; i >= 0; i--) {
    xs[i] = Math.min(xs[i] ?? start, (xs[i + 1] ?? end) - (gaps[i] ?? 0));
  }
  xs[0] = start;

  for (let i = 1; i < n; i++) {
    xs[i] = Math.max(xs[i] ?? start, (xs[i - 1] ?? start) + (gaps[i - 1] ?? 0));
  }

  if ((xs[n - 1] ?? end) > end + 0.5) {
    return Array.from({ length: n }, (_, i) => i / (n - 1));
  }

  const drift = end - (xs[n - 1] ?? end);
  if (Math.abs(drift) > 0.5) {
    for (let i = 1; i < n; i++) {
      xs[i] = (xs[i] ?? start) + drift;
    }
    xs[n - 1] = end;
  }

  return xs.map((x) => (x - start) / available);
}

function positionMilestones(
  milestones: TimelineMilestone[],
  containerWidth: number,
): PositionedMilestone[] {
  const sorted = [...milestones].sort((a, b) => {
    const yearA = parseYear(a.year);
    const yearB = parseYear(b.year);
    if (yearA !== null && yearB !== null) return yearA - yearB;
    return 0;
  });

  const ideal = idealOffsets(sorted);
  const offsets = resolveOffsets(
    ideal,
    sorted.map((m) => m.year),
    containerWidth,
  );

  return sorted.map((milestone, index) => ({
    ...milestone,
    offset: offsets[index] ?? 0,
  }));
}

function centerStyle(offset: number): CSSProperties {
  return {
    left: `calc(${DOT_SIZE / 2}px + ${offset} * (100% - ${DOT_SIZE}px))`,
  };
}

function resolveStableMilestones(
  milestones?: TimelineMilestone[] | null,
): TimelineMilestone[] | null {
  if (milestones && milestones.length >= 3) {
    lastGoodMilestones = milestones;
    return milestones;
  }
  return lastGoodMilestones;
}

type MilestoneMarkerProps = {
  milestone: PositionedMilestone;
  index: number;
  lastIndex: number;
  trackTop: number;
  animate: boolean;
  pending: boolean;
};

function MilestoneMarker({
  milestone,
  index,
  lastIndex,
  trackTop,
  animate,
  pending,
}: MilestoneMarkerProps) {
  const isFirst = index === 0;
  const isLast = index === lastIndex;
  const popoverAlign = isFirst ? "start" : isLast ? "end" : "center";
  const delay = `${index * STAGGER}s`;

  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute flex items-end",
          isFirst && "left-0",
          isLast && "right-0",
          !isFirst && !isLast && "-translate-x-1/2",
        )}
        style={{
          top: 0,
          height: YEAR_ROW_HEIGHT,
          ...(!isFirst && !isLast ? centerStyle(milestone.offset) : null),
        }}
      >
        <span
          className={cn(
            "text-sm font-semibold tabular-nums text-foreground",
            animate && "timeline-year-enter",
            pending && "timeline-year-pending",
          )}
          style={
            animate
              ? {
                  animationDelay: delay,
                  animationDuration: `${ENTRANCE_DURATION}s`,
                }
              : undefined
          }
        >
          {milestone.year}
        </span>
      </div>

      <div
        className={cn("absolute", animate && "timeline-dot-enter")}
        style={{
          left: `calc(${milestone.offset} * (100% - ${DOT_SIZE}px))`,
          top: trackTop,
          width: DOT_SIZE,
          height: DOT_SIZE,
          ...(animate
            ? {
                animationDelay: delay,
                animationDuration: `${ENTRANCE_DURATION}s`,
              }
            : null),
        }}
      >
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={`${milestone.year}: ${milestone.text}`}
              className="group relative block size-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="absolute inset-0 rounded-full border-2 border-foreground bg-background shadow-sm transition-transform group-hover:scale-110" />
              <span className="absolute inset-[4px] rounded-full bg-foreground transition-transform group-hover:scale-110" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align={popoverAlign}
            sideOffset={12}
            collisionPadding={16}
            className="w-64 border-white/30 text-sm leading-relaxed"
          >
            <p className="font-semibold tabular-nums">{milestone.year}</p>
            <p className="mt-1 text-muted-foreground">{milestone.text}</p>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

type CaseStudyTimelineProps = {
  milestones?: TimelineMilestone[] | null;
};

export function CaseStudyTimeline({ milestones }: CaseStudyTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [runEntrance, setRunEntrance] = useState(false);
  const showFinished = entrancePlayed && !runEntrance;

  const stableMilestones = resolveStableMilestones(milestones);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const update = () => setContainerWidth(node.clientWidth);
    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(node);

    if (entrancePlayed) {
      return () => resizeObserver.disconnect();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        entrancePlayed = true;
        setRunEntrance(true);
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(node);

    return () => {
      resizeObserver.disconnect();
      io.disconnect();
    };
  }, []);

  const positioned = useMemo(() => {
    if (!stableMilestones) return [];
    return positionMilestones(stableMilestones, containerWidth);
  }, [stableMilestones, containerWidth]);

  if (!stableMilestones) return null;

  const lastIndex = positioned.length - 1;
  const trackTop = YEAR_ROW_HEIGHT + 8;
  const trackHeight = DOT_SIZE;
  const lineDuration = `${stableMilestones.length * STAGGER}s`;
  const animate = runEntrance && !showFinished;

  return (
    <section aria-label="Timeline" className="min-w-0 max-w-full pb-4">
      <style>{`
        @keyframes timeline-line-enter {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes timeline-year-enter {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes timeline-dot-enter {
          0% { transform: scale(1); }
          40% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .timeline-line-enter {
          transform-origin: left center;
          animation-name: timeline-line-enter;
          animation-timing-function: linear;
          animation-fill-mode: both;
        }
        .timeline-year-enter {
          opacity: 0;
          animation-name: timeline-year-enter;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-fill-mode: both;
        }
        .timeline-year-pending {
          opacity: 0;
        }
        .timeline-dot-enter {
          transform-origin: center;
          animation-name: timeline-dot-enter;
          animation-timing-function: ease-in-out;
          animation-fill-mode: both;
        }
        @media (prefers-reduced-motion: reduce) {
          .timeline-line-enter,
          .timeline-year-enter,
          .timeline-dot-enter {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .timeline-year-pending {
            opacity: 1 !important;
          }
        }
      `}</style>

      <h2 className="mb-6 text-2xl font-semibold">Timeline</h2>

      <div
        ref={trackRef}
        className="relative w-full"
        style={{ height: trackTop + trackHeight }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 rounded-full bg-foreground/50"
          style={{
            top: trackTop + trackHeight / 2 - TRACK_HEIGHT / 2,
            height: TRACK_HEIGHT,
          }}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 origin-left rounded-full bg-white",
            animate && "timeline-line-enter",
            !animate && !showFinished && "scale-x-0",
            showFinished && "scale-x-100",
          )}
          style={{
            top: trackTop + trackHeight / 2 - TRACK_HEIGHT / 2,
            height: TRACK_HEIGHT,
            ...(animate ? { animationDuration: lineDuration } : null),
          }}
          aria-hidden
        />

        {positioned.map((milestone, index) => (
          <MilestoneMarker
            key={milestone._key ?? `${milestone.year}-${index}`}
            milestone={milestone}
            index={index}
            lastIndex={lastIndex}
            trackTop={trackTop}
            animate={animate}
            pending={!animate && !showFinished}
          />
        ))}
      </div>
    </section>
  );
}
