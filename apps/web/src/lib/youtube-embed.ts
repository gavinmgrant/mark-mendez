const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

function isAllowedYoutubeHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "youtu.be" || h === "www.youtu.be") return true;
  if (h === "youtube.com" || h.endsWith(".youtube.com")) return true;
  if (h === "youtube-nocookie.com" || h.endsWith(".youtube-nocookie.com"))
    return true;
  return false;
}

function firstPathSegment(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] ?? null;
}

function secondPathSegment(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  return parts[1] ?? null;
}

function extractIdFromWatchPath(pathname: string): string | null {
  const path = pathname.replace(/\/$/, "") || "/";
  if (!path.startsWith("/watch")) return null;
  const afterWatch = path.slice("/watch".length);
  if (!afterWatch.startsWith("/")) return null;
  const segment = afterWatch.slice(1).split("/")[0]?.split("?")[0] ?? "";
  return segment && YOUTUBE_ID_RE.test(segment) ? segment : null;
}

/**
 * Returns a privacy-enhanced YouTube embed URL, or null if the URL is not a
 * recognized YouTube watch / embed / shorts / live / youtu.be link.
 */
export function getYoutubeEmbedSrc(videoUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(videoUrl);
  } catch {
    return null;
  }

  if (!isAllowedYoutubeHost(url.hostname)) return null;

  let id: string | null = null;
  const host = url.hostname.toLowerCase();

  if (host === "youtu.be" || host === "www.youtu.be") {
    id = firstPathSegment(url.pathname);
  } else {
    const path = url.pathname.replace(/\/$/, "") || "/";

    if (path === "/watch" || path.startsWith("/watch/")) {
      id = url.searchParams.get("v");
      if (!id) {
        id = extractIdFromWatchPath(url.pathname);
      }
    } else if (path.startsWith("/embed/")) {
      id = secondPathSegment(url.pathname);
    } else if (path.startsWith("/shorts/")) {
      id = secondPathSegment(url.pathname);
    } else if (path.startsWith("/live/")) {
      id = secondPathSegment(url.pathname);
    } else if (path.startsWith("/v/")) {
      id = secondPathSegment(url.pathname);
    }
  }

  if (!id || !YOUTUBE_ID_RE.test(id)) return null;

  return `https://www.youtube-nocookie.com/embed/${id}`;
}
