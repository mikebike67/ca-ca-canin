import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nettoyage de printemps à Laval, QC | Ca-Ca Canin",
  description: "Nettoyage de printemps des déjections canines à Laval, QC à partir de 60 $. Places limitées. Obtenez un devis rapidement.",
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
