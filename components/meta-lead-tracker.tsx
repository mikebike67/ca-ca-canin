'use client'

import Script from "next/script";

type MetaLeadTrackerProps = {
  contentName: string;
  contentCategory: string;
};

export default function MetaLeadTracker({ contentName, contentCategory }: MetaLeadTrackerProps) {
  const eventKey = `lead:${contentCategory}:${contentName}`;

  return (
    <Script id="meta-lead-event" strategy="afterInteractive">
      {`
        (function() {
          var eventKey = ${JSON.stringify(eventKey)};
          var contentName = ${JSON.stringify(contentName)};
          var contentCategory = ${JSON.stringify(contentCategory)};
          var guardKey = "__cacacaninMetaLeadEvent";
          var attempts = 0;
          var maxAttempts = 40;

          window[guardKey] = window[guardKey] || {};
          if (window[guardKey][eventKey]) return;

          function trackLead() {
            if (window[guardKey][eventKey]) return;

            if (typeof window.fbq === "function") {
              window[guardKey][eventKey] = true;
              window.fbq("track", "Lead", {
                content_name: contentName,
                content_category: contentCategory
              });
              return;
            }

            attempts += 1;
            if (attempts < maxAttempts) {
              window.setTimeout(trackLead, 250);
            }
          }

          trackLead();
        })();
      `}
    </Script>
  );
}
