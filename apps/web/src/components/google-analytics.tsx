"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const hasTrackedInitial = useRef(false);

  // Track client-side navigation (SPA route changes)
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
    // Skip initial mount — the inline script already sent the first page_view
    if (!hasTrackedInitial.current) {
      hasTrackedInitial.current = true;
      return;
    }
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
            document.head.appendChild(s);
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
