import { useEffect, useRef, useState } from "react";

export const useScrollHeight = () => {
  const [scrollHeight, setScrollHeight] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearPending = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleScroll = () => {
      clearPending();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setScrollHeight(window.scrollY);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearPending();
    };
  }, []);

  return scrollHeight;
};
