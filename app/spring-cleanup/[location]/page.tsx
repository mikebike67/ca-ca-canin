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
    title: `Spring Dog Poop Cleanup in ${location.name}, QC | Ca-Ca Canin`,
    description: `${location.introEn} Serving FSA prefixes ${location.fsaPrefixes.join(", ")}.`,
    alternates: {
      canonical: `/spring-cleanup/${location.slug}`,
      languages: {
        en: `/spring-cleanup/${location.slug}`,
        fr: `/fr/nettoyage-printemps/${location.slug}`,
      },
    },
    openGraph: {
      title: `Spring Dog Poop Cleanup in ${location.name}, QC | Ca-Ca Canin`,
      description: location.introEn,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Spring Dog Poop Cleanup in ${location.name}, QC | Ca-Ca Canin`,
      description: location.introEn,
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
      locale="en"
      location={location}
      relatedLocations={relatedLocations}
    />
  );
}
