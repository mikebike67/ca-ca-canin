'use client'

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type MetaLeadTrackerProps = {
  contentName: string;
  contentCategory: string;
};

export default function MetaLeadTracker({ contentName, contentCategory }: MetaLeadTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;

    let attempts = 0;
    const maxAttempts = 20;

    const trackLead = () => {
      if (trackedRef.current) return;

      if (window.fbq) {
        trackedRef.current = true;
        window.fbq("track", "Lead", {
          content_name: contentName,
          content_category: contentCategory,
        });
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        window.setTimeout(trackLead, 250);
      }
    };

    trackLead();
  }, [contentCategory, contentName]);

  return null;
}
