import {
  SPRING_CLEANUP_ALLOWED_FSA_PREFIXES,
  SPRING_CLEANUP_LOCATIONS,
  type SpringCleanupLocation,
} from "@/lib/spring-cleanup-service-area";

export type RegularServiceLocation = SpringCleanupLocation & {
  regularPrimaryKeywordEn: string;
  regularSecondaryKeywordEn: string;
  regularPrimaryKeywordFr: string;
  regularSecondaryKeywordFr: string;
  regularIntroEn: string;
  regularIntroFr: string;
  regularFitEn: string;
  regularFitFr: string;
  regularTimingEn: string;
  regularTimingFr: string;
};

export const REGULAR_SERVICE_LOCATIONS: readonly RegularServiceLocation[] = SPRING_CLEANUP_LOCATIONS.map((location) => ({
  ...location,
  regularPrimaryKeywordEn: `dog poop cleanup ${location.name}`,
  regularSecondaryKeywordEn: `pooper scooper service ${location.name}`,
  regularPrimaryKeywordFr: `ramassage de déjections canines ${location.nameFr}`,
  regularSecondaryKeywordFr: `service de ramassage de crottes de chien ${location.nameFr}`,
  regularIntroEn: `Recurring dog poop cleanup in ${location.name} for homeowners who want a cleaner yard without handling the weekly mess themselves.`,
  regularIntroFr: `Service régulier de ramassage de déjections canines à ${location.nameFr} pour les propriétaires qui veulent une cour plus propre sans gérer eux-mêmes la corvée chaque semaine.`,
  regularFitEn: `The service is built around real yard size, dog count, and how often the space gets used, so the cleanup schedule stays practical for the property.`,
  regularFitFr: `Le service est organisé selon la vraie taille du terrain, le nombre de chiens et la fréquence d'utilisation de la cour, afin de garder un horaire de nettoyage réaliste pour la propriété.`,
  regularTimingEn: `Most quote requests are reviewed quickly, and recurring service is usually confirmed within 1 business day when route space is available.`,
  regularTimingFr: `La plupart des demandes de devis sont traitées rapidement, et le service régulier se confirme habituellement en 1 jour ouvrable lorsqu'une place est disponible sur la route.`,
}));

export const REGULAR_SERVICE_ALLOWED_FSA_PREFIXES = SPRING_CLEANUP_ALLOWED_FSA_PREFIXES;

const locationBySlug = new Map(
  REGULAR_SERVICE_LOCATIONS.map((location) => [location.slug, location]),
);

const normalizePostalCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

export function getRegularServiceLocationBySlug(slug: string) {
  return locationBySlug.get(slug);
}

export function isRegularServicePostalCode(value: string) {
  const normalized = normalizePostalCode(value);
  return REGULAR_SERVICE_ALLOWED_FSA_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}
