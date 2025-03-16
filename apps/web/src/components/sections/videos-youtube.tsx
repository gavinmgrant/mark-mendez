"use client";

import { useEffect, useState } from "react";
import type { PagebuilderType } from "@/types";
import { LoaderCircle } from "lucide-react";

interface Video {
  id: string;
  title: string;
  link: string;
  published: string;
}

type VideosYoutubeProps = PagebuilderType<"videosYoutube">;

export function VideosYoutube({ title }: VideosYoutubeProps) {
  const [loading, setLoading] = useState(true);
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

  const handleLoaded = () => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <section id="videos-youtube">
      <div className="container mx-auto px-4 md:px-6 space-y-6 text-center">
        <h1 className="text-4xl lg:text-5xl font-semibold">{title}</h1>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 p-0 min-h-screen">
          {loading && (
            <div className="absolute top-0 flex items-center justify-center h-72 w-full">
              <LoaderCircle
                className="animate-spin text-primary"
                size={24}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          )}
          {videos.map((video) => (
            <div key={video.id} className="bg-background rounded-lg p-0">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.id}?modestbranding=1&rel=0&controls=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md"
                  style={{ border: "none", opacity: loading ? 0 : 1 }}
                  onLoad={handleLoaded}
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
