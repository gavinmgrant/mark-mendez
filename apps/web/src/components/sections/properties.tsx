import { useState } from "react";
import type { PagebuilderType } from "@/types";
import { LoaderCircle } from "lucide-react";

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
            <div className="absolute top-0 flex items-center justify-center h-72 w-full">
              <div className="flex items-center gap-4">
                <LoaderCircle
                  className="animate-spin text-primary"
                  size={24}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <p>Loading properties...</p>
              </div>
            </div>
          )}
          <iframe
            className="rounded-2xl"
            src={url}
            width="100%"
            height={`${iframeHeight}px`}
            style={{ border: "none", opacity: loading ? 0 : 1 }}
            onLoad={handleLoaded}
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Properties;
