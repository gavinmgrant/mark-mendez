import "@workspace/ui/globals.css";

import { revalidatePath, revalidateTag } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { Suspense } from "react";
import { preconnect, prefetchDNS } from "react-dom";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { NavbarServer, NavbarSkeleton } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { PageTransition } from "@/components/page-transition";
import { SanityLive } from "@/lib/sanity/live";

import { Providers } from "../components/providers";

const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4163940690666529"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${fontGeist.variable} ${fontMono.variable} font-geist antialiased`}
      >
        <Providers>
          <Suspense fallback={<NavbarSkeleton />}>
            <NavbarServer />
          </Suspense>
          {(await draftMode()).isEnabled ? (
            <>
              {children}
              <VisualEditing
                refresh={async (payload) => {
                  "use server";
                  if (payload.source === "manual") {
                    revalidatePath("/", "layout");
                    return;
                  }
                  const id = payload?.document?._id?.startsWith("drafts.")
                    ? payload?.document?._id.slice(7)
                    : payload?.document?._id;
                  const slug = payload?.document?.slug?.current;
                  const type = payload?.document?._type;
                  // Revalidate tags - Next.js 15.6 canary requires cache type as second argument
                  if (slug && typeof slug === "string") {
                    revalidateTag(slug, "fetch");
                  }
                  if (id && typeof id === "string") {
                    revalidateTag(id, "fetch");
                  }
                  if (type && typeof type === "string") {
                    revalidateTag(type, "fetch");
                  }
                }}
              />
              <PreviewBar />
            </>
          ) : (
            <PageTransition>{children}</PageTransition>
          )}
          <Suspense fallback={<FooterSkeleton />}>
            <FooterServer />
          </Suspense>
          <SanityLive />
        </Providers>
      </body>
    </html>
  );
}
