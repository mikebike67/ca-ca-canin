import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RegularServiceLocationPage from "@/components/regular-service-location-page";
import {
  getRegularServiceLocationBySlug,
  REGULAR_SERVICE_LOCATIONS,
} from "@/lib/regular-service-area";

type LocationPageProps = {
  params: {
    location: string;
  };
};

export function generateStaticParams() {
  return REGULAR_SERVICE_LOCATIONS.map((location) => ({
    location: location.slug,
  }));
}

export function generateMetadata({ params }: LocationPageProps): Metadata {
  const location = getRegularServiceLocationBySlug(params.location);

  if (!location) return {};

  return {
    title: `Dog Poop Cleanup in ${location.name}, QC | Ca-Ca Canin`,
    description: `${location.regularIntroEn} Request a fast quote for recurring dog poop cleanup and pooper scooper service with Ca-Ca Canin.`,
    keywords: [
      location.regularPrimaryKeywordEn,
      location.regularSecondaryKeywordEn,
      `dog waste removal ${location.name}`,
      `pet waste removal ${location.name}`,
      `${location.name} QC`,
    ],
    alternates: {
      canonical: `/dog-poop-cleanup/${location.slug}`,
      languages: {
        en: `/dog-poop-cleanup/${location.slug}`,
        fr: `/fr/ramassage-dejections/${location.slug}`,
      },
    },
    openGraph: {
      title: `Dog Poop Cleanup in ${location.name}, QC | Ca-Ca Canin`,
      description: location.regularIntroEn,
      type: "website",
      url: `/dog-poop-cleanup/${location.slug}`,
      siteName: "Ca-Ca Canin",
      locale: "en_CA",
      images: [
        {
          url: "/images/cacacaninlogo.jpg",
          width: 1200,
          height: 630,
          alt: `Dog poop cleanup in ${location.name} by Ca-Ca Canin`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `Dog Poop Cleanup in ${location.name}, QC | Ca-Ca Canin`,
      description: location.regularIntroEn,
      images: ["/images/cacacaninlogo.jpg"],
    },
  };
}

export default function LocationPage({ params }: LocationPageProps) {
  const location = getRegularServiceLocationBySlug(params.location);

  if (!location) notFound();

  return <RegularServiceLocationPage locale="en" location={location} />;
}
