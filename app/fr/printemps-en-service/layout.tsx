import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promo Printemps en Service | Ca-Ca Canin — Laval",
  description:
    "Obtenez 50 % de rabais sur votre premier nettoyage lors de l'inscription à un service récurrent. Ca-Ca Canin dessert Laval. Offre valide jusqu'au 20 juin.",
  keywords: [
    "ramassage déjections printemps promo",
    "ramassage déjections Laval",
    "50% de rabais premier nettoyage",
    "service récurrent chien Laval",
    "Ca-Ca Canin promo printemps",
  ],
  alternates: {
    canonical: "/fr/printemps-en-service",
    languages: {
      en: "/spring-into-service",
      fr: "/fr/printemps-en-service",
    },
  },
  openGraph: {
    title: "Promo Printemps en Service | Ca-Ca Canin — Laval",
    description:
      "Obtenez 50 % de rabais sur votre premier nettoyage lors de l'inscription à un service récurrent. Ca-Ca Canin dessert Laval. Offre valide jusqu'au 20 juin.",
    type: "website",
    url: "/fr/printemps-en-service",
    siteName: "Ca-Ca Canin",
    locale: "fr_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ca-Ca Canin Promo Printemps en Service — 50 % de rabais premier nettoyage",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Promo Printemps en Service | Ca-Ca Canin — Laval",
    description:
      "Obtenez 50 % de rabais sur votre premier nettoyage lors de l'inscription à un service récurrent. Ca-Ca Canin dessert Laval. Offre valide jusqu'au 20 juin.",
    images: ["/images/cacacaninlogo.jpg"],
  },
};

export default function PrintempsenServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
