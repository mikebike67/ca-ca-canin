import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spring Dog Poop Cleanup in Laval & North Shore, QC | Ca-Ca Canin",
  description: "Spring dog poop cleanup in Laval and select North Shore locations starting at $60. Request a fast quote for one-time yard cleanup with Ca-Ca Canin.",
  alternates: {
    canonical: "/spring-cleanup",
    languages: {
      en: "/spring-cleanup",
      fr: "/fr/nettoyage-printemps"
    }
  },
  openGraph: {
    title: "Spring Dog Poop Cleanup in Laval & North Shore, QC | Ca-Ca Canin",
    description: "Spring dog poop cleanup in Laval and select North Shore locations starting at $60. Request a fast quote for one-time yard cleanup with Ca-Ca Canin.",
    type: "website",
    url: "/spring-cleanup",
    siteName: "Ca-Ca Canin",
    locale: "en_CA",
  },
  twitter: {
    card: "summary",
    title: "Spring Dog Poop Cleanup in Laval & North Shore, QC | Ca-Ca Canin",
    description: "Spring dog poop cleanup in Laval and select North Shore locations starting at $60. Request a fast quote for one-time yard cleanup with Ca-Ca Canin.",
  },
};

export default function SpringCleanupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
