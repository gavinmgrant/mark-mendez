"use client";

import { useEffect, useState } from "react";
import type { PagebuilderType } from "@/types";
import { motion, AnimatePresence } from "motion/react";

interface Video {
  id: string;
  title: string;
  link: string;
  published: string;
}

type VideosYoutubeProps = PagebuilderType<"videosYoutube">;

export function VideosYoutube({ title }: VideosYoutubeProps) {
  const [loading, setLoading] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
  });
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/youtube");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }
    fetchVideos();
  }, []);

  const handleLoaded = (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <section id="videos-youtube">
      <div className="container mx-auto px-4 md:px-6 space-y-6 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">{title}</h1>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 p-0 min-h-screen">
          {videos.map((video, index) => (
            <div key={video.id} className="bg-background rounded-md p-0">
              <p className="text-white">{loading[index]}</p>
              <div className="relative aspect-video">
                {loading[index] && (
                  <AnimatePresence>
                    <motion.div
                      className="absolute top-0 flex items-center justify-center w-full animate-pulse bg-muted rounded-md h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </AnimatePresence>
                )}
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.id}?modestbranding=1&rel=0&controls=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md"
                  style={{
                    border: "none",
                    opacity: loading[index] ? 0 : 1,
                    transition: "opacity 0.5s",
                  }}
                  onLoad={() => handleLoaded(index)}
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VideosYoutube;
