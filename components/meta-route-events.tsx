'use client'

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    __cacacaninMetaLeadEvent?: Record<string, boolean>;
  }
}

const leadLabels = {
  contact: {
    en: "Contact request",
    fr: "Message de contact",
  },
  quote: {
    en: "Quote request",
    fr: "Demande de devis",
  },
  spring: {
    en: "Spring cleanup request",
    fr: "Demande de nettoyage printanier",
  },
} as const;

type LeadType = keyof typeof leadLabels;
type Locale = "en" | "fr";

export default function MetaRouteEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    if (pathname !== "/thank-you") return;

    const params = new URLSearchParams(search);
    const locale: Locale = params.get("lang") === "fr" ? "fr" : "en";
    const typeParam = params.get("type");
    const type: LeadType = typeParam === "contact" || typeParam === "spring" ? typeParam : "quote";
    const eventKey = `lead:${locale}:${type}:${search}`;
    const payload = {
      content_name: leadLabels[type][locale],
      content_category: type,
    };

    window.__cacacaninMetaLeadEvent = window.__cacacaninMetaLeadEvent || {};
    if (window.__cacacaninMetaLeadEvent[eventKey]) return;

    let attempts = 0;
    const maxAttempts = 40;
    let timeoutId: number | undefined;

    const trackLead = () => {
      if (window.__cacacaninMetaLeadEvent?.[eventKey]) return;

      if (typeof window.fbq === "function") {
        window.__cacacaninMetaLeadEvent = window.__cacacaninMetaLeadEvent || {};
        window.__cacacaninMetaLeadEvent[eventKey] = true;
        window.fbq("track", "Lead", payload);
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        timeoutId = window.setTimeout(trackLead, 250);
      }
    };

    trackLead();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [pathname, search]);

  return null;
}
