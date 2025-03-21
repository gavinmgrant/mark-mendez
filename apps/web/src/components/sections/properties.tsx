import { useState } from "react";
import type { PagebuilderType } from "@/types";
import { motion, AnimatePresence } from "motion/react";

type PropertiesProps = PagebuilderType<"properties">;

export function Properties({ title, url, iframeHeight }: PropertiesProps) {
  const [loading, setLoading] = useState(true);

  const handleLoaded = () => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <section id="properties">
      <div className="container mx-auto px-4 md:px-6 space-y-6 text-center">
        <h1 className="text-4xl lg:text-5xl font-semibold">{title}</h1>
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
            height={`${iframeHeight}px`}
            style={{
              border: "none",
              opacity: loading ? 0 : 1,
              overflow: "auto",
            }}
            onLoad={handleLoaded}
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Properties;
