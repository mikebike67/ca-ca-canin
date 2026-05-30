import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spring Into Service Promo | Ca-Ca Canin — Laval",
  description:
    "Get 50% off your first dog waste removal cleaning when you sign up for recurring service. Ca-Ca Canin serves Laval. Offer valid until June 20.",
  keywords: [
    "dog poop cleanup spring promo",
    "dog waste removal Laval",
    "50% off first cleaning",
    "recurring dog waste service",
    "Ca-Ca Canin spring offer",
  ],
  alternates: {
    canonical: "/spring-into-service",
    languages: {
      en: "/spring-into-service",
      fr: "/fr/printemps-en-service",
    },
  },
  openGraph: {
    title: "Spring Into Service Promo | Ca-Ca Canin — Laval",
    description:
      "Get 50% off your first dog waste removal cleaning when you sign up for recurring service. Ca-Ca Canin serves Laval. Offer valid until June 20.",
    type: "website",
    url: "/spring-into-service",
    siteName: "Ca-Ca Canin",
    locale: "en_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ca-Ca Canin Spring Into Service promo — 50% off first cleaning",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Spring Into Service Promo | Ca-Ca Canin — Laval",
    description:
      "Get 50% off your first dog waste removal cleaning when you sign up for recurring service. Ca-Ca Canin serves Laval. Offer valid until June 20.",
    images: ["/images/cacacaninlogo.jpg"],
  },
};

export default function SpringIntoServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
