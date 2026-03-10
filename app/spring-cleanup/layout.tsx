import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spring Dog Poop Cleanup in Laval & North Shore, QC | Ca-Ca Canin",
  description: "Spring dog poop cleanup in Laval and select North Shore locations starting at $60. Request a fast quote for one-time yard cleanup with Ca-Ca Canin.",
  alternates: {
    languages: {
      en: "/spring-cleanup",
      fr: "/fr/nettoyage-printemps"
    }
  }
};

export default function SpringCleanupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
