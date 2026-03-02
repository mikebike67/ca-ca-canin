import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spring Dog Poop Cleanup in Laval, QC | Ca-Ca Canin",
  description: "Spring dog poop cleanup in Laval, QC starting at $60. Limited spring spots. Get a fast quote from Ca-Ca Canin.",
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
