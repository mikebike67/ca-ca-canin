import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
  description: "Recurring dog poop cleanup in Laval and select North Shore locations starting at $20/visit. Weekly, biweekly, or monthly pooper scooper service with Ca-Ca Canin.",
  keywords: [
    "dog poop cleanup Laval",
    "dog waste removal Laval",
    "pooper scooper service Laval",
    "recurring dog poop cleanup North Shore",
    "dog waste removal Laval North Shore",
  ],
  alternates: {
    canonical: "/dog-poop-cleanup",
    languages: {
      en: "/dog-poop-cleanup",
      fr: "/fr/ramassage-dejections",
    },
  },
  openGraph: {
    title: "Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
    description: "Recurring dog poop cleanup in Laval and select North Shore locations starting at $20/visit. Weekly, biweekly, or monthly pooper scooper service with Ca-Ca Canin.",
    type: "website",
    url: "/dog-poop-cleanup",
    siteName: "Ca-Ca Canin",
    locale: "en_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ca-Ca Canin dog poop cleanup in Laval and the North Shore",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
    description: "Recurring dog poop cleanup in Laval and select North Shore locations starting at $20/visit. Weekly, biweekly, or monthly pooper scooper service with Ca-Ca Canin.",
    images: ["/images/cacacaninlogo.jpg"],
  },
};

export default function DogPoopCleanupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
