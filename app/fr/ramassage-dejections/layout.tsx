import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ramassage de déjections canines Laval & Rive-Nord | Ca-Ca Canin",
  description: "Service régulier de ramassage de déjections canines à Laval et dans certaines villes de la Rive-Nord à partir de 20 $/visite. Hebdomadaire, aux deux semaines ou mensuel avec Ca-Ca Canin.",
  keywords: [
    "ramassage de déjections canines Laval",
    "ramassage de crottes de chien Laval",
    "service de ramassage de crottes de chien Laval",
    "ramassage dejections canines Rive-Nord",
    "service régulier ramassage crottes chien",
  ],
  alternates: {
    canonical: "/fr/ramassage-dejections",
    languages: {
      en: "/dog-poop-cleanup",
      fr: "/fr/ramassage-dejections",
    },
  },
  openGraph: {
    title: "Ramassage de déjections canines Laval & Rive-Nord | Ca-Ca Canin",
    description: "Service régulier de ramassage de déjections canines à Laval et dans certaines villes de la Rive-Nord à partir de 20 $/visite. Hebdomadaire, aux deux semaines ou mensuel avec Ca-Ca Canin.",
    type: "website",
    url: "/fr/ramassage-dejections",
    siteName: "Ca-Ca Canin",
    locale: "fr_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ca-Ca Canin ramassage de déjections canines à Laval et sur la Rive-Nord",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ramassage de déjections canines Laval & Rive-Nord | Ca-Ca Canin",
    description: "Service régulier de ramassage de déjections canines à Laval et dans certaines villes de la Rive-Nord à partir de 20 $/visite. Hebdomadaire, aux deux semaines ou mensuel avec Ca-Ca Canin.",
    images: ["/images/cacacaninlogo.jpg"],
  },
};

export default function RamassageDejectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
