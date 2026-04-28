import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spring Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
  description: "One-time spring dog poop cleanup in Laval and select North Shore locations starting at $60. Request a fast quote for dog waste removal and yard cleanup with Ca-Ca Canin.",
  keywords: [
    "spring dog poop cleanup Laval",
    "dog poop cleanup Laval",
    "dog waste removal Laval",
    "pooper scooper service Laval",
    "one-time yard cleanup Laval",
  ],
  alternates: {
    canonical: "/spring-cleanup",
    languages: {
      en: "/spring-cleanup",
      fr: "/fr/nettoyage-printemps"
    }
  },
  openGraph: {
    title: "Spring Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
    description: "One-time spring dog poop cleanup in Laval and select North Shore locations starting at $60. Request a fast quote for dog waste removal and yard cleanup with Ca-Ca Canin.",
    type: "website",
    url: "/spring-cleanup",
    siteName: "Ca-Ca Canin",
    locale: "en_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ca-Ca Canin spring dog poop cleanup in Laval and the North Shore",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Spring Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
    description: "One-time spring dog poop cleanup in Laval and select North Shore locations starting at $60. Request a fast quote for dog waste removal and yard cleanup with Ca-Ca Canin.",
    images: ["/images/cacacaninlogo.jpg"],
  },
};

export default function SpringCleanupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
