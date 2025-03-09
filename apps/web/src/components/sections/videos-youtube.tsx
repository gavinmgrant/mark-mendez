"use client";

import { useEffect, useState } from "react";
import type { PagebuilderType } from "@/types";

interface Video {
  id: string;
  title: string;
  link: string;
  published: string;
}

type VideosYoutubeProps = PagebuilderType<"videosYoutube">;

export function VideosYoutube({ title }: VideosYoutubeProps) {
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

  return (
    <section id="videos-youtube">
      <div className="container mx-auto px-4 md:px-6 space-y-6 text-center">
        <h1 className="text-4xl lg:text-5xl font-semibold">{title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-background rounded-lg shadow-md p-2"
            >
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.id}?modestbranding=1&rel=0&controls=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md"
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
