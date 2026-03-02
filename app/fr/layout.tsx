import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ca-Ca Canin - Service de ramassage de déjections canines à Laval",
  description: "Ca-Ca Canin offre un service fiable de ramassage de déjections canines à Laval, Québec. Obtenez un devis gratuit.",
  alternates: {
    languages: {
      en: "/",
      fr: "/fr"
    }
  },
  openGraph: {
    title: "Ca-Ca Canin - Service de ramassage de déjections canines à Laval",
    description: "Service fiable et sans tracas de ramassage de déjections canines à Laval, Québec.",
    type: "website",
    locale: "fr_CA"
  },
  twitter: {
    card: "summary",
    title: "Ca-Ca Canin - Service de ramassage de déjections canines à Laval",
    description: "Service fiable et sans tracas de ramassage de déjections canines à Laval, Québec."
  }
};

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
