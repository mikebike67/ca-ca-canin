import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nettoyage printanier des déjections canines à Laval et sur la Rive-Nord, QC | Ca-Ca Canin",
  description: "Nettoyage printanier des déjections canines à Laval et dans certaines villes de la Rive-Nord à partir de 60 $. Demandez un devis rapide pour un nettoyage ponctuel.",
  alternates: {
    canonical: "/fr/nettoyage-printemps",
    languages: {
      en: "/spring-cleanup",
      fr: "/fr/nettoyage-printemps"
    }
  },
  openGraph: {
    title: "Nettoyage printanier des déjections canines à Laval et sur la Rive-Nord, QC | Ca-Ca Canin",
    description: "Nettoyage printanier des déjections canines à Laval et dans certaines villes de la Rive-Nord à partir de 60 $. Demandez un devis rapide pour un nettoyage ponctuel.",
    type: "website",
    url: "/fr/nettoyage-printemps",
    siteName: "Ca-Ca Canin",
    locale: "fr_CA",
  },
  twitter: {
    card: "summary",
    title: "Nettoyage printanier des déjections canines à Laval et sur la Rive-Nord, QC | Ca-Ca Canin",
    description: "Nettoyage printanier des déjections canines à Laval et dans certaines villes de la Rive-Nord à partir de 60 $. Demandez un devis rapide pour un nettoyage ponctuel.",
  },
};

export default function SpringCleanupFrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
