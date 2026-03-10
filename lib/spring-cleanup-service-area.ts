export type SpringCleanupLocation = {
  slug: string;
  name: string;
  nameFr: string;
  fsaPrefixes: readonly string[];
  introEn: string;
  introFr: string;
  fitEn: string;
  fitFr: string;
  timingEn: string;
  timingFr: string;
};

export const SPRING_CLEANUP_LOCATIONS: readonly SpringCleanupLocation[] = [
  {
    slug: "laval",
    name: "Laval",
    nameFr: "Laval",
    fsaPrefixes: ["H7"],
    introEn: "One-time spring dog poop cleanup in Laval with quick scheduling, clear time-based pricing, and a simple quote process.",
    introFr: "Nettoyage printanier ponctuel des dejections canines a Laval avec planification rapide, tarification claire selon le temps et demande de devis simple.",
    fitEn: "Laval yards range from compact suburban lots to deeper family backyards, so spring visits are scoped around access, buildup, and layout instead of a flat guess.",
    fitFr: "Les cours de Laval vont des petits terrains suburbains aux plus grandes cours familiales, donc la visite printaniere est evaluee selon l'acces, l'accumulation et l'amenagement plutot qu'avec un prix arbitraire.",
    timingEn: "If your Laval address falls under an H7 postal prefix, we can confirm availability through the spring cleanup form before booking.",
    timingFr: "Si votre adresse a Laval commence par le prefixe postal H7, nous pouvons confirmer la disponibilite via le formulaire de nettoyage printanier avant la reservation.",
  },
  {
    slug: "blainville",
    name: "Blainville",
    nameFr: "Blainville",
    fsaPrefixes: ["J7B", "J7C"],
    introEn: "Spring cleanup in Blainville for dog owners who want the yard reset before regular outdoor season starts.",
    introFr: "Nettoyage printanier a Blainville pour les proprietaires de chiens qui veulent remettre la cour en ordre avant le retour de la belle saison.",
    fitEn: "Blainville properties often have larger fenced yards and winter accumulation can spread across more ground, so the service is built around a practical on-site time estimate.",
    fitFr: "Les proprietes de Blainville ont souvent de plus grandes cours cloturees et l'accumulation hivernale peut couvrir plus d'espace, donc le service repose sur une estimation pratique sur place.",
    timingEn: "We currently validate Blainville spring cleanup requests inside the J7B and J7C postal areas.",
    timingFr: "Nous validons actuellement les demandes de nettoyage printanier a Blainville dans les zones postales J7B et J7C.",
  },
  {
    slug: "bois-des-filion",
    name: "Bois-des-Filion",
    nameFr: "Bois-des-Filion",
    fsaPrefixes: ["J6Z"],
    introEn: "Spring dog poop cleanup in Bois-des-Filion with a straightforward quote and a one-time visit built for post-winter buildup.",
    introFr: "Nettoyage printanier des dejections canines a Bois-des-Filion avec devis simple et visite ponctuelle adaptee a l'accumulation de l'apres-hiver.",
    fitEn: "Bois-des-Filion homes can have narrow side access and fenced rear yards, so the visit is planned to stay efficient without rushing the cleanup.",
    fitFr: "Les residences de Bois-des-Filion peuvent avoir des acces lateraux plus etroits et des cours arriere cloturees, donc la visite est planifiee pour rester efficace sans bousculer le nettoyage.",
    timingEn: "Bois-des-Filion availability is currently confirmed for J6Z postal prefixes.",
    timingFr: "La disponibilite a Bois-des-Filion est actuellement confirmee pour les prefixes postaux J6Z.",
  },
  {
    slug: "boisbriand",
    name: "Boisbriand",
    nameFr: "Boisbriand",
    fsaPrefixes: ["J7E", "J7G"],
    introEn: "Spring cleanup in Boisbriand for homeowners who want a cleaner yard without spending the first warm weekend doing the reset themselves.",
    introFr: "Nettoyage printanier a Boisbriand pour les proprietaires qui veulent une cour plus propre sans consacrer leur premier week-end doux au grand menage.",
    fitEn: "Boisbriand yards vary from denser neighbourhood lots to wider family properties, and the service is priced to match the actual cleanup time needed.",
    fitFr: "Les cours de Boisbriand varient entre des terrains de quartiers plus compacts et des proprietes familiales plus larges, et le service est tarifie selon le temps reel requis.",
    timingEn: "We currently serve Boisbriand spring cleanup requests in the J7E and J7G postal areas.",
    timingFr: "Nous desservons actuellement les demandes de nettoyage printanier a Boisbriand dans les zones postales J7E et J7G.",
  },
  {
    slug: "deux-montagnes",
    name: "Deux-Montagnes",
    nameFr: "Deux-Montagnes",
    fsaPrefixes: ["J7R"],
    introEn: "Spring dog poop cleanup in Deux-Montagnes with simple booking and service designed for one concentrated yard reset.",
    introFr: "Nettoyage printanier des dejections canines a Deux-Montagnes avec reservation simple et service concu pour une remise en ordre concentree de la cour.",
    fitEn: "Deux-Montagnes properties often need a focused cleanup after snow melt, especially where waste spread into grass edges or along back fences.",
    fitFr: "Les proprietes de Deux-Montagnes ont souvent besoin d'un nettoyage cible apres la fonte, surtout lorsque les dejections se sont dispersees dans les bordures de gazon ou pres des clotures.",
    timingEn: "Deux-Montagnes requests are currently supported in the J7R postal area.",
    timingFr: "Les demandes a Deux-Montagnes sont actuellement prises en charge dans la zone postale J7R.",
  },
  {
    slug: "lorraine",
    name: "Lorraine",
    nameFr: "Lorraine",
    fsaPrefixes: ["J6Z"],
    introEn: "Spring cleanup in Lorraine for dog owners who want the yard usable again as soon as the snow is gone.",
    introFr: "Nettoyage printanier a Lorraine pour les proprietaires de chiens qui veulent retrouver une cour utilisable des que la neige disparait.",
    fitEn: "Lorraine homes often sit on quiet residential streets with tidy landscaped yards, which makes a thorough spring reset especially useful before regular lawn season.",
    fitFr: "Les maisons de Lorraine se trouvent souvent dans des rues residentielles calmes avec des cours bien amenagees, ce qui rend un grand nettoyage printanier particulierement utile avant la saison du gazon.",
    timingEn: "Lorraine spring cleanup availability is currently confirmed under the J6Z postal prefix.",
    timingFr: "La disponibilite du nettoyage printanier a Lorraine est actuellement confirmee sous le prefixe postal J6Z.",
  },
  {
    slug: "mirabel",
    name: "Mirabel",
    nameFr: "Mirabel",
    fsaPrefixes: ["J7J", "J7N"],
    introEn: "Spring dog poop cleanup in Mirabel with service adapted to larger lots, wider setbacks, and the kind of winter buildup that takes longer to clear by hand.",
    introFr: "Nettoyage printanier des dejections canines a Mirabel avec service adapte aux plus grands terrains, aux marges plus larges et a l'accumulation hivernale qui prend plus de temps a enlever a la main.",
    fitEn: "Mirabel yards can be significantly larger than average, so the quote flow focuses on size and dog count before we confirm the visit.",
    fitFr: "Les cours de Mirabel peuvent etre nettement plus grandes que la moyenne, donc le processus de devis met l'accent sur la superficie et le nombre de chiens avant la confirmation de la visite.",
    timingEn: "We currently validate Mirabel spring cleanup requests in the J7J and J7N postal areas.",
    timingFr: "Nous validons actuellement les demandes de nettoyage printanier a Mirabel dans les zones postales J7J et J7N.",
  },
  {
    slug: "oka",
    name: "Oka",
    nameFr: "Oka",
    fsaPrefixes: ["J0N"],
    introEn: "Spring cleanup in Oka for dog owners who want a clean yard before the property gets busier in warmer weather.",
    introFr: "Nettoyage printanier a Oka pour les proprietaires de chiens qui veulent une cour propre avant que la propriete soit plus active pendant les beaux jours.",
    fitEn: "Oka properties can include broader outdoor space and seasonal buildup hidden by thawing ground cover, so the one-time visit is built to handle a full reset.",
    fitFr: "Les proprietes d'Oka peuvent comprendre de plus grands espaces exterieurs et une accumulation saisonniere cachee par le sol en degel, donc la visite ponctuelle est pensee pour un vrai redemarrage.",
    timingEn: "Oka spring cleanup requests are currently confirmed in the J0N postal area.",
    timingFr: "Les demandes de nettoyage printanier a Oka sont actuellement confirmees dans la zone postale J0N.",
  },
  {
    slug: "pointe-calumet",
    name: "Pointe-Calumet",
    nameFr: "Pointe-Calumet",
    fsaPrefixes: ["J0N"],
    introEn: "Spring dog poop cleanup in Pointe-Calumet with a fast quote process and a one-time visit designed to clear the yard after winter.",
    introFr: "Nettoyage printanier des dejections canines a Pointe-Calumet avec devis rapide et visite ponctuelle concue pour remettre la cour en etat apres l'hiver.",
    fitEn: "Pointe-Calumet yards can collect layered buildup through freeze and thaw cycles, so a focused spring cleanup helps make the space usable sooner.",
    fitFr: "Les cours de Pointe-Calumet peuvent accumuler plusieurs couches au fil du gel et du degel, donc un nettoyage printanier cible aide a rendre l'espace utilisable plus rapidement.",
    timingEn: "We currently confirm Pointe-Calumet service availability in the J0N postal area.",
    timingFr: "Nous confirmons actuellement la disponibilite du service a Pointe-Calumet dans la zone postale J0N.",
  },
  {
    slug: "rosemere",
    name: "Rosemère",
    nameFr: "Rosemère",
    fsaPrefixes: ["J7A"],
    introEn: "Spring cleanup in Rosemere for homeowners who want the yard cleaned up properly before family time shifts back outdoors.",
    introFr: "Nettoyage printanier a Rosemere pour les proprietaires qui veulent une cour bien remise en ordre avant que la vie de famille revienne a l'exterieur.",
    fitEn: "Rosemere homes often combine mature landscaping with fenced dog areas, so a careful cleanup matters as much as speed.",
    fitFr: "Les residences de Rosemere combinent souvent amenagement mature et zones cloturees pour chiens, donc un nettoyage soigne est aussi important que la rapidite.",
    timingEn: "Rosemere spring cleanup requests are currently served in the J7A postal area.",
    timingFr: "Les demandes de nettoyage printanier a Rosemere sont actuellement desservies dans la zone postale J7A.",
  },
  {
    slug: "saint-eustache",
    name: "Saint-Eustache",
    nameFr: "Saint-Eustache",
    fsaPrefixes: ["J7P", "J7R"],
    introEn: "Spring dog poop cleanup in Saint-Eustache with one-time service built for busy households that want the yard reset without losing a weekend.",
    introFr: "Nettoyage printanier des dejections canines a Saint-Eustache avec service ponctuel pense pour les foyers occupes qui veulent remettre la cour en ordre sans y consacrer un week-end.",
    fitEn: "Saint-Eustache includes a mix of established neighbourhoods and larger residential lots, so cleanup timing depends on how much winter buildup needs to be cleared.",
    fitFr: "Saint-Eustache comprend un melange de quartiers etablis et de plus grands terrains residentiels, donc le temps de nettoyage depend de l'accumulation hivernale a retirer.",
    timingEn: "We currently validate Saint-Eustache requests in the J7P and J7R postal areas.",
    timingFr: "Nous validons actuellement les demandes a Saint-Eustache dans les zones postales J7P et J7R.",
  },
  {
    slug: "saint-joseph-du-lac",
    name: "Saint-Joseph-du-Lac",
    nameFr: "Saint-Joseph-du-Lac",
    fsaPrefixes: ["J0N"],
    introEn: "Spring cleanup in Saint-Joseph-du-Lac for properties that need a solid seasonal reset before regular yard use picks up again.",
    introFr: "Nettoyage printanier a Saint-Joseph-du-Lac pour les proprietes qui ont besoin d'une vraie remise en ordre saisonniere avant la reprise des activites exterieures.",
    fitEn: "Saint-Joseph-du-Lac homes can include wider lots and more open outdoor space, so the cleanup is quoted around the actual work instead of a one-size-fits-all price.",
    fitFr: "Les residences de Saint-Joseph-du-Lac peuvent comprendre des terrains plus larges et davantage d'espace exterieur, donc le nettoyage est chiffre selon le travail reel plutot qu'avec un prix unique.",
    timingEn: "Saint-Joseph-du-Lac requests are currently confirmed under the J0N postal prefix.",
    timingFr: "Les demandes a Saint-Joseph-du-Lac sont actuellement confirmees sous le prefixe postal J0N.",
  },
  {
    slug: "sainte-anne-des-plaines",
    name: "Sainte-Anne-des-Plaines",
    nameFr: "Sainte-Anne-des-Plaines",
    fsaPrefixes: ["J5N"],
    introEn: "Spring dog poop cleanup in Sainte-Anne-des-Plaines with a simple booking flow and one focused visit to clear post-winter buildup.",
    introFr: "Nettoyage printanier des dejections canines a Sainte-Anne-des-Plaines avec processus de reservation simple et visite ciblee pour enlever l'accumulation de l'apres-hiver.",
    fitEn: "Sainte-Anne-des-Plaines properties often have enough yard depth that buildup is more spread out, which makes a dedicated cleanup visit more practical.",
    fitFr: "Les proprietes de Sainte-Anne-des-Plaines ont souvent assez de profondeur de terrain pour que l'accumulation soit plus dispersee, ce qui rend une visite de nettoyage dediee plus pratique.",
    timingEn: "We currently validate Sainte-Anne-des-Plaines spring cleanup requests in the J5N postal area.",
    timingFr: "Nous validons actuellement les demandes de nettoyage printanier a Sainte-Anne-des-Plaines dans la zone postale J5N.",
  },
  {
    slug: "sainte-marthe-sur-le-lac",
    name: "Sainte-Marthe-sur-le-Lac",
    nameFr: "Sainte-Marthe-sur-le-Lac",
    fsaPrefixes: ["J0N"],
    introEn: "Spring cleanup in Sainte-Marthe-sur-le-Lac for dog owners who want the yard cleaned up early and ready for regular use.",
    introFr: "Nettoyage printanier a Sainte-Marthe-sur-le-Lac pour les proprietaires de chiens qui veulent une cour nettoyee tot et prete a etre reutilisee regulierement.",
    fitEn: "Sainte-Marthe-sur-le-Lac yards often need a tidy reset after the melt because buildup can settle along fences, sheds, and back corners.",
    fitFr: "Les cours de Sainte-Marthe-sur-le-Lac ont souvent besoin d'une remise en ordre apres la fonte, car l'accumulation peut se loger le long des clotures, remises et coins de terrain.",
    timingEn: "Sainte-Marthe-sur-le-Lac service is currently confirmed in the J0N postal area.",
    timingFr: "Le service a Sainte-Marthe-sur-le-Lac est actuellement confirme dans la zone postale J0N.",
  },
  {
    slug: "sainte-therese",
    name: "Sainte-Thérèse",
    nameFr: "Sainte-Thérèse",
    fsaPrefixes: ["J7E", "J7H"],
    introEn: "Spring dog poop cleanup in Sainte-Therese with clear starting pricing and a fast quote process for one-time seasonal cleanup.",
    introFr: "Nettoyage printanier des dejections canines a Sainte-Therese avec prix de depart clair et processus de devis rapide pour un nettoyage saisonnier ponctuel.",
    fitEn: "Sainte-Therese homes often have compact but well-used backyards, so a spring cleanup visit helps restore the space quickly before regular outdoor routines return.",
    fitFr: "Les residences de Sainte-Therese ont souvent des cours arriere plus compactes mais tres utilisees, donc une visite printaniere aide a remettre l'espace en etat rapidement avant le retour des habitudes exterieures.",
    timingEn: "We currently serve Sainte-Therese spring cleanup requests in the J7E and J7H postal areas.",
    timingFr: "Nous desservons actuellement les demandes de nettoyage printanier a Sainte-Therese dans les zones postales J7E et J7H.",
  },
] as const;

export const SPRING_CLEANUP_ALLOWED_FSA_PREFIXES = Array.from(
  new Set(SPRING_CLEANUP_LOCATIONS.flatMap((location) => location.fsaPrefixes)),
).sort() as readonly string[];

export const LAVAL_FSA_PREFIXES = ["H7"] as const;

export const SPRING_CLEANUP_SERVICE_LOCATIONS = SPRING_CLEANUP_LOCATIONS.map(
  (location) => location.name,
) as readonly string[];

const locationBySlug = new Map(
  SPRING_CLEANUP_LOCATIONS.map((location) => [location.slug, location]),
);

const normalizePostalCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

function hasAllowedFsa(
  value: string,
  allowedFsaPrefixes: readonly string[],
) {
  const normalized = normalizePostalCode(value);
  return allowedFsaPrefixes.some((prefix) => normalized.startsWith(prefix));
}

export function getSpringCleanupLocationBySlug(slug: string) {
  return locationBySlug.get(slug);
}

export function isLavalPostalCode(value: string) {
  return hasAllowedFsa(value, LAVAL_FSA_PREFIXES);
}

export function isSpringCleanupPostalCode(value: string) {
  return hasAllowedFsa(value, SPRING_CLEANUP_ALLOWED_FSA_PREFIXES);
}
