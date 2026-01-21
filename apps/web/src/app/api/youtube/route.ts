import { XMLParser } from "fast-xml-parser";
import { NextResponse } from "next/server";

const CHANNEL_ID = "UC3BoTy-rJDo0VleCDfY730Q";
const RSS_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Revalidate YouTube feed every 6 hours (videos don't change that frequently)
export const revalidate = 21600;

export async function GET() {
  try {
    const res = await fetch(RSS_FEED_URL);
    if (!res.ok) throw new Error("Failed to fetch RSS feed");

    const text = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      alwaysCreateTextNode: true, // Ensures even empty tags are retained
    });

    const data = parser.parse(text);

    // Reduce to the most recent 12 videos
    data.feed.entry = data.feed.entry.slice(0, 12);

    const videos = data.feed.entry.map((video: any) => {
      return {
        id: video["yt:videoId"]?.["#text"],
        title: video.title?.["#text"],
        link: video.link?.["@_href"] || "", // Safely get href
        thumbnail: `https://i.ytimg.com/vi/${video["yt:videoId"]?.["#text"]}/mqdefault.jpg`,
        published: video.published?.["#text"],
      };
    });

    const response = NextResponse.json(videos);
    // Cache for 6 hours with stale-while-revalidate for 1 hour
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=21600, stale-while-revalidate=3600",
    );
    return response;
  } catch (error: any) {
    const errorResponse = NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
    // Cache errors briefly to prevent repeated failures
    errorResponse.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=30",
    );
    return errorResponse;
  }
}
