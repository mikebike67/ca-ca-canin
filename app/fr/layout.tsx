import type { Metadata } from "next";
import DocumentLanguage from "@/components/document-language";

export const metadata: Metadata = {
  title: "Ramassage de déjections canines Laval & Rive-Nord | Ca-Ca Canin",
  description: "Service de ramassage de déjections canines et de crottes de chien à Laval et dans certaines villes de la Rive-Nord. Tarifs clairs, horaires flexibles et devis rapide avec Ca-Ca Canin.",
  keywords: [
    "ramassage de déjections canines Laval",
    "ramassage de crottes de chien Laval",
    "nettoyage printanier Laval",
    "service de ramassage de crottes de chien Laval",
    "ramassage de déjections canines Rive-Nord",
  ],
  alternates: {
    canonical: "/fr",
    languages: {
      en: "/",
      fr: "/fr"
    }
  },
  openGraph: {
    title: "Ramassage de déjections canines Laval & Rive-Nord | Ca-Ca Canin",
    description: "Service de ramassage de déjections canines et de crottes de chien à Laval et dans certaines villes de la Rive-Nord avec tarifs clairs et horaires flexibles.",
    type: "website",
    url: "/fr",
    siteName: "Ca-Ca Canin",
    locale: "fr_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ca-Ca Canin service de ramassage de déjections canines à Laval et sur la Rive-Nord",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ramassage de déjections canines Laval & Rive-Nord | Ca-Ca Canin",
    description: "Service de ramassage de déjections canines et de crottes de chien à Laval et dans certaines villes de la Rive-Nord avec tarifs clairs et horaires flexibles.",
    images: ["/images/cacacaninlogo.jpg"],
  }
};

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DocumentLanguage lang="fr" />
      {children}
    </>
  );
}
