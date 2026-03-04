import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nettoyage printanier des déjections canines à Laval, QC | Ca-Ca Canin",
  description: "Nettoyage printanier des déjections canines à Laval, QC à partir de 60 $. Demandez un devis rapide pour un nettoyage ponctuel.",
  alternates: {
    languages: {
      en: "/spring-cleanup",
      fr: "/fr/nettoyage-printemps"
    }
  }
};

export default function SpringCleanupFrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
