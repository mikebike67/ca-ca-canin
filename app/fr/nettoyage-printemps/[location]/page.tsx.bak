import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SpringCleanupLocationPage from "@/components/spring-cleanup-location-page";
import {
  getSpringCleanupLocationBySlug,
  SPRING_CLEANUP_LOCATIONS,
} from "@/lib/spring-cleanup-service-area";

type LocationPageProps = {
  params: {
    location: string;
  };
};

export function generateStaticParams() {
  return SPRING_CLEANUP_LOCATIONS.map((location) => ({
    location: location.slug,
  }));
}

export function generateMetadata({ params }: LocationPageProps): Metadata {
  const location = getSpringCleanupLocationBySlug(params.location);

  if (!location) {
    return {};
  }

  return {
    title: `Nettoyage printanier des déjections canines à ${location.nameFr}, QC | Ca-Ca Canin`,
    description: `${location.introFr} Demandez un devis rapide pour un nettoyage ponctuel, du ramassage de crottes de chien et du nettoyage de cour avec Ca-Ca Canin.`,
    keywords: [
      location.primaryKeywordFr,
      location.secondaryKeywordFr,
      `nettoyage printanier ${location.nameFr}`,
      `ramassage de crottes de chien ${location.nameFr}`,
      `${location.nameFr} QC`,
    ],
    alternates: {
      canonical: `/fr/nettoyage-printemps/${location.slug}`,
      languages: {
        en: `/spring-cleanup/${location.slug}`,
        fr: `/fr/nettoyage-printemps/${location.slug}`,
      },
    },
    openGraph: {
      title: `Nettoyage printanier des déjections canines à ${location.nameFr}, QC | Ca-Ca Canin`,
      description: location.introFr,
      type: "website",
      url: `/fr/nettoyage-printemps/${location.slug}`,
      siteName: "Ca-Ca Canin",
      locale: "fr_CA",
      images: [
        {
          url: "/images/cacacaninlogo.jpg",
          width: 1200,
          height: 630,
          alt: `Nettoyage printanier à ${location.nameFr} par Ca-Ca Canin`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `Nettoyage printanier des déjections canines à ${location.nameFr}, QC | Ca-Ca Canin`,
      description: location.introFr,
      images: ["/images/cacacaninlogo.jpg"],
    },
  };
}

export default function LocationPage({ params }: LocationPageProps) {
  const location = getSpringCleanupLocationBySlug(params.location);

  if (!location) {
    notFound();
  }

  return (
    <SpringCleanupLocationPage
      locale="fr"
      location={location}
    />
  );
}
