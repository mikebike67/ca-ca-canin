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
    title: `Nettoyage printanier des dejections canines a ${location.nameFr}, QC | Ca-Ca Canin`,
    description: `${location.introFr} Demandez un devis rapide pour un nettoyage ponctuel avec Ca-Ca Canin.`,
    alternates: {
      canonical: `/fr/nettoyage-printemps/${location.slug}`,
      languages: {
        en: `/spring-cleanup/${location.slug}`,
        fr: `/fr/nettoyage-printemps/${location.slug}`,
      },
    },
    openGraph: {
      title: `Nettoyage printanier des dejections canines a ${location.nameFr}, QC | Ca-Ca Canin`,
      description: location.introFr,
      type: "website",
      url: `/fr/nettoyage-printemps/${location.slug}`,
      siteName: "Ca-Ca Canin",
      locale: "fr_CA",
    },
    twitter: {
      card: "summary",
      title: `Nettoyage printanier des dejections canines a ${location.nameFr}, QC | Ca-Ca Canin`,
      description: location.introFr,
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
