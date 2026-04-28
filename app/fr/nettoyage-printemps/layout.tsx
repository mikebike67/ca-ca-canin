import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nettoyage printanier Laval & Rive-Nord | Ca-Ca Canin",
  description: "Nettoyage printanier des déjections canines à Laval et dans certaines villes de la Rive-Nord à partir de 60 $. Demandez un devis rapide pour un nettoyage ponctuel et du ramassage de crottes de chien.",
  keywords: [
    "nettoyage printanier Laval",
    "ramassage de déjections canines Laval",
    "ramassage de crottes de chien Laval",
    "service de ramassage de crottes de chien Laval",
    "Rive-Nord",
  ],
  alternates: {
    canonical: "/fr/nettoyage-printemps",
    languages: {
      en: "/spring-cleanup",
      fr: "/fr/nettoyage-printemps"
    }
  },
  openGraph: {
    title: "Nettoyage printanier Laval & Rive-Nord | Ca-Ca Canin",
    description: "Nettoyage printanier des déjections canines à Laval et dans certaines villes de la Rive-Nord à partir de 60 $. Demandez un devis rapide pour un nettoyage ponctuel et du ramassage de crottes de chien.",
    type: "website",
    url: "/fr/nettoyage-printemps",
    siteName: "Ca-Ca Canin",
    locale: "fr_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ca-Ca Canin nettoyage printanier à Laval et sur la Rive-Nord",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Nettoyage printanier Laval & Rive-Nord | Ca-Ca Canin",
    description: "Nettoyage printanier des déjections canines à Laval et dans certaines villes de la Rive-Nord à partir de 60 $. Demandez un devis rapide pour un nettoyage ponctuel et du ramassage de crottes de chien.",
    images: ["/images/cacacaninlogo.jpg"],
  },
};

export default function SpringCleanupFrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
