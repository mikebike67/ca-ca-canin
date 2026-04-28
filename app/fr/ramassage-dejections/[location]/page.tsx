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
    title: `Ramassage de déjections canines à ${location.nameFr}, QC | Ca-Ca Canin`,
    description: `${location.regularIntroFr} Demandez un devis rapide pour un service régulier de ramassage de crottes de chien avec Ca-Ca Canin.`,
    keywords: [
      location.regularPrimaryKeywordFr,
      location.regularSecondaryKeywordFr,
      `ramassage de crottes de chien ${location.nameFr}`,
      `nettoyage printanier ${location.nameFr}`,
      `${location.nameFr} QC`,
    ],
    alternates: {
      canonical: `/fr/ramassage-dejections/${location.slug}`,
      languages: {
        en: `/dog-poop-cleanup/${location.slug}`,
        fr: `/fr/ramassage-dejections/${location.slug}`,
      },
    },
    openGraph: {
      title: `Ramassage de déjections canines à ${location.nameFr}, QC | Ca-Ca Canin`,
      description: location.regularIntroFr,
      type: "website",
      url: `/fr/ramassage-dejections/${location.slug}`,
      siteName: "Ca-Ca Canin",
      locale: "fr_CA",
      images: [
        {
          url: "/images/cacacaninlogo.jpg",
          width: 1200,
          height: 630,
          alt: `Ramassage de déjections canines à ${location.nameFr} par Ca-Ca Canin`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `Ramassage de déjections canines à ${location.nameFr}, QC | Ca-Ca Canin`,
      description: location.regularIntroFr,
      images: ["/images/cacacaninlogo.jpg"],
    },
  };
}

export default function LocationPage({ params }: LocationPageProps) {
  const location = getRegularServiceLocationBySlug(params.location);

  if (!location) notFound();

  return <RegularServiceLocationPage locale="fr" location={location} />;
}
