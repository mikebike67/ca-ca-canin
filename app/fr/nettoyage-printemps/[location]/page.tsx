import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SpringCleanupLocationPage from "@/components/spring-cleanup-location-page";
import {
  SPRING_CLEANUP_LOCATIONS,
  getSpringCleanupLocationBySlug,
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
    description: `${location.introFr} Prefixes FSA desservis : ${location.fsaPrefixes.join(", ")}.`,
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

  const relatedLocations = SPRING_CLEANUP_LOCATIONS.filter(
    (item) => item.slug !== location.slug,
  ).slice(0, 8);

  return (
    <SpringCleanupLocationPage
      locale="fr"
      location={location}
      relatedLocations={relatedLocations}
    />
  );
}
