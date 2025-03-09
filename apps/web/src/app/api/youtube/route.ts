import { XMLParser } from "fast-xml-parser";
import { NextResponse } from "next/server";

const CHANNEL_ID = "UC3BoTy-rJDo0VleCDfY730Q";
const RSS_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

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

    // Reduce to the most recent 10 videos
    data.feed.entry = data.feed.entry.slice(0, 10);

    const videos = data.feed.entry.map((video: any) => {
      return {
        id: video["yt:videoId"]?.["#text"],
        title: video.title?.["#text"],
        link: video.link?.["@_href"] || "", // Safely get href
        thumbnail: `https://i.ytimg.com/vi/${video["yt:videoId"]?.["#text"]}/mqdefault.jpg`,
        published: video.published?.["#text"],
      };
    });

    return NextResponse.json(videos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
