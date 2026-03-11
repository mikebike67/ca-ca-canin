export type SpringCleanupLocation = {
  slug: string;
  name: string;
  nameFr: string;
  primaryKeywordEn: string;
  secondaryKeywordEn: string;
  primaryKeywordFr: string;
  secondaryKeywordFr: string;
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
    primaryKeywordEn: "dog poop cleanup Laval",
    secondaryKeywordEn: "pooper scooper service Laval",
    primaryKeywordFr: "nettoyage printanier Laval",
    secondaryKeywordFr: "ramassage de crottes de chien Laval",
    fsaPrefixes: ["H7"],
    introEn: "One-time dog poop cleanup for Laval yards that need a real reset after snow melt, muddy patches, and winter buildup.",
    introFr: "Nettoyage printanier ponctuel pour les cours de Laval qui ont besoin d'une vraie remise en ordre apres la fonte, la boue et l'accumulation de l'hiver.",
    fitEn: "From compact city lots to deeper family backyards, the visit is planned around access, buildup, and how the yard is actually used.",
    fitFr: "Des petits terrains urbains aux cours familiales plus profondes, la visite est planifiee selon l'acces, l'accumulation et l'utilisation reelle de la cour.",
    timingEn: "Spring requests are usually reviewed quickly, and most local bookings are confirmed within 1 business day when spots are available.",
    timingFr: "Les demandes du printemps sont habituellement traitees rapidement, et la plupart des reservations locales sont confirmees en 1 jour ouvrable lorsque des places sont disponibles.",
  },
  {
    slug: "blainville",
    name: "Blainville",
    nameFr: "Blainville",
    primaryKeywordEn: "dog poop cleanup Blainville",
    secondaryKeywordEn: "spring cleanup service Blainville",
    primaryKeywordFr: "nettoyage printanier Blainville",
    secondaryKeywordFr: "ramassage de crottes de chien Blainville",
    fsaPrefixes: ["J7B", "J7C"],
    introEn: "Spring dog waste cleanup for Blainville homeowners who want the yard ready before weekends shift back outside.",
    introFr: "Nettoyage printanier pour les proprietaires de Blainville qui veulent retrouver une cour prete avant le retour des fins de semaine dehors.",
    fitEn: "Larger fenced yards and wider family lots often mean more ground to cover, so the quote is based on the actual cleanup time needed.",
    fitFr: "Les grandes cours cloturees et les terrains familiaux plus vastes demandent souvent plus de surface a couvrir, donc le devis repose sur le temps de nettoyage reel.",
    timingEn: "Early-season demand tends to move fast here, so sending the quote form early gives you the best chance of landing a preferred spring slot.",
    timingFr: "La demande du debut de saison bouge vite ici, donc envoyer le formulaire tot donne les meilleures chances d'obtenir une plage horaire printaniere interessante.",
  },
  {
    slug: "bois-des-filion",
    name: "Bois-des-Filion",
    nameFr: "Bois-des-Filion",
    primaryKeywordEn: "dog waste removal Bois-des-Filion",
    secondaryKeywordEn: "spring dog poop cleanup Bois-des-Filion",
    primaryKeywordFr: "nettoyage printanier Bois-des-Filion",
    secondaryKeywordFr: "ramassage de crottes de chien Bois-des-Filion",
    fsaPrefixes: ["J6Z"],
    introEn: "One-time spring cleanup for Bois-des-Filion yards with thaw-season buildup, hidden corners, and a cleanup job that is easier to outsource than spend a weekend on.",
    introFr: "Nettoyage printanier ponctuel pour les cours de Bois-des-Filion avec accumulation de degel, coins plus caches et un travail qu'il vaut souvent mieux confier que passer sa fin de semaine a faire.",
    fitEn: "Narrow side access and fenced rear yards can slow a cleanup down, so the visit is planned to stay efficient without cutting corners.",
    fitFr: "Les acces lateraux plus etroits et les cours arriere cloturees peuvent ralentir le nettoyage, donc la visite est organisee pour rester efficace sans aller trop vite.",
    timingEn: "Most requests are straightforward to confirm, and we usually reply quickly once the yard details and postal code are submitted.",
    timingFr: "La plupart des demandes se confirment facilement, et nous repondons generalement rapidement une fois les details de la cour et le code postal envoyes.",
  },
  {
    slug: "boisbriand",
    name: "Boisbriand",
    nameFr: "Boisbriand",
    primaryKeywordEn: "pooper scooper service Boisbriand",
    secondaryKeywordEn: "dog poop cleanup Boisbriand",
    primaryKeywordFr: "nettoyage printanier Boisbriand",
    secondaryKeywordFr: "ramassage de crottes de chien Boisbriand",
    fsaPrefixes: ["J7E", "J7G"],
    introEn: "Dog poop cleanup for Boisbriand households that want a cleaner yard without giving up the first warm weekend to do the reset themselves.",
    introFr: "Ramassage printanier pour les foyers de Boisbriand qui veulent une cour plus propre sans perdre le premier week-end doux a faire le grand nettoyage eux-memes.",
    fitEn: "Some yards are compact and dense, others open up into larger family space, so the service is priced around the cleanup time the property actually needs.",
    fitFr: "Certaines cours sont plus compactes, d'autres s'ouvrent sur un espace familial plus grand, donc le service est chiffre selon le temps de nettoyage reellement necessaire.",
    timingEn: "Booking tends to be quickest when the quote request includes your dog count and approximate yard size from the start.",
    timingFr: "La reservation avance le plus vite lorsque la demande inclut des le depart le nombre de chiens et une idee approximative de la taille de la cour.",
  },
  {
    slug: "deux-montagnes",
    name: "Deux-Montagnes",
    nameFr: "Deux-Montagnes",
    primaryKeywordEn: "dog poop cleanup Deux-Montagnes",
    secondaryKeywordEn: "spring yard cleanup Deux-Montagnes",
    primaryKeywordFr: "nettoyage printanier Deux-Montagnes",
    secondaryKeywordFr: "ramassage de crottes de chien Deux-Montagnes",
    fsaPrefixes: ["J7R"],
    introEn: "One-time dog poop cleanup for Deux-Montagnes properties that need a concentrated spring reset after the snow line finally clears.",
    introFr: "Nettoyage ponctuel pour les proprietes de Deux-Montagnes qui ont besoin d'une remise en ordre printaniere bien ciblee une fois la neige completement fondue.",
    fitEn: "Cleanup often means tracking waste along fence lines, grass edges, and the back of the yard where buildup settled through winter.",
    fitFr: "Le nettoyage passe souvent par les clotures, les bordures de gazon et le fond de la cour, la ou l'accumulation s'est installee pendant l'hiver.",
    timingEn: "Most bookings can be confirmed quickly, especially when the yard is ready for access and the spring demand wave has not peaked yet.",
    timingFr: "La plupart des reservations se confirment rapidement, surtout lorsque l'acces a la cour est pret et que la vague de demandes printanieres n'a pas encore atteint son sommet.",
  },
  {
    slug: "lorraine",
    name: "Lorraine",
    nameFr: "Lorraine",
    primaryKeywordEn: "dog poop cleanup Lorraine",
    secondaryKeywordEn: "pooper scooper service Lorraine",
    primaryKeywordFr: "nettoyage printanier Lorraine",
    secondaryKeywordFr: "ramassage de crottes de chien Lorraine",
    fsaPrefixes: ["J6Z"],
    introEn: "Spring cleanup for Lorraine dog owners who want the yard usable again as soon as the snow disappears and lawn season starts.",
    introFr: "Nettoyage printanier pour les proprietaires de chiens de Lorraine qui veulent retrouver une cour utilisable des que la neige disparait et que la saison du gazon recommence.",
    fitEn: "Well-kept landscaping and tidy residential lots make a thorough reset especially worthwhile before regular outdoor routines pick up again.",
    fitFr: "Les amenagements soignes et les terrains residentiels bien entretenus rendent une remise en ordre complete particulierement utile avant le retour des routines exterieures.",
    timingEn: "Spring scheduling here is usually smooth, but the earliest dates go first once the weather breaks for good.",
    timingFr: "La planification printaniere est habituellement simple ici, mais les premieres dates partent rapidement une fois la belle meteo installee.",
  },
  {
    slug: "mirabel",
    name: "Mirabel",
    nameFr: "Mirabel",
    primaryKeywordEn: "dog poop cleanup Mirabel",
    secondaryKeywordEn: "pooper scooper service Mirabel",
    primaryKeywordFr: "nettoyage printanier Mirabel",
    secondaryKeywordFr: "ramassage de crottes de chien Mirabel",
    fsaPrefixes: ["J7J", "J7N"],
    introEn: "Dog waste removal for Mirabel properties with wider setbacks, bigger yards, and the kind of winter buildup that takes too long to clear by hand.",
    introFr: "Service de ramassage pour les proprietes de Mirabel avec plus grands terrains, marges plus larges et accumulation hivernale qui prend trop de temps a enlever a la main.",
    fitEn: "Yard size matters more here than in tighter suburbs, so the quote process leans on square footage and dog count before the visit is locked in.",
    fitFr: "La taille du terrain compte souvent davantage ici que dans les secteurs plus denses, donc le devis repose surtout sur la superficie et le nombre de chiens avant de fixer la visite.",
    timingEn: "Quotes are usually confirmed quickly once we know the lot size well enough to estimate the cleanup properly.",
    timingFr: "Les devis se confirment generalement rapidement une fois que la taille du terrain est assez claire pour estimer le nettoyage correctement.",
  },
  {
    slug: "oka",
    name: "Oka",
    nameFr: "Oka",
    primaryKeywordEn: "spring dog poop cleanup Oka",
    secondaryKeywordEn: "dog waste removal Oka",
    primaryKeywordFr: "nettoyage printanier Oka",
    secondaryKeywordFr: "ramassage de crottes de chien Oka",
    fsaPrefixes: ["J0N"],
    introEn: "Spring dog poop cleanup for Oka properties that need a clean start before outdoor space gets used more heavily in warmer weather.",
    introFr: "Nettoyage printanier pour les proprietes d'Oka qui ont besoin d'un depart propre avant que l'espace exterieur soit plus utilise pendant les beaux jours.",
    fitEn: "Broader outdoor space and thawing ground cover can hide more buildup than expected, so the one-time visit is built to handle a full reset.",
    fitFr: "Les plus grands espaces exterieurs et le sol en degel peuvent cacher plus d'accumulation qu'on pense, donc la visite ponctuelle est prevue pour une vraie remise a zero.",
    timingEn: "Spring availability is reviewed request by request, and earlier submissions usually have the most flexibility on timing.",
    timingFr: "La disponibilite printaniere est verifiee demande par demande, et les soumissions envoyees plus tot offrent generalement plus de souplesse sur le moment de la visite.",
  },
  {
    slug: "pointe-calumet",
    name: "Pointe-Calumet",
    nameFr: "Pointe-Calumet",
    primaryKeywordEn: "dog poop cleanup Pointe-Calumet",
    secondaryKeywordEn: "spring cleanup service Pointe-Calumet",
    primaryKeywordFr: "nettoyage printanier Pointe-Calumet",
    secondaryKeywordFr: "ramassage de crottes de chien Pointe-Calumet",
    fsaPrefixes: ["J0N"],
    introEn: "One-time dog poop cleanup for Pointe-Calumet yards that collect layered buildup through repeated freeze and thaw cycles.",
    introFr: "Nettoyage ponctuel pour les cours de Pointe-Calumet ou l'accumulation se superpose au fil des cycles de gel et de degel.",
    fitEn: "A focused spring visit helps get the space usable sooner, especially when waste settled into softer ground and back corners over winter.",
    fitFr: "Une visite printaniere ciblee aide a rendre l'espace utilisable plus vite, surtout lorsque l'accumulation s'est logee dans les zones plus molles et les coins du terrain.",
    timingEn: "Most requests can be reviewed fast, and sending photos or a clear yard-size estimate can speed up confirmation.",
    timingFr: "La plupart des demandes peuvent etre evaluees rapidement, et l'envoi de photos ou d'une bonne estimation de la taille de la cour peut accelerer la confirmation.",
  },
  {
    slug: "rosemere",
    name: "Rosemère",
    nameFr: "Rosemère",
    primaryKeywordEn: "dog poop cleanup Rosemere",
    secondaryKeywordEn: "pooper scooper service Rosemere",
    primaryKeywordFr: "nettoyage printanier Rosemere",
    secondaryKeywordFr: "ramassage de crottes de chien Rosemere",
    fsaPrefixes: ["J7A"],
    introEn: "Spring cleanup for Rosemere homeowners who want the yard cleaned up properly before outdoor family time picks up again.",
    introFr: "Nettoyage printanier pour les proprietaires de Rosemere qui veulent une cour bien remise en ordre avant le retour de la vie de famille a l'exterieur.",
    fitEn: "Mature landscaping and fenced dog zones mean careful cleanup matters as much as speed, especially around edges and planting beds.",
    fitFr: "L'amenagement mature et les zones cloturees pour chiens font en sorte qu'un nettoyage soigne compte autant que la rapidite, surtout autour des bordures et plantations.",
    timingEn: "Requests are usually simple to review, and we confirm timing as soon as route space opens for the area.",
    timingFr: "Les demandes sont generalement simples a revoir, et nous confirmons le moment de la visite des qu'une plage s'ouvre sur la route du secteur.",
  },
  {
    slug: "saint-eustache",
    name: "Saint-Eustache",
    nameFr: "Saint-Eustache",
    primaryKeywordEn: "dog poop cleanup Saint-Eustache",
    secondaryKeywordEn: "spring cleanup service Saint-Eustache",
    primaryKeywordFr: "nettoyage printanier Saint-Eustache",
    secondaryKeywordFr: "ramassage de crottes de chien Saint-Eustache",
    fsaPrefixes: ["J7P", "J7R"],
    introEn: "Spring dog poop cleanup for Saint-Eustache households that want the yard reset without sacrificing a whole weekend to catch-up work.",
    introFr: "Nettoyage printanier pour les foyers de Saint-Eustache qui veulent remettre la cour en ordre sans sacrifier tout un week-end a rattraper le travail accumule.",
    fitEn: "Established neighbourhoods and larger residential lots create a mix of cleanup needs, so timing depends on how much winter buildup is still there.",
    fitFr: "Le melange de quartiers etablis et de terrains residentiels plus grands cree des besoins varies, donc la duree depend surtout de ce qui reste comme accumulation hivernale.",
    timingEn: "We usually confirm quickly after the request is reviewed, especially when the postal code and yard details line up cleanly.",
    timingFr: "Nous confirmons generalement rapidement apres revision de la demande, surtout lorsque le code postal et les details de la cour sont clairs des le depart.",
  },
  {
    slug: "saint-joseph-du-lac",
    name: "Saint-Joseph-du-Lac",
    nameFr: "Saint-Joseph-du-Lac",
    primaryKeywordEn: "dog waste removal Saint-Joseph-du-Lac",
    secondaryKeywordEn: "spring dog poop cleanup Saint-Joseph-du-Lac",
    primaryKeywordFr: "nettoyage printanier Saint-Joseph-du-Lac",
    secondaryKeywordFr: "ramassage de crottes de chien Saint-Joseph-du-Lac",
    fsaPrefixes: ["J0N"],
    introEn: "Spring cleanup for Saint-Joseph-du-Lac properties that need a proper seasonal reset before patios, play space, and regular yard use start again.",
    introFr: "Nettoyage printanier pour les proprietes de Saint-Joseph-du-Lac qui ont besoin d'une vraie remise en ordre saisonniere avant le retour des terrasses, jeux et activites exterieures.",
    fitEn: "Wider lots and more open outdoor space mean the cleanup is quoted around the real work involved instead of a flat one-size-fits-all price.",
    fitFr: "Les terrains plus larges et l'espace exterieur plus ouvert font en sorte que le nettoyage est chiffre selon le travail reel, et non avec un prix unique pour tout le monde.",
    timingEn: "Availability is usually confirmed after a quick service-area check and a review of the yard size entered in the form.",
    timingFr: "La disponibilite se confirme habituellement apres une verification rapide de la zone desservie et de la taille de cour inscrite dans le formulaire.",
  },
  {
    slug: "sainte-anne-des-plaines",
    name: "Sainte-Anne-des-Plaines",
    nameFr: "Sainte-Anne-des-Plaines",
    primaryKeywordEn: "dog poop cleanup Sainte-Anne-des-Plaines",
    secondaryKeywordEn: "spring cleanup service Sainte-Anne-des-Plaines",
    primaryKeywordFr: "nettoyage printanier Sainte-Anne-des-Plaines",
    secondaryKeywordFr: "ramassage de crottes de chien Sainte-Anne-des-Plaines",
    fsaPrefixes: ["J5N"],
    introEn: "Spring dog poop cleanup for Sainte-Anne-des-Plaines yards with enough depth and buildup that a dedicated one-time visit makes more sense than tackling it alone.",
    introFr: "Nettoyage printanier pour les cours de Sainte-Anne-des-Plaines qui ont assez de profondeur et d'accumulation pour qu'une visite ponctuelle dediee soit plus logique que de tout faire seul.",
    fitEn: "When buildup is spread across a deeper yard, a focused service visit is usually the fastest way to get the space back into shape.",
    fitFr: "Quand l'accumulation est dispersee sur un terrain plus profond, une visite ciblee est souvent la facon la plus rapide de remettre l'espace en etat.",
    timingEn: "Most requests can be turned around fast once we know the yard size and whether there are access constraints to keep in mind.",
    timingFr: "La plupart des demandes avancent rapidement une fois que nous connaissons la taille de la cour et les contraintes d'acces a prevoir.",
  },
  {
    slug: "sainte-marthe-sur-le-lac",
    name: "Sainte-Marthe-sur-le-Lac",
    nameFr: "Sainte-Marthe-sur-le-Lac",
    primaryKeywordEn: "dog poop cleanup Sainte-Marthe-sur-le-Lac",
    secondaryKeywordEn: "spring yard cleanup Sainte-Marthe-sur-le-Lac",
    primaryKeywordFr: "nettoyage printanier Sainte-Marthe-sur-le-Lac",
    secondaryKeywordFr: "ramassage de crottes de chien Sainte-Marthe-sur-le-Lac",
    fsaPrefixes: ["J0N"],
    introEn: "Spring cleanup for Sainte-Marthe-sur-le-Lac dog owners who want the yard cleared early and ready for normal use again.",
    introFr: "Nettoyage printanier pour les proprietaires de chiens de Sainte-Marthe-sur-le-Lac qui veulent une cour nettoyee tot et prete a reprendre un usage normal.",
    fitEn: "After the melt, buildup often settles along fences, sheds, and back corners, so a tidy reset can make the whole yard feel usable again.",
    fitFr: "Apres la fonte, l'accumulation se retrouve souvent le long des clotures, des remises et dans les coins du terrain, donc une remise en ordre soignee redonne vite une cour plus utilisable.",
    timingEn: "We usually confirm spring requests quickly here, with final timing based on the route and the scale of the cleanup needed.",
    timingFr: "Nous confirmons habituellement les demandes printanieres rapidement ici, puis le moment exact depend de la route et de l'ampleur du nettoyage a faire.",
  },
  {
    slug: "sainte-therese",
    name: "Sainte-Thérèse",
    nameFr: "Sainte-Thérèse",
    primaryKeywordEn: "dog poop cleanup Sainte-Therese",
    secondaryKeywordEn: "pooper scooper service Sainte-Therese",
    primaryKeywordFr: "nettoyage printanier Sainte-Therese",
    secondaryKeywordFr: "ramassage de crottes de chien Sainte-Therese",
    fsaPrefixes: ["J7E", "J7H"],
    introEn: "One-time dog poop cleanup for Sainte-Therese homes with compact but well-used backyards that need a quick seasonal reset.",
    introFr: "Nettoyage ponctuel pour les residences de Sainte-Therese avec cours arriere plus compactes mais tres utilisees qui ont besoin d'une remise en ordre saisonniere rapide.",
    fitEn: "Smaller backyard footprints still collect a surprising amount over winter, so a focused visit helps restore the space before regular outdoor habits return.",
    fitFr: "Les plus petites cours arriere accumulent quand meme beaucoup pendant l'hiver, donc une visite ciblee aide a remettre l'espace en etat avant le retour des habitudes exterieures.",
    timingEn: "Most quote requests are easy to confirm, and we usually respond within 1 business day during the spring booking window.",
    timingFr: "La plupart des demandes de devis se confirment facilement, et nous repondons generalement en 1 jour ouvrable pendant la periode de reservation du printemps.",
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
