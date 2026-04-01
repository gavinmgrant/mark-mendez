"use client";

import { AnimatePresence, motion } from "motion/react";

import { TableOfContent } from "@/components/table-of-content";
import { CaseStudyMeta } from "@/components/case-study-meta";
import { ShareButtons } from "@/components/share-buttons";
import { useScrollHeight } from "@/hooks/use-scroll-height";

interface CaseStudyAsideProps {
  title: string | null | undefined;
  description?: string | null;
  location?: string | null;
  architect?: string | null;
  yearBuilt?: string | null;
  tourDate?: string | null;
  body: unknown[] | null | undefined;
}

export function CaseStudyAside({
  title,
  description,
  location,
  architect,
  yearBuilt,
  tourDate,
  body,
}: CaseStudyAsideProps) {
  const scrollHeight = useScrollHeight();

  return (
    <div className="sticky top-28">
      <AnimatePresence>
        {scrollHeight > 240 && title && (
          <motion.div
            className="hidden lg:block"
            initial={{ y: -180, height: 0, opacity: 0 }}
            animate={{ y: 0, height: "auto", opacity: 1 }}
            exit={{ y: -180, height: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
            }}
          >
            <h2 className="text-xl font-bold pb-4">{title}</h2>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-6">
        <CaseStudyMeta
          description={description}
          location={location}
          architect={architect}
          yearBuilt={yearBuilt}
          tourDate={tourDate}
        />
        <div className="hidden lg:block">
          <ShareButtons postTitle={title ?? ""} postUrl={typeof window !== "undefined" ? window.location.href : ""} />
        </div>
        {body && body.length > 0 && <TableOfContent richText={body} />}
      </div>
    </div>
  );
}
