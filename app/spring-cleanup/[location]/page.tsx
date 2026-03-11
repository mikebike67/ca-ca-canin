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
    title: `Spring Dog Poop Cleanup in ${location.name}, QC | Ca-Ca Canin`,
    description: `${location.introEn} Request a fast quote for one-time spring cleanup with Ca-Ca Canin.`,
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
      url: `/spring-cleanup/${location.slug}`,
      siteName: "Ca-Ca Canin",
      locale: "en_CA",
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

  return (
    <SpringCleanupLocationPage
      locale="en"
      location={location}
    />
  );
}
