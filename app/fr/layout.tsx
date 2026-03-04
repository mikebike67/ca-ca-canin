import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ramassage de déjections canines à Laval, QC | Ca-Ca Canin",
  description: "Service de ramassage de déjections canines à Laval, QC. Tarifs clairs, horaires flexibles et devis rapide avec Ca-Ca Canin.",
  alternates: {
    languages: {
      en: "/",
      fr: "/fr"
    }
  },
  openGraph: {
    title: "Ramassage de déjections canines à Laval, QC | Ca-Ca Canin",
    description: "Service de ramassage de déjections canines à Laval, QC avec tarifs clairs et horaires flexibles.",
    type: "website",
    locale: "fr_CA"
  },
  twitter: {
    card: "summary",
    title: "Ramassage de déjections canines à Laval, QC | Ca-Ca Canin",
    description: "Service de ramassage de déjections canines à Laval, QC avec tarifs clairs et horaires flexibles."
  }
};

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
