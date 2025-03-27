import { useState, useEffect } from "react";
import type { PagebuilderType } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-is-mobile";

type PropertiesProps = PagebuilderType<"properties">;

export function Properties({ title, url }: PropertiesProps) {
  const [loading, setLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState(1000);

  const isMobile = useIsMobile(1024);

  const handleLoaded = () => {
    setTimeout(() => {
      setLoading(false);
    }, 750);
  };

  const windowDefined = typeof window !== "undefined";

  useEffect(() => {
    if (!windowDefined) return;
    const iframeHeight = window.innerHeight - (isMobile ? 172 : 212);
    setIframeHeight(iframeHeight);
    const handleResize = () => {
      setIframeHeight(iframeHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile, windowDefined]);

  return (
    <section id="properties">
      <div className="container mx-auto px-4 md:px-6 space-y-6 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
          {title}
        </h1>
        <div className="relative">
          {loading && (
            <AnimatePresence>
              <motion.div
              className="absolute top-0 flex items-center justify-center w-full animate-pulse bg-muted rounded-2xl"
              initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              style={{ height: `${iframeHeight}px` }}
              ></motion.div>
            </AnimatePresence>
          )}
          <iframe
            className="rounded-2xl"
            src={url}
            width="100%"
            height="100%"
            style={{
              border: "none",
              opacity: loading ? 0 : 1,
              overflow: "auto",
              height: `${iframeHeight}px`,
            }}
            onLoad={handleLoaded}
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Properties;
