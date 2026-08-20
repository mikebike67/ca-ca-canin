export type BlogCategory = "local" | "general";

export type BlogImageCredit = { photographer: string; url: string };

export type BlogBlock =
  | { type: "paragraph"; textEn: string; textFr: string }
  | { type: "heading"; level: 2 | 3; textEn: string; textFr: string }
  | { type: "list"; ordered?: boolean; itemsEn: string[]; itemsFr: string[] }
  | { type: "callout"; titleEn: string; titleFr: string; bodyEn: string; bodyFr: string }
  | {
      type: "image";
      src: string;
      alt: string;
      altFr: string;
      width: number;
      height: number;
      captionEn?: string;
      captionFr?: string;
      credit: BlogImageCredit;
    };

export type BlogFaqItem = { qEn: string; qFr: string; aEn: string; aFr: string };

export type BlogSource = { labelEn: string; labelFr: string; url: string };

export type BlogPost = {
  slug: string;
  slugFr: string;
  titleEn: string;
  titleFr: string;
  metaDescriptionEn: string;
  metaDescriptionFr: string;
  category: BlogCategory;
  locationSlug?: string;
  publishedAt: string;
  updatedAt?: string;
  heroImage: { src: string; alt: string; altFr: string; width: number; height: number; credit: BlogImageCredit };
  excerptEn: string;
  excerptFr: string;
  body: BlogBlock[];
  faq?: BlogFaqItem[];
  sources?: BlogSource[];
  keywordsEn: string[];
  keywordsFr: string[];
};

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: "dog-poop-removal-cost-laval",
    slugFr: "cout-ramassage-dejections-canines-laval",
    titleEn: "How Much Does Dog Poop Removal Cost in Laval, QC?",
    titleFr: "Combien coûte le ramassage de déjections canines à Laval, QC?",
    metaDescriptionEn:
      "Real Laval pricing for dog poop removal: what weekly service and one-time spring cleanup actually cost, what changes your price, and how to get an exact quote.",
    metaDescriptionFr:
      "Les vrais prix à Laval pour le ramassage de déjections canines : ce que coûtent le service hebdomadaire et le nettoyage printanier ponctuel, ce qui fait varier le prix, et comment obtenir un devis exact.",
    category: "local",
    locationSlug: "laval",
    publishedAt: "2026-08-20",
    heroImage: {
      src: "/images/blog/hero-dog-yard.jpg",
      alt: "Golden retriever sitting on green grass in a fenced backyard",
      altFr: "Golden retriever assis sur le gazon dans une cour clôturée",
      width: 1600,
      height: 1060,
      credit: {
        photographer: "Mathias Reding",
        url: "https://www.pexels.com/photo/a-golden-retriever-sitting-on-grass-12127037/",
      },
    },
    excerptEn:
      "Weekly cleanup starts at $20 a visit and one-time spring cleanup starts at $60. Here's exactly what changes the price for a Laval yard.",
    excerptFr:
      "Le nettoyage hebdomadaire commence à 20 $ par visite et le nettoyage printanier ponctuel commence à 60 $. Voici exactement ce qui fait varier le prix pour une cour à Laval.",
    keywordsEn: [
      "dog poop removal cost Laval",
      "how much does dog poop cleanup cost",
      "pooper scooper service Laval price",
      "dog waste removal price Laval",
    ],
    keywordsFr: [
      "coût ramassage déjections canines Laval",
      "prix nettoyage crottes de chien Laval",
      "service ramassage crottes de chien prix",
    ],
    body: [
      {
        type: "paragraph",
        textEn:
          "In Laval, recurring dog poop cleanup starts at $20 per visit for one dog in a standard yard, and one-time spring cleanup starts at $60 for the first 30 minutes plus $5 for every additional 5 minutes. The exact number for your yard depends on how many dogs you have, how big the yard is, and how often you want visits. Here is how that pricing actually breaks down and what pushes it up or down.",
        textFr:
          "À Laval, le nettoyage récurrent de déjections canines commence à 20 $ par visite pour un chien dans une cour standard, et le nettoyage printanier ponctuel commence à 60 $ pour les 30 premières minutes, plus 5 $ pour chaque tranche additionnelle de 5 minutes. Le montant exact pour votre cour dépend du nombre de chiens, de la taille de la cour et de la fréquence des visites souhaitée. Voici comment ce prix se calcule réellement et ce qui le fait augmenter ou diminuer.",
      },
      { type: "heading", level: 2, textEn: "Laval pricing at a glance", textFr: "Aperçu des prix à Laval" },
      {
        type: "list",
        itemsEn: [
          "Weekly recurring cleanup: starts at $20 per visit for one dog in a standard-size yard",
          "Biweekly and monthly recurring cleanup: priced from the same base rate, adjusted for the extra buildup between visits",
          "One-time or spring cleanup: starts at $60 for the first 30 minutes, then $5 for every additional 5 minutes",
          "Every price adjusts for the number of dogs, the yard size, and how often you book",
        ],
        itemsFr: [
          "Nettoyage récurrent hebdomadaire : à partir de 20 $ par visite pour un chien dans une cour de taille standard",
          "Nettoyage récurrent aux deux semaines ou mensuel : basé sur le même tarif de départ, ajusté pour l'accumulation supplémentaire entre les visites",
          "Nettoyage ponctuel ou printanier : à partir de 60 $ pour les 30 premières minutes, puis 5 $ pour chaque tranche additionnelle de 5 minutes",
          "Chaque prix est ajusté selon le nombre de chiens, la taille de la cour et la fréquence de réservation",
        ],
      },
      {
        type: "image",
        src: "/images/blog/canadian-currency-wallet.jpg",
        alt: "Canadian dollar bills tucked in a wallet, representing a cleanup cost estimate",
        altFr: "Billets de dollars canadiens dans un portefeuille, représentant une estimation de coût de nettoyage",
        width: 1600,
        height: 2400,
        captionEn: "All prices on this page are in Canadian dollars.",
        captionFr: "Tous les prix sur cette page sont en dollars canadiens.",
        credit: {
          photographer: "Erik Mclean",
          url: "https://www.pexels.com/photo/close-up-of-a-wallet-with-canadian-currency-in-a-car-interior-8266750/",
        },
      },
      {
        type: "paragraph",
        textEn:
          "These are starting prices, not flat rates. A single dog in a small fenced yard in Chomedey will cost less per visit than three dogs on a large Fabreville lot, because the visit itself takes longer. The calculator on our Laval service page asks for exactly these details and returns your real number before you book anything.",
        textFr:
          "Ce sont des prix de départ, pas des tarifs fixes. Un seul chien dans une petite cour clôturée à Chomedey coûtera moins cher par visite que trois chiens sur un grand terrain à Fabreville, parce que la visite elle-même prend plus de temps. Le calculateur sur notre page de service à Laval demande exactement ces détails et vous donne votre montant réel avant même de réserver.",
      },
      {
        type: "image",
        src: "/images/blog/clean-backyard-lawn.jpg",
        alt: "Well-maintained green backyard lawn after cleanup",
        altFr: "Cour arrière bien entretenue avec un gazon vert après le nettoyage",
        width: 1600,
        height: 1087,
        captionEn: "Yard size is one of the three factors that move your price up or down.",
        captionFr: "La taille de la cour est l'un des trois facteurs qui font varier le prix.",
        credit: {
          photographer: "Max Vakhtbovych",
          url: "https://www.pexels.com/photo/house-backyard-with-lawn-green-grass-7546775/",
        },
      },
      { type: "heading", level: 2, textEn: "What actually changes your price", textFr: "Ce qui fait vraiment varier le prix" },
      {
        type: "paragraph",
        textEn:
          "Three things determine the number you get from the calculator, and all three are about how much time the visit takes, not arbitrary tiers.",
        textFr:
          "Trois éléments déterminent le montant que vous obtenez du calculateur, et les trois sont liés au temps que prend la visite, pas à des paliers arbitraires.",
      },
      {
        type: "list",
        itemsEn: [
          "Number of dogs: more dogs means more waste to locate and bag per visit",
          "Yard size: a large Laval lot with a pool, shed, or dog run takes longer to cover fully than a small city yard",
          "Frequency: weekly visits stay quick because buildup never has time to accumulate, while monthly or one-time visits take longer for the same yard",
        ],
        itemsFr: [
          "Nombre de chiens : plus de chiens signifie plus de déjections à repérer et à ramasser à chaque visite",
          "Taille de la cour : un grand terrain à Laval avec piscine, cabanon ou parc à chien prend plus de temps à couvrir entièrement qu'une petite cour urbaine",
          "Fréquence : les visites hebdomadaires restent rapides parce que l'accumulation n'a jamais le temps de s'installer, alors que les visites mensuelles ou ponctuelles prennent plus de temps pour la même cour",
        ],
      },
      { type: "heading", level: 2, textEn: "Why one-time cleanup costs more per visit", textFr: "Pourquoi le nettoyage ponctuel coûte plus cher par visite" },
      {
        type: "paragraph",
        textEn:
          "A one-time or spring cleanup almost always costs more per visit than a single weekly stop, and the reason is simple math, not a different pricing model. If your yard has not been cleaned since fall, the winter thaw uncovers months of buildup at once. That takes real time to clear properly, which is why spring cleanup is billed at $60 for the first 30 minutes and $5 per extra 5-minute increment instead of a flat per-visit rate. A yard that needs 45 minutes of work costs more than one that needs 30, and the pricing reflects the actual labor rather than guessing.",
        textFr:
          "Un nettoyage ponctuel ou printanier coûte presque toujours plus cher par visite qu'un simple arrêt hebdomadaire, et la raison est purement mathématique, pas un modèle de tarification différent. Si votre cour n'a pas été nettoyée depuis l'automne, la fonte des neiges révèle des mois d'accumulation d'un coup. Cela demande un temps réel pour bien tout nettoyer, ce qui explique pourquoi le nettoyage printanier est facturé à 60 $ pour les 30 premières minutes puis 5 $ par tranche additionnelle de 5 minutes, plutôt qu'un tarif fixe par visite. Une cour qui demande 45 minutes de travail coûte plus cher qu'une cour qui en demande 30, et le prix reflète le travail réel plutôt qu'une estimation approximative.",
      },
      {
        type: "paragraph",
        textEn:
          "This is also why switching to recurring service after a spring cleanup tends to save money over the season. Once the backlog is cleared, weekly visits stay short because there is only a few days of new waste to collect each time, so the per-visit price stays close to the $20 starting rate instead of creeping up.",
        textFr:
          "C'est aussi pourquoi passer à un service récurrent après un nettoyage printanier permet souvent d'économiser sur la saison. Une fois l'accumulation éliminée, les visites hebdomadaires restent courtes puisqu'il n'y a que quelques jours de nouvelles déjections à ramasser à chaque fois, donc le prix par visite reste proche du tarif de départ de 20 $ plutôt que d'augmenter progressivement.",
      },
      {
        type: "image",
        src: "/images/blog/dog-playing-grass.jpg",
        alt: "Dog playing with a ball on a green lawn",
        altFr: "Chien qui joue avec une balle sur un gazon vert",
        width: 1600,
        height: 1067,
        captionEn: "A clear yard means more room to actually use it.",
        captionFr: "Une cour propre veut dire plus d'espace pour en profiter.",
        credit: {
          photographer: "Barnabas Davoti",
          url: "https://www.pexels.com/photo/a-dog-on-grass-13701757/",
        },
      },
      { type: "heading", level: 2, textEn: "Is the cost worth it?", textFr: "Est-ce que le prix en vaut la peine?" },
      {
        type: "paragraph",
        textEn:
          "Dog waste is not just an eyesore. A single gram of dog feces can carry tens of millions of bacteria, including strains like E. coli, and parasites such as roundworm and hookworm eggs can survive in soil for months after the waste itself is gone. For households with kids or a dog that spends time in the grass, keeping the yard clear on a schedule is closer to routine hygiene than a luxury add-on. Weighed against the time it takes to scoop a yard properly every week, especially through a Quebec winter with snow cover hiding the mess until it melts, a $20 starting visit is often less than the value of the hour or more it would take to do it consistently yourself.",
        textFr:
          "Les déjections canines ne sont pas qu'un problème esthétique. Un seul gramme de matières fécales de chien peut contenir des dizaines de millions de bactéries, y compris des souches comme E. coli, et des parasites comme les œufs de vers ronds et d'ankylostomes peuvent survivre dans le sol pendant des mois après la disparition des déjections elles-mêmes. Pour les foyers avec des enfants ou un chien qui passe du temps sur le gazon, garder la cour propre sur une base régulière relève davantage de l'hygiène courante que d'un luxe. Comparé au temps que prend un ramassage sérieux chaque semaine, surtout pendant un hiver québécois où la neige cache le problème jusqu'à la fonte, une visite à partir de 20 $ vaut souvent moins que l'heure ou plus qu'il faudrait y consacrer soi-même de façon constante.",
      },
      {
        type: "callout",
        titleEn: "See your exact price",
        titleFr: "Voyez votre prix exact",
        bodyEn:
          "The calculator on our Laval service page takes your dog count, yard size, and preferred frequency and returns your real starting price in under a minute, no phone call required.",
        bodyFr:
          "Le calculateur sur notre page de service à Laval prend en compte votre nombre de chiens, la taille de votre cour et la fréquence souhaitée, et vous donne votre prix de départ réel en moins d'une minute, sans appel téléphonique requis.",
      },
      { type: "heading", level: 2, textEn: "What's included at every price point", textFr: "Ce qui est inclus à chaque prix" },
      {
        type: "paragraph",
        textEn:
          "The price covers more than just the scoop. Every visit, whether it is a $20 weekly stop or a $60 spring cleanup, includes bagging the waste and placing it in your outdoor bin when it is accessible, plus a confirmation with a gate photo afterward so you know the work was done without needing to be home. Service runs year-round, including winter, when snow cover in Laval hides the mess until the next thaw makes it worse. None of this is an add-on charged separately. It is what the base price already pays for.",
        textFr:
          "Le prix couvre plus que le simple ramassage. Chaque visite, qu'il s'agisse d'un arrêt hebdomadaire à 20 $ ou d'un nettoyage printanier à 60 $, inclut la mise en sac des déjections et leur dépôt dans votre bac extérieur lorsqu'il est accessible, ainsi qu'une confirmation avec une photo du portail par la suite pour que vous sachiez que le travail a été fait sans avoir à être présent. Le service est offert toute l'année, y compris l'hiver, alors que la neige à Laval cache le problème jusqu'à ce que la fonte suivante l'aggrave. Rien de tout cela n'est un supplément facturé séparément. C'est ce que le prix de base couvre déjà.",
      },
      { type: "heading", level: 2, textEn: "How to get an exact quote for your yard", textFr: "Comment obtenir un devis exact pour votre cour" },
      {
        type: "paragraph",
        textEn:
          "Getting your real number takes about a minute. Enter your postal code to confirm you are in the served area, tell the calculator how many dogs you have and roughly how big the yard is, and pick a frequency. There is no contract, so you can start with weekly service and switch to biweekly later, or book a single spring cleanup with no obligation to continue. You do not need to be home for the visit. As long as the gate is accessible, the cleanup happens on schedule and you get a confirmation with a gate photo afterward so you know it was done.",
        textFr:
          "Obtenir votre montant réel prend environ une minute. Entrez votre code postal pour confirmer que vous êtes dans la zone desservie, indiquez au calculateur le nombre de chiens que vous avez et la taille approximative de la cour, puis choisissez une fréquence. Il n'y a aucun contrat, donc vous pouvez commencer avec un service hebdomadaire et passer aux deux semaines plus tard, ou réserver un seul nettoyage printanier sans obligation de continuer. Vous n'avez pas besoin d'être présent lors de la visite. Tant que le portail est accessible, le nettoyage se fait selon l'horaire prévu et vous recevez une confirmation avec une photo du portail par la suite pour savoir que le travail a été fait.",
      },
    ],
    faq: [
      {
        qEn: "How much does weekly dog poop cleanup cost in Laval?",
        qFr: "Combien coûte le nettoyage hebdomadaire de déjections canines à Laval?",
        aEn: "Weekly service starts at $20 per visit for one dog in a standard-size yard. The exact price adjusts for additional dogs and larger yards.",
        aFr: "Le service hebdomadaire commence à 20 $ par visite pour un chien dans une cour de taille standard. Le prix exact est ajusté selon le nombre de chiens et la taille de la cour.",
      },
      {
        qEn: "Is a one-time spring cleanup more expensive than recurring service?",
        qFr: "Un nettoyage printanier ponctuel coûte-t-il plus cher qu'un service récurrent?",
        aEn: "Usually yes, per visit. Spring cleanup starts at $60 for the first 30 minutes plus $5 per additional 5 minutes because it clears months of built-up waste in a single visit, which takes longer than a routine weekly stop.",
        aFr: "Habituellement oui, par visite. Le nettoyage printanier commence à 60 $ pour les 30 premières minutes, plus 5 $ par tranche additionnelle de 5 minutes, car il élimine des mois d'accumulation en une seule visite, ce qui prend plus de temps qu'un arrêt hebdomadaire de routine.",
      },
      {
        qEn: "Do I need to sign a contract?",
        qFr: "Dois-je signer un contrat?",
        aEn: "No. You can request service and adjust the frequency or cancel at any time.",
        aFr: "Non. Vous pouvez demander le service et ajuster la fréquence ou annuler en tout temps.",
      },
      {
        qEn: "What affects my exact price the most?",
        qFr: "Qu'est-ce qui influence le plus mon prix exact?",
        aEn: "The number of dogs and the yard size have the biggest impact, since both directly change how long the visit takes. Frequency matters too: less frequent visits mean more buildup and more time per visit.",
        aFr: "Le nombre de chiens et la taille de la cour ont le plus grand impact, car les deux influencent directement la durée de la visite. La fréquence compte aussi : des visites moins fréquentes signifient plus d'accumulation et plus de temps par visite.",
      },
    ],
    sources: [
      {
        labelEn: "American Kennel Club — Dog Poop Disposal: The Importance of Cleaning Up After Your Dog",
        labelFr: "American Kennel Club — L'importance de ramasser les déjections de votre chien",
        url: "https://www.akc.org/expert-advice/advice/dog-poop-cleanup/",
      },
      {
        labelEn: "PetMD — The Scoop on Poop: Facts on How to Dispose of Dog Poop",
        labelFr: "PetMD — Les faits sur l'élimination des déjections canines",
        url: "https://www.petmd.com/dog/care/scoop-poop-facts-and-fiction-about-disposing-it",
      },
    ],
  },
];

const postBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post]));
const postBySlugFr = new Map(BLOG_POSTS.map((post) => [post.slugFr, post]));

export function getBlogPostBySlug(slug: string) {
  return postBySlug.get(slug);
}

export function getBlogPostBySlugFr(slug: string) {
  return postBySlugFr.get(slug);
}
