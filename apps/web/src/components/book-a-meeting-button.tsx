"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Calendar } from "lucide-react";
import { getCalApi } from "@calcom/embed-react";

export function BookAMeetingButton() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;
    const getCal = async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        theme: theme === "dark" ? "dark" : "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#171717" },
          dark: { "cal-brand": "#ffffff" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    };
    getCal();
  }, [theme]);

  return (
    <button
      className="rounded-md border h-12 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
      data-cal-namespace="30min"
      data-cal-link="mark-h-mendez-nc8wa9/30min"
      data-cal-config='{"layout":"month_view"}'
    >
      <div className="flex items-center gap-2">
        <Calendar className="shrink-0 w-5 h-5" />{" "}
        <span className="text-sm">Book a meeting</span>
      </div>
    </button>
  );
}
