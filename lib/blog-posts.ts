export type BlogCategory = "local" | "general";

export type BlogImageCredit = { photographer: string; url: string };

export type BlogBlock =
  | { type: "paragraph"; textEn: string; textFr: string }
  | { type: "heading"; level: 2 | 3; textEn: string; textFr: string }
  | { type: "list"; ordered?: boolean; itemsEn: string[]; itemsFr: string[] }
  | { type: "keypoints"; titleEn: string; titleFr: string; itemsEn: string[]; itemsFr: string[] }
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
  relatedSlugs?: string[];
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
    relatedSlugs: ["dog-poop-health-risks-yard", "does-dog-poop-kill-grass", "dog-poop-law-laval-yard"],
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
          "Dog waste is not just an eyesore. It carries bacteria and parasite eggs that can linger in the soil for months, which is a real [health risk in a yard where kids and pets play](/blog/dog-poop-health-risks-yard), and left in place it also [burns and yellows the lawn in patches](/blog/does-dog-poop-kill-grass). For households with kids or a dog that spends time in the grass, keeping the yard clear on a schedule is closer to routine hygiene than a luxury add-on. Weighed against the time it takes to scoop a yard properly every week, especially through a Quebec winter with snow cover hiding the mess until it melts, a $20 starting visit is often less than the value of the hour or more it would take to do it consistently yourself.",
        textFr:
          "Les déjections canines ne sont pas qu'un problème esthétique. Elles contiennent des bactéries et des œufs de parasites qui peuvent persister dans le sol pendant des mois, ce qui représente un vrai [risque pour la santé dans une cour où jouent enfants et animaux](/fr/blogue/risques-sante-dejections-canines-cour), et laissées en place elles [brûlent et jaunissent aussi le gazon par plaques](/fr/blogue/les-crottes-de-chien-tuent-elles-le-gazon). Pour les foyers avec des enfants ou un chien qui passe du temps sur le gazon, garder la cour propre sur une base régulière relève davantage de l'hygiène courante que d'un luxe. Comparé au temps que prend un ramassage sérieux chaque semaine, surtout pendant un hiver québécois où la neige cache le problème jusqu'à la fonte, une visite à partir de 20 $ vaut souvent moins que l'heure ou plus qu'il faudrait y consacrer soi-même de façon constante.",
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
        labelEn: "American Kennel Club: Dog Poop Disposal and the Importance of Cleaning Up After Your Dog",
        labelFr: "American Kennel Club : L'importance de ramasser les déjections de votre chien",
        url: "https://www.akc.org/expert-advice/advice/dog-poop-cleanup/",
      },
      {
        labelEn: "PetMD: The Scoop on Poop, Facts on How to Dispose of Dog Poop",
        labelFr: "PetMD : Les faits sur l'élimination des déjections canines",
        url: "https://www.petmd.com/dog/care/scoop-poop-facts-and-fiction-about-disposing-it",
      },
    ],
  },
  {
    slug: "dog-poop-health-risks-yard",
    slugFr: "risques-sante-dejections-canines-cour",
    titleEn: "Is Dog Poop in Your Yard a Health Risk?",
    titleFr: "Les déjections canines dans votre cour sont-elles un risque pour la santé?",
    metaDescriptionEn:
      "Uncollected dog waste carries bacteria and parasite eggs that survive in soil for months. Here is who is most at risk, why winter does not kill it, and how regular removal keeps a yard safe.",
    metaDescriptionFr:
      "Les déjections canines non ramassées contiennent des bactéries et des œufs de parasites qui survivent dans le sol pendant des mois. Voici qui est le plus à risque, pourquoi l'hiver ne les élimine pas, et comment un ramassage régulier garde une cour sécuritaire.",
    category: "general",
    relatedSlugs: ["does-dog-poop-kill-grass", "dog-poop-removal-cost-laval", "dog-poop-law-laval-yard"],
    publishedAt: "2026-09-09",
    heroImage: {
      src: "/images/blog/family-yard-dog.jpg",
      alt: "Young child playing with a dog on the grass in a sunny fenced backyard",
      altFr: "Jeune enfant qui joue avec un chien sur le gazon dans une cour clôturée ensoleillée",
      width: 1600,
      height: 1067,
      credit: {
        photographer: "Jonathan Borba",
        url: "https://www.pexels.com/photo/child-playing-with-dog-in-sunny-backyard-32504638/",
      },
    },
    excerptEn:
      "Yes, dog waste left sitting in a yard is a real health risk, but a very manageable one. The single most effective control is not letting it pile up.",
    excerptFr:
      "Oui, les déjections canines laissées dans une cour représentent un vrai risque pour la santé, mais un risque très gérable. Le moyen de contrôle le plus efficace est de ne pas les laisser s'accumuler.",
    keywordsEn: [
      "is dog poop a health risk",
      "dog poop parasites yard",
      "dangers of not picking up dog poop",
      "dog waste health risks kids",
    ],
    keywordsFr: [
      "risques santé déjections canines",
      "parasites crottes de chien cour",
      "dangers de ne pas ramasser les crottes de chien",
    ],
    body: [
      {
        type: "paragraph",
        textEn:
          "Yes. Dog waste left sitting in a yard is a genuine health risk. It carries bacteria and parasite eggs that can survive in the soil for months, and the people and dogs who use the yard every day are the ones exposed. The risk is very manageable, though. It comes down to how long the waste sits, so removing it on a regular schedule is by far the most effective thing you can do.",
        textFr:
          "Oui. Les déjections canines laissées dans une cour représentent un vrai risque pour la santé. Elles contiennent des bactéries et des œufs de parasites qui peuvent survivre dans le sol pendant des mois, et ce sont les personnes et les chiens qui utilisent la cour tous les jours qui y sont exposés. Ce risque reste toutefois très gérable. Tout dépend du temps que les déjections restent au sol, donc les ramasser selon un horaire régulier est de loin la mesure la plus efficace.",
      },
      {
        type: "keypoints",
        titleEn: "The short version",
        titleFr: "En bref",
        itemsEn: [
          "Uncollected dog waste carries bacteria (E. coli, Salmonella) and parasite eggs (roundworm, hookworm) that can stay infective in soil for months.",
          "Young children and other dogs are the most exposed, through ordinary yard use.",
          "Winter does not neutralize it. Snow hides the waste, and the spring thaw exposes a whole season at once.",
          "Removing waste weekly, or every few days with more than one dog, keeps a yard ahead of the risk. See [pricing and service options](/dog-poop-cleanup).",
        ],
        itemsFr: [
          "Les déjections non ramassées contiennent des bactéries (E. coli, salmonelle) et des œufs de parasites (vers ronds, ankylostomes) qui peuvent rester infectieux dans le sol pendant des mois.",
          "Les jeunes enfants et les autres chiens sont les plus exposés, par l'usage normal de la cour.",
          "L'hiver ne neutralise pas le problème. La neige cache les déjections, et le dégel printanier en expose toute une saison d'un coup.",
          "Ramasser les déjections chaque semaine, ou tous les quelques jours avec plus d'un chien, garde une cour en avance sur le risque. Voyez [les prix et options de service](/fr/ramassage-dejections).",
        ],
      },
      { type: "heading", level: 2, textEn: "What is actually in dog waste", textFr: "Ce que contiennent réellement les déjections canines" },
      {
        type: "list",
        itemsEn: [
          "Bacteria: E. coli, Salmonella, and Campylobacter. A single gram of dog waste holds an average of about 23 million fecal coliform bacteria.",
          "Protozoa: Giardia and Cryptosporidium, both of which cause stubborn digestive illness in people and dogs.",
          "Parasite eggs: roundworm (Toxocara), hookworm, whipworm, and tapeworm, which pass in the stool and then mature in the soil.",
          "Viruses: parvovirus from an infected dog, which is hardy and can linger in the ground for months.",
          "Waste from a healthy, symptom-free dog can still carry any of these.",
        ],
        itemsFr: [
          "Bactéries : E. coli, salmonelle et campylobacter. Un seul gramme de déjections canines contient en moyenne environ 23 millions de bactéries coliformes fécales.",
          "Protozoaires : Giardia et Cryptosporidium, qui causent tous deux des troubles digestifs tenaces chez les humains et les chiens.",
          "Œufs de parasites : vers ronds (Toxocara), ankylostomes, trichures et ténias, qui sont excrétés dans les selles puis arrivent à maturité dans le sol.",
          "Virus : le parvovirus provenant d'un chien infecté, qui est robuste et peut persister dans le sol pendant des mois.",
          "Les déjections d'un chien en bonne santé et sans symptômes peuvent tout de même contenir n'importe lequel de ces agents.",
        ],
      },
      {
        type: "image",
        src: "/images/blog/dog-backyard-lawn.jpg",
        alt: "Dog lying on a green backyard lawn beside a garden path",
        altFr: "Chien couché sur le gazon d'une cour arrière, près d'une allée de jardin",
        width: 1600,
        height: 1067,
        captionEn: "The lawn your dog uses is the same lawn your family walks on.",
        captionFr: "Le gazon que votre chien utilise est le même gazon sur lequel votre famille marche.",
        credit: {
          photographer: "Mathias Reding",
          url: "https://www.pexels.com/photo/8195886/",
        },
      },
      {
        type: "paragraph",
        textEn:
          "Most of these spread the same way, through tiny amounts of contaminated soil reaching the mouth. Freshly passed roundworm eggs are not infective right away. They need roughly one to four weeks in the soil to develop, and after that they can stay infective in lawns, garden beds, and sandboxes for many months.",
        textFr:
          "La plupart se transmettent de la même façon : de minuscules quantités de sol contaminé qui se rendent à la bouche. Les œufs de vers ronds fraîchement excrétés ne sont pas infectieux immédiatement. Il leur faut environ une à quatre semaines dans le sol pour se développer, et par la suite ils peuvent rester infectieux dans le gazon, les plates-bandes et les carrés de sable pendant plusieurs mois.",
      },
      {
        type: "paragraph",
        textEn:
          "People pick them up through hand to mouth contact after gardening or yard work, from bare feet, or from produce grown in contaminated soil. Rain and spring melt also rinse bacteria off the grass and into flower beds and storm drains.",
        textFr:
          "Les gens les attrapent par contact main-bouche après avoir jardiné ou travaillé dans la cour, par les pieds nus, ou par des légumes cultivés dans un sol contaminé. La pluie et la fonte printanière rincent aussi les bactéries du gazon vers les plates-bandes et les égouts pluviaux.",
      },
      {
        type: "image",
        src: "/images/blog/child-on-grass.jpg",
        alt: "Baby sitting on a lawn in a backyard, holding a toy to their mouth",
        altFr: "Bébé assis sur le gazon d'une cour arrière, portant un jouet à sa bouche",
        width: 1600,
        height: 1067,
        captionEn: "Young children are the most exposed. They play at ground level and put their hands in their mouths.",
        captionFr: "Les jeunes enfants sont les plus exposés. Ils jouent au niveau du sol et portent leurs mains à leur bouche.",
        credit: {
          photographer: "Helena Lopes",
          url: "https://www.pexels.com/photo/baby-enjoying-outdoor-playtime-on-lawn-27176347/",
        },
      },
      { type: "heading", level: 2, textEn: "Who is most at risk", textFr: "Qui est le plus à risque" },
      {
        type: "paragraph",
        textEn:
          "Young children carry the most human risk. Swallowed roundworm larvae can migrate through the body, and while serious cases are rare, they can involve the eyes, liver, or lungs. Pregnant people and anyone with a weakened immune system are also more vulnerable to the bacteria and protozoa involved.",
        textFr:
          "Ce sont les jeunes enfants qui courent le plus grand risque. Les larves de vers ronds avalées peuvent migrer dans le corps et, même si les cas graves sont rares, elles peuvent toucher les yeux, le foie ou les poumons. Les personnes enceintes et celles dont le système immunitaire est affaibli sont aussi plus vulnérables aux bactéries et aux protozoaires en cause.",
      },
      {
        type: "paragraph",
        textEn:
          "Other dogs are at risk too. Parvovirus and roundworm eggs stay in the ground long after the waste itself is gone, so an unscooped yard becomes a reinfection loop for your own dog and a hazard for any visiting or unvaccinated dog.",
        textFr:
          "Les autres chiens sont également à risque. Le parvovirus et les œufs de vers ronds restent dans le sol longtemps après la disparition des déjections, si bien qu'une cour non ramassée devient une boucle de réinfection pour votre propre chien et un danger pour tout chien de passage ou non vacciné.",
      },
      {
        type: "list",
        itemsEn: [
          "Children under about six years old",
          "Household members who are pregnant or immunocompromised",
          "Other dogs, especially puppies that are not fully vaccinated",
          "Anyone who gardens or does lawn work barefoot or bare handed",
        ],
        itemsFr: [
          "Les enfants d'environ six ans et moins",
          "Les membres du foyer qui sont enceintes ou immunodéprimés",
          "Les autres chiens, surtout les chiots qui ne sont pas complètement vaccinés",
          "Toute personne qui jardine ou travaille sur le terrain pieds nus ou à mains nues",
        ],
      },
      { type: "heading", level: 2, textEn: "Does winter kill it?", textFr: "Est-ce que l'hiver l'élimine?" },
      {
        type: "paragraph",
        textEn:
          "No. Freezing does not reliably destroy roundworm eggs or parvovirus. Snow cover hides the waste and slows decomposition, which preserves the problem rather than solving it.",
        textFr:
          "Non. Le gel ne détruit pas de façon fiable les œufs de vers ronds ni le parvovirus. La couche de neige cache les déjections et ralentit leur décomposition, ce qui préserve le problème au lieu de le régler.",
      },
      {
        type: "paragraph",
        textEn:
          "Picture a yard with one dog, left unscooped from the first snowfall to the spring melt. In a climate with real winter that is four or five months of waste, well over a hundred piles for an average dog, surfacing within a week or two as the snow goes. Meltwater carries the bacteria straight into garden beds and storm drains, so the yard is a higher risk after the thaw than it was before the first snow, not a lower one.",
        textFr:
          "Imaginez une cour avec un seul chien, qui n'est pas ramassée de la première neige jusqu'à la fonte printanière. Dans un climat où l'hiver est bien réel, cela représente quatre ou cinq mois de déjections, bien plus d'une centaine de tas pour un chien moyen, qui refont surface en une semaine ou deux à mesure que la neige disparaît. L'eau de fonte entraîne les bactéries directement dans les plates-bandes et les égouts pluviaux, si bien que la cour présente plus de risque après le dégel qu'avant la première neige, pas moins.",
      },
      {
        type: "image",
        src: "/images/blog/washing-hands.jpg",
        alt: "Person washing their hands with soap",
        altFr: "Personne qui se lave les mains avec du savon",
        width: 1600,
        height: 1067,
        captionEn: "Washing hands after yard time is a good habit, not a substitute for removing the waste.",
        captionFr: "Se laver les mains après un moment dans la cour est une bonne habitude, mais ne remplace pas le ramassage des déjections.",
        credit: {
          photographer: "Ron Lach",
          url: "https://www.pexels.com/photo/man-washing-hands-with-soap-in-stone-basin-for-hygiene-and-cleanliness-9145340/",
        },
      },
      { type: "heading", level: 2, textEn: "How to lower the risk", textFr: "Comment réduire le risque" },
      {
        type: "list",
        itemsEn: [
          "Remove waste at least once a week, and every few days if you have more than one dog",
          "Bag it and put it in the trash rather than composting or burying it",
          "Keep young children's play areas and sandboxes separate from where the dog goes, and cover the sandbox when it is not in use",
          "Follow your veterinarian's deworming and vaccination schedule",
          "Wash hands after gardening or yard play, and rinse off shoes that have been on the grass",
          "Pick up promptly after any visiting dog",
        ],
        itemsFr: [
          "Ramasser les déjections au moins une fois par semaine, et tous les quelques jours si vous avez plus d'un chien",
          "Les mettre dans un sac et à la poubelle plutôt que de les composter ou de les enfouir",
          "Garder les aires de jeu et les carrés de sable des jeunes enfants à l'écart de l'endroit où va le chien, et couvrir le carré de sable quand il ne sert pas",
          "Suivre le calendrier de vermifugation et de vaccination recommandé par votre vétérinaire",
          "Se laver les mains après avoir jardiné ou joué dans la cour, et rincer les chaussures qui ont été sur le gazon",
          "Ramasser sans tarder après le passage de tout chien visiteur",
        ],
      },
      {
        type: "callout",
        titleEn: "Keep the yard clear without the chore",
        titleFr: "Gardez la cour propre sans la corvée",
        bodyEn:
          "Recurring service removes the waste on a set schedule, bags it, puts it in your bin, and sends a photo afterward. Weekly or biweekly, no contract, year round.",
        bodyFr:
          "Le service récurrent ramasse les déjections selon un horaire fixe, les met en sac, les dépose dans votre bac et vous envoie une photo par la suite. Hebdomadaire ou aux deux semaines, sans contrat, toute l'année.",
      },
      { type: "heading", level: 2, textEn: "How often does waste need to be removed to stay ahead of it?", textFr: "À quelle fréquence faut-il ramasser pour garder une longueur d'avance?" },
      {
        type: "paragraph",
        textEn:
          "Because roundworm eggs take about one to four weeks to become infective, weekly or biweekly removal keeps the yard ahead of that window and stops eggs from ever maturing in your soil. Households with more than one dog, or with young kids using the yard, are better off on weekly service. On our [service pages](/dog-poop-cleanup), the calculator prices weekly and biweekly visits from the same base rate, so you can pick the frequency that fits without a penalty for choosing more often.",
        textFr:
          "Comme les œufs de vers ronds prennent environ une à quatre semaines pour devenir infectieux, un ramassage hebdomadaire ou aux deux semaines garde la cour en avance sur cette fenêtre et empêche les œufs d'arriver à maturité dans votre sol. Les foyers avec plus d'un chien, ou avec de jeunes enfants qui utilisent la cour, ont avantage à choisir le service hebdomadaire. Sur nos [pages de service](/fr/ramassage-dejections), le calculateur établit le prix des visites hebdomadaires et aux deux semaines à partir du même tarif de base, donc vous pouvez choisir la fréquence qui vous convient sans être pénalisé pour un passage plus fréquent.",
      },
      { type: "heading", level: 2, textEn: "The bottom line", textFr: "En résumé" },
      {
        type: "paragraph",
        textEn:
          "Uncollected dog waste is a real risk, but a very controllable one. The fix is consistency rather than any special product: do not let it pile up. It is the same routine that keeps waste from [burning patches into your lawn](/blog/does-dog-poop-kill-grass). Whether you scoop it yourself every few days or [have it done for you](/dog-poop-cleanup#quote-form), the goal is the same. Recurring service runs year round, including through the winter, you do not need to be home for a visit, and you get a gate photo after every cleanup so you know it was done.",
        textFr:
          "Les déjections canines non ramassées représentent un vrai risque, mais un risque très maîtrisable. La solution tient à la constance plutôt qu'à un produit particulier : il ne faut pas les laisser s'accumuler. C'est la même routine qui empêche les déjections de [brûler des plaques dans votre gazon](/fr/blogue/les-crottes-de-chien-tuent-elles-le-gazon). Que vous les ramassiez vous-même tous les quelques jours ou que vous [en confiiez la tâche](/fr/ramassage-dejections#quote-form), l'objectif est le même. Le service récurrent est offert toute l'année, y compris l'hiver, vous n'avez pas besoin d'être présent lors d'une visite, et vous recevez une photo du portail après chaque nettoyage pour savoir que le travail a été fait.",
      },
    ],
    faq: [
      {
        qEn: "Can you get sick from dog poop in your own yard?",
        qFr: "Peut-on tomber malade à cause des crottes de chien dans sa propre cour?",
        aEn: "Yes. Dog waste can carry bacteria like E. coli and Salmonella and parasites like roundworm and Giardia, and people are exposed mainly through hand to mouth contact or bare skin. The risk is low when waste is removed promptly and hands are washed, and it climbs the longer the waste sits.",
        aFr: "Oui. Les déjections canines peuvent contenir des bactéries comme E. coli et la salmonelle ainsi que des parasites comme le ver rond et Giardia, et les gens y sont exposés surtout par contact main-bouche ou par la peau nue. Le risque est faible quand les déjections sont ramassées rapidement et qu'on se lave les mains, et il augmente plus les déjections restent au sol longtemps.",
      },
      {
        qEn: "How long do dog parasite eggs survive in soil?",
        qFr: "Combien de temps les œufs de parasites de chien survivent-ils dans le sol?",
        aEn: "Roundworm (Toxocara) eggs need about one to four weeks in the soil to become infective, and after that they can remain infective for many months, longer in shaded, moist ground. Removing waste before the eggs mature is the main way to break that cycle.",
        aFr: "Les œufs de vers ronds (Toxocara) ont besoin d'environ une à quatre semaines dans le sol pour devenir infectieux, et par la suite ils peuvent le rester pendant plusieurs mois, plus longtemps dans un sol ombragé et humide. Ramasser les déjections avant que les œufs arrivent à maturité est le principal moyen de briser ce cycle.",
      },
      {
        qEn: "Is frozen dog poop still a health risk?",
        qFr: "Les crottes de chien gelées présentent-elles encore un risque pour la santé?",
        aEn: "Yes. Freezing does not reliably kill roundworm eggs or parvovirus. Winter mostly hides and preserves the waste, and the spring thaw exposes a whole season of it at once.",
        aFr: "Oui. Le gel ne tue pas de façon fiable les œufs de vers ronds ni le parvovirus. L'hiver ne fait surtout que cacher et préserver les déjections, et le dégel printanier en expose toute une saison d'un coup.",
      },
      {
        qEn: "How often should I remove dog waste to reduce the health risk?",
        qFr: "À quelle fréquence dois-je ramasser les déjections pour réduire le risque pour la santé?",
        aEn: "At least once a week. Move to every few days if you have more than one dog or young children who use the yard, since that keeps the yard ahead of the one to four week window parasite eggs need to become infective.",
        aFr: "Au moins une fois par semaine. Passez à tous les quelques jours si vous avez plus d'un chien ou de jeunes enfants qui utilisent la cour, car cela garde la cour en avance sur la fenêtre de une à quatre semaines dont les œufs de parasites ont besoin pour devenir infectieux.",
      },
    ],
    sources: [
      {
        labelEn: "CDC: How Toxocariasis Spreads",
        labelFr: "CDC : Comment se transmet la toxocarose",
        url: "https://www.cdc.gov/toxocariasis/spreads/index.html",
      },
      {
        labelEn: "CDC: About Toxocariasis",
        labelFr: "CDC : À propos de la toxocarose",
        url: "https://www.cdc.gov/toxocariasis/about/index.html",
      },
      {
        labelEn: "US EPA: Pet Waste and Water Quality",
        labelFr: "US EPA : Les déjections animales et la qualité de l'eau",
        url: "https://cfpub.epa.gov/npstbx/files/cwc_petwastefactsheet.pdf",
      },
      {
        labelEn: "American Kennel Club: Dog Poop Disposal and Why Cleaning Up Matters",
        labelFr: "American Kennel Club : L'élimination des crottes de chien et pourquoi le ramassage compte",
        url: "https://www.akc.org/expert-advice/advice/dog-poop-cleanup/",
      },
    ],
  },
  {
    slug: "does-dog-poop-kill-grass",
    slugFr: "les-crottes-de-chien-tuent-elles-le-gazon",
    titleEn: "Does Dog Poop Kill Grass?",
    titleFr: "Les crottes de chien tuent-elles le gazon?",
    metaDescriptionEn:
      "Dog waste is not lawn fertilizer. It is acidic and high in nitrogen, so it yellows and burns grass in patches, breaks down slowly, and leaves dead spots. Here is what it does and how to prevent it.",
    metaDescriptionFr:
      "Les déjections canines ne sont pas un engrais à gazon. Elles sont acides et riches en azote, donc elles jaunissent et brûlent le gazon par plaques, se décomposent lentement et laissent des zones mortes. Voici ce qu'elles font et comment l'éviter.",
    category: "general",
    relatedSlugs: ["dog-poop-health-risks-yard", "dog-poop-removal-cost-laval"],
    publishedAt: "2026-09-09",
    heroImage: {
      src: "/images/blog/healthy-lawn-backyard.jpg",
      alt: "Neatly kept green backyard lawn beside a wooden deck and mature trees",
      altFr: "Cour arrière au gazon vert bien entretenu, à côté d'une terrasse en bois et d'arbres matures",
      width: 1600,
      height: 1068,
      credit: {
        photographer: "Max Vakhtbovych",
        url: "https://www.pexels.com/photo/7174104/",
      },
    },
    excerptEn:
      "Dog poop is not the free fertilizer people assume it is. It is acidic, high in nitrogen, and slow to break down, so it burns the lawn in yellow and brown patches.",
    excerptFr:
      "Les crottes de chien ne sont pas l'engrais gratuit qu'on imagine. Elles sont acides, riches en azote et lentes à se décomposer, donc elles brûlent le gazon en plaques jaunes et brunes.",
    keywordsEn: [
      "does dog poop kill grass",
      "is dog poop bad for grass",
      "dog poop lawn damage",
      "dog poop fertilizer",
      "yellow grass patches dog",
    ],
    keywordsFr: [
      "les crottes de chien tuent le gazon",
      "crottes de chien mauvaises pour le gazon",
      "dommages pelouse crottes de chien",
      "taches jaunes gazon chien",
    ],
    body: [
      {
        type: "paragraph",
        textEn:
          "Short answer: yes, over time. Dog waste is not the free lawn fertilizer people assume it is. A dog's high-protein diet makes its poop acidic and heavy in nitrogen and salts, and it breaks down slowly. Left on the lawn, it yellows and burns the grass in patches, smothers whatever is under it, and eventually leaves bare dead spots that need reseeding.",
        textFr:
          "Réponse courte : oui, avec le temps. Les déjections canines ne sont pas l'engrais gratuit qu'on imagine. L'alimentation riche en protéines du chien rend ses crottes acides et chargées d'azote et de sels, et elles se décomposent lentement. Laissées sur le gazon, elles le jaunissent et le brûlent par plaques, étouffent ce qui se trouve dessous et finissent par laisser des zones mortes à nu qu'il faut réensemencer.",
      },
      {
        type: "keypoints",
        titleEn: "The short version",
        titleFr: "En bref",
        itemsEn: [
          "Dog poop is acidic and high in nitrogen, so concentrated waste burns grass the way over-applied fertilizer does.",
          "It breaks down slowly, up to about a year, smothering the grass underneath the whole time.",
          "Damage shows up in stages: a dark green tuft, then a yellow patch, then a dead brown spot.",
          "Urine causes the fast yellow rings; poop is the slower, deeper problem. Both come down to removing waste promptly. See [service options](/dog-poop-cleanup).",
        ],
        itemsFr: [
          "Les crottes de chien sont acides et riches en azote, donc les déjections concentrées brûlent le gazon comme un engrais appliqué en excès.",
          "Elles se décomposent lentement, jusqu'à environ un an, en étouffant le gazon en dessous pendant tout ce temps.",
          "Les dommages apparaissent par étapes : une touffe vert foncé, puis une plaque jaune, puis une zone brune morte.",
          "L'urine cause les anneaux jaunes rapides; les crottes sont le problème plus lent et plus profond. Dans les deux cas, il faut ramasser sans tarder. Voyez [les options de service](/fr/ramassage-dejections).",
        ],
      },
      { type: "heading", level: 2, textEn: "Why dog waste is not fertilizer", textFr: "Pourquoi les déjections ne sont pas un engrais" },
      {
        type: "paragraph",
        textEn:
          "Cow and horse manure work as fertilizer because those animals are herbivores. Their waste is already broken-down plant matter with a fairly balanced mix of nutrients. Dogs are not herbivores. Their diet is mostly meat and protein, which makes the waste acidic, salty, and far too concentrated in nitrogen to feed a lawn safely.",
        textFr:
          "Le fumier de vache ou de cheval fonctionne comme engrais parce que ces animaux sont herbivores. Leur fumier est déjà de la matière végétale décomposée, avec un mélange de nutriments assez équilibré. Le chien n'est pas herbivore. Son alimentation est surtout composée de viande et de protéines, ce qui rend ses déjections acides, salées et beaucoup trop concentrées en azote pour nourrir un gazon en toute sécurité.",
      },
      {
        type: "paragraph",
        textEn:
          "Nitrogen is a real lawn nutrient, but grass can only use so much at once. A pile of waste delivers a large dose to one small spot. The grass right there gets scorched, the same effect as spilling concentrated fertilizer or a dog urinating in the same place every day.",
        textFr:
          "L'azote est un vrai nutriment pour le gazon, mais l'herbe ne peut en absorber qu'une certaine quantité à la fois. Un tas de déjections libère une forte dose au même petit endroit. Le gazon à cet endroit est brûlé, exactement comme si on renversait de l'engrais concentré ou comme lorsqu'un chien urine toujours au même endroit.",
      },
      { type: "heading", level: 2, textEn: "What the damage looks like, stage by stage", textFr: "À quoi ressemblent les dommages, étape par étape" },
      {
        type: "list",
        ordered: true,
        itemsEn: [
          "A small tuft of tall, dark green grass. The waste has started to break down and is releasing a little nitrogen, which briefly overfeeds that spot.",
          "A yellow patch. The nitrogen and salt load has passed what the grass can handle and the blades start to burn.",
          "A brown, dead patch. The grass is gone. Once it is fully brown it does not recover on its own and the spot has to be reseeded.",
        ],
        itemsFr: [
          "Une petite touffe d'herbe haute et vert foncé. Les déjections ont commencé à se décomposer et libèrent un peu d'azote, ce qui suralimente brièvement cet endroit.",
          "Une plaque jaune. La charge d'azote et de sels a dépassé ce que le gazon peut tolérer et les brins commencent à brûler.",
          "Une zone brune et morte. Le gazon a disparu. Une fois complètement brun, il ne récupère pas seul et il faut réensemencer l'endroit.",
        ],
      },
      {
        type: "image",
        src: "/images/blog/patchy-lawn-damage.jpg",
        alt: "Lawn with healthy green blades mixed with dead brown patches",
        altFr: "Gazon où des brins verts en santé se mêlent à des plaques brunes mortes",
        width: 1600,
        height: 1200,
        captionEn: "Green blades mixed with dead brown is the middle stage. The brown areas will not come back without reseeding.",
        captionFr: "Des brins verts mêlés à du brun mort, c'est l'étape intermédiaire. Les zones brunes ne reviendront pas sans réensemencement.",
        credit: {
          photographer: "Engin Akyurt",
          url: "https://www.pexels.com/photo/green-and-brown-grass-11054959/",
        },
      },
      { type: "heading", level: 2, textEn: "It is not just the nitrogen", textFr: "Ce n'est pas seulement l'azote" },
      {
        type: "paragraph",
        textEn:
          "Waste that sits also physically blocks light and air from the grass under it, which smothers those blades regardless of the chemistry. Because it breaks down slowly, up to about a year in cooler climates, that smothering lasts a long time. Decomposing waste also lowers the soil pH in that spot, attracts flies and pests, and can seed weeds that move in wherever the grass has thinned out.",
        textFr:
          "Les déjections qui restent bloquent aussi physiquement la lumière et l'air pour le gazon en dessous, ce qui étouffe ces brins peu importe la chimie. Comme elles se décomposent lentement, jusqu'à environ un an dans les climats plus frais, cet étouffement dure longtemps. Les déjections en décomposition abaissent aussi le pH du sol à cet endroit, attirent les mouches et les ravageurs, et peuvent semer des mauvaises herbes qui s'installent partout où le gazon s'est éclairci.",
      },
      { type: "heading", level: 2, textEn: "Poop or urine: which is worse for the lawn?", textFr: "Crottes ou urine : qu'est-ce qui est pire pour le gazon?" },
      {
        type: "paragraph",
        textEn:
          "Urine does the faster visible damage. It is basically a liquid nitrogen dose, so it creates the classic yellow spot with a dark green ring within days. Poop is slower but harder to undo, because it smothers, acidifies, and keeps releasing nitrogen for months while it breaks down. A yard with a dog gets both, and the only real control for either is to keep the waste picked up and rinse fresh urine spots when you can.",
        textFr:
          "L'urine fait les dommages visibles les plus rapides. C'est essentiellement une dose liquide d'azote, donc elle crée en quelques jours la fameuse tache jaune bordée de vert foncé. Les crottes sont plus lentes mais plus difficiles à corriger, car elles étouffent, acidifient et continuent de libérer de l'azote pendant des mois en se décomposant. Une cour avec un chien subit les deux, et le seul vrai moyen de contrôle dans les deux cas est de garder les déjections ramassées et de rincer les taches d'urine fraîches quand c'est possible.",
      },
      { type: "heading", level: 2, textEn: "How to protect the lawn", textFr: "Comment protéger le gazon" },
      {
        type: "list",
        itemsEn: [
          "Remove waste at least weekly, ideally every few days, so it never gets the two to four weeks it needs to start breaking down into the soil.",
          "Do not mow over it. Mowing spreads the waste and pushes it down into the turf.",
          "Rinse fresh urine spots with water when you notice them, which dilutes the nitrogen before it burns.",
          "Reseed brown patches once the source is gone. They will not fill back in on their own.",
          "Never compost dog waste in a regular bin or use it on vegetable beds. It is a health hazard, not garden material.",
        ],
        itemsFr: [
          "Ramasser les déjections au moins une fois par semaine, idéalement tous les quelques jours, pour qu'elles n'aient jamais les deux à quatre semaines nécessaires pour commencer à se décomposer dans le sol.",
          "Ne pas passer la tondeuse dessus. La tonte étale les déjections et les enfonce dans le gazon.",
          "Rincer les taches d'urine fraîches à l'eau dès qu'on les remarque, ce qui dilue l'azote avant qu'il ne brûle.",
          "Réensemencer les zones brunes une fois la source éliminée. Elles ne se regarnissent pas d'elles-mêmes.",
          "Ne jamais composter les déjections canines dans un bac ordinaire ni les utiliser sur un potager. C'est un risque sanitaire, pas de la matière à jardin.",
        ],
      },
      {
        type: "callout",
        titleEn: "A clear lawn without the daily walk-around",
        titleFr: "Un gazon propre sans la ronde quotidienne",
        bodyEn:
          "Recurring service picks up the waste on a set schedule, before it has time to damage the grass, bags it, and sends a photo afterward. Weekly or biweekly, no contract.",
        bodyFr:
          "Le service récurrent ramasse les déjections selon un horaire fixe, avant qu'elles n'aient le temps d'abîmer le gazon, les met en sac et envoie une photo par la suite. Hebdomadaire ou aux deux semaines, sans contrat.",
      },
      {
        type: "image",
        src: "/images/blog/dog-playing-grass.jpg",
        alt: "Dog playing with a ball on a green lawn",
        altFr: "Chien qui joue avec une balle sur un gazon vert",
        width: 1600,
        height: 1067,
        captionEn: "The point of a lawn is a dog that can use it and grass that survives the year.",
        captionFr: "L'intérêt d'un gazon, c'est un chien qui peut en profiter et de l'herbe qui passe l'année.",
        credit: {
          photographer: "Barnabas Davoti",
          url: "https://www.pexels.com/photo/a-dog-on-grass-13701757/",
        },
      },
      { type: "heading", level: 2, textEn: "The bottom line", textFr: "En résumé" },
      {
        type: "paragraph",
        textEn:
          "Dog waste will not fertilize a lawn. It is too acidic, too salty, and too concentrated, and it works against the grass the whole time it sits there. The lawn damage and the [health risks](/blog/dog-poop-health-risks-yard) have the same fix: keep the yard picked up on a schedule so nothing has time to break down where the grass, and your family, actually are. If you would rather not do it yourself, here is [what recurring pickup costs](/blog/dog-poop-removal-cost-laval).",
        textFr:
          "Les déjections canines ne fertilisent pas un gazon. Elles sont trop acides, trop salées et trop concentrées, et elles nuisent au gazon pendant tout le temps qu'elles restent là. Les dommages au gazon et les [risques pour la santé](/fr/blogue/risques-sante-dejections-canines-cour) ont la même solution : garder la cour ramassée selon un horaire pour que rien n'ait le temps de se décomposer là où se trouvent le gazon, et votre famille. Si vous préférez ne pas vous en occuper vous-même, voici [ce que coûte un ramassage récurrent](/fr/blogue/cout-ramassage-dejections-canines-laval).",
      },
    ],
    faq: [
      {
        qEn: "Is dog poop good fertilizer for grass?",
        qFr: "Les crottes de chien sont-elles un bon engrais pour le gazon?",
        aEn: "No. Unlike herbivore manure, dog waste is acidic, salty, and too high in nitrogen for a lawn. Concentrated in one spot, it burns the grass rather than feeding it.",
        aFr: "Non. Contrairement au fumier d'herbivore, les déjections canines sont acides, salées et trop riches en azote pour un gazon. Concentrées au même endroit, elles brûlent le gazon au lieu de le nourrir.",
      },
      {
        qEn: "How long does it take dog poop to damage a lawn?",
        qFr: "Combien de temps faut-il pour que les crottes de chien abîment un gazon?",
        aEn: "It starts breaking down into the soil after about two to four weeks and can take up to a year to decompose fully. Yellowing often shows within a few weeks, and a fully brown dead patch can follow if the waste is left in place.",
        aFr: "Elles commencent à se décomposer dans le sol après environ deux à quatre semaines et peuvent prendre jusqu'à un an pour se décomposer complètement. Le jaunissement apparaît souvent en quelques semaines, et une zone morte complètement brune peut suivre si les déjections restent en place.",
      },
      {
        qEn: "Will dead patches from dog waste grow back?",
        qFr: "Les zones mortes causées par les déjections repoussent-elles?",
        aEn: "Once grass is fully brown it usually does not recover on its own. After you remove the source, loosen the soil, reseed the patch, and keep it watered until it fills in.",
        aFr: "Une fois que le gazon est complètement brun, il ne récupère généralement pas seul. Après avoir éliminé la source, ameublissez le sol, réensemencez la zone et gardez-la arrosée jusqu'à ce qu'elle se regarnisse.",
      },
      {
        qEn: "Is dog urine or dog poop worse for grass?",
        qFr: "L'urine ou les crottes de chien : qu'est-ce qui est pire pour le gazon?",
        aEn: "Urine causes faster visible burns, the yellow spots with a green ring. Poop is slower but harder to reverse because it also smothers the grass and lowers soil pH while it breaks down. Both are controlled by prompt cleanup.",
        aFr: "L'urine cause des brûlures visibles plus rapides, les taches jaunes bordées de vert. Les crottes sont plus lentes mais plus difficiles à corriger parce qu'elles étouffent aussi le gazon et abaissent le pH du sol en se décomposant. Dans les deux cas, un ramassage rapide règle le problème.",
      },
    ],
    sources: [
      {
        labelEn: "TruGreen: How Does Pet Waste Affect Your Lawn's Health?",
        labelFr: "TruGreen : comment les déjections animales affectent-elles la santé de votre pelouse?",
        url: "https://www.trugreen.com/lawn-care-101/blog/lawn-care-tips/pet-waste-and-lawn-damage",
      },
      {
        labelEn: "Angi: Is Dog Poop Good for Your Grass?",
        labelFr: "Angi : les crottes de chien sont-elles bonnes pour votre gazon?",
        url: "https://www.angi.com/articles/dog-poop-good-grass.htm",
      },
      {
        labelEn: "American Kennel Club: Dog Poop Disposal and Why Cleaning Up Matters",
        labelFr: "American Kennel Club : L'élimination des crottes de chien et pourquoi le ramassage compte",
        url: "https://www.akc.org/expert-advice/advice/dog-poop-cleanup/",
      },
      {
        labelEn: "US EPA: Pet Waste and Water Quality",
        labelFr: "US EPA : Les déjections animales et la qualité de l'eau",
        url: "https://cfpub.epa.gov/npstbx/files/cwc_petwastefactsheet.pdf",
      },
    ],
  },
  {
    slug: "dog-poop-law-laval-yard",
    slugFr: "loi-crottes-chien-cour-laval",
    titleEn: "Do You Have to Pick Up Dog Poop in Your Own Yard in Laval? What the Bylaw Actually Says",
    titleFr: "Est-il obligatoire de ramasser les crottes de son chien dans sa propre cour à Laval? Ce que dit vraiment le règlement",
    metaDescriptionEn:
      "Yes, Laval's bylaw requires you to regularly clean up dog poop in your own yard, with fines up to $1,000. Here's exactly what Règlement L-12430 (Articles 37 to 39) says.",
    metaDescriptionFr:
      "Oui, le règlement de Laval vous oblige à ramasser régulièrement les crottes de votre chien dans votre propre cour, sous peine d'amendes allant jusqu'à 1000 $. Voici ce que dit exactement le Règlement L-12430 (articles 37 à 39).",
    category: "local",
    locationSlug: "laval",
    relatedSlugs: ["dog-poop-removal-cost-laval", "dog-poop-health-risks-yard"],
    publishedAt: "2026-09-13",
    heroImage: {
      src: "/images/blog/suburban-houses-laval.jpg",
      alt: "Row of suburban houses on a quiet residential street",
      altFr: "Rangée de maisons de banlieue sur une rue résidentielle tranquille",
      width: 1600,
      height: 2000,
      credit: {
        photographer: "Raphael Loquellano",
        url: "https://www.pexels.com/photo/houses-in-the-suburbs-18093637/",
      },
    },
    excerptEn:
      "Yes: Laval's bylaw requires 'regular and hygienic' removal of dog waste from your own yard, with the same fines as leaving it in public, up to $1,000. Here's exactly what the bylaw requires.",
    excerptFr:
      "Oui : le règlement de Laval exige un ramassage « régulier et hygiénique » des déjections canines dans votre propre cour, avec les mêmes amendes que si vous les laissiez dans un lieu public, jusqu'à 1000 $. Voici exactement ce que le règlement exige.",
    keywordsEn: [
      "dog poop law Laval",
      "fine for not picking up dog poop Laval",
      "Laval dog bylaw yard",
      "is it illegal to not pick up dog poop in your yard",
    ],
    keywordsFr: [
      "loi crotte de chien Laval",
      "amende ne pas ramasser crotte de chien",
      "règlement chien cour Laval",
      "obligatoire ramasser crotte de chien Québec",
    ],
    body: [
      {
        type: "paragraph",
        textEn:
          "Yes. Laval's animal bylaw, Règlement L-12430, does not stop at public spaces. Article 39 specifically requires dog owners to clean up feces \"regularly and hygienically\" from the land where their home is located, your yard, and breaking it carries the same fine as leaving waste in a park: up to $1,000 for an individual. Here is exactly what the bylaw requires, article by article, and what \"regular\" actually means in practice.",
        textFr:
          "Oui. Le règlement sur les animaux de Laval, le Règlement L-12430, ne s'arrête pas aux lieux publics. L'article 39 oblige précisément les propriétaires de chien à ramasser les matières fécales « de façon régulière et hygiénique » sur le terrain où se trouve leur résidence, c'est-à-dire leur cour, et enfreindre cette règle entraîne la même amende que de laisser des déjections dans un parc : jusqu'à 1000 $ pour une personne physique. Voici exactement ce qu'exige le règlement, article par article, et ce que « régulier » veut vraiment dire en pratique.",
      },
      {
        type: "keypoints",
        titleEn: "The short version",
        titleFr: "En bref",
        itemsEn: [
          "Article 39 of Règlement L-12430 requires \"regular and hygienic\" cleanup of feces on the land where your dwelling is located, your own yard.",
          "Article 38 separately requires cleanup of any other public or private place your dog soils, like a sidewalk, a park, or a neighbour's lawn.",
          "Article 37 requires carrying bags and picking up immediately whenever you are out with your dog, away from your own home or land you have permission to be on.",
          "Breaking Article 38 or Article 39 carries the same fine under Article 86(3): $300 to $1,000 for an individual, $600 to $2,000 for a corporation, doubled for a repeat offence.",
        ],
        itemsFr: [
          "L'article 39 du Règlement L-12430 exige un ramassage « régulier et hygiénique » des matières fécales sur le terrain où se trouve votre résidence, c'est-à-dire votre cour.",
          "L'article 38 oblige séparément à nettoyer tout autre lieu public ou privé souillé par votre chien, comme un trottoir, un parc ou le terrain d'un voisin.",
          "L'article 37 oblige à avoir des sacs et à ramasser immédiatement dès que vous êtes en sortie avec votre chien, à l'extérieur de votre résidence ou d'un terrain où vous avez la permission de vous trouver.",
          "Une infraction à l'article 38 ou à l'article 39 entraîne la même amende en vertu de l'article 86(3) : 300 $ à 1000 $ pour une personne physique, 600 $ à 2000 $ pour une personne morale, doublée en cas de récidive.",
        ],
      },
      { type: "heading", level: 2, textEn: "What the bylaw requires, article by article", textFr: "Ce que le règlement exige, article par article" },
      {
        type: "paragraph",
        textEn:
          "Règlement L-12430 is Laval's general bylaw on domestic animals, and Chapter X, \"Urine et matières fécales animales,\" is the part that covers cleanup. It is split into three articles, and they cover different situations with different standards.",
        textFr:
          "Le Règlement L-12430 est le règlement général de Laval sur les animaux domestiques, et le chapitre X, « Urine et matières fécales animales », est la partie qui couvre le ramassage. Il se divise en trois articles, qui couvrent des situations différentes avec des normes différentes.",
      },
      {
        type: "list",
        itemsEn: [
          "Article 37: when you are out with your dog, you must carry the means to remove feces immediately and dispose of it in an approved waste container, except within your dwelling, on your own land, or on other private land where you have the owner's permission.",
          "Article 38: it is prohibited to fail to clean, by appropriate means, any public or private place soiled by your dog's feces, other than the land where your own dwelling is located. This covers sidewalks, parks, and other people's property.",
          "Article 39: it is prohibited to fail to clean, regularly and hygienically, urine or feces inside your dwelling, on a balcony or gallery, and feces on the land where your dwelling is located. Your yard.",
          "Article 39 also states that the neighbourhood must never be inconvenienced by how you dispose of the urine or feces.",
        ],
        itemsFr: [
          "Article 37 : lorsque vous sortez avec votre chien, vous devez avoir de quoi ramasser immédiatement les matières fécales et les jeter dans un contenant à rebuts autorisé, sauf dans votre unité d'occupation, sur votre propre terrain, ou sur un autre terrain privé où vous avez la permission du propriétaire.",
          "Article 38 : il est interdit d'omettre de nettoyer, par des moyens appropriés, tout lieu public ou privé souillé par les matières fécales de votre chien, autre que le terrain où se trouve votre propre résidence. Cela couvre les trottoirs, les parcs et les propriétés d'autrui.",
          "Article 39 : il est interdit d'omettre de nettoyer, de façon régulière et hygiénique, l'urine ou les matières fécales dans votre unité d'occupation, sur une galerie ou un balcon, ainsi que les matières fécales sur le terrain où se trouve votre résidence. Votre cour.",
          "L'article 39 précise aussi que le voisinage ne doit jamais être incommodé par la façon dont vous disposez de l'urine ou des matières fécales.",
        ],
      },
      {
        type: "image",
        src: "/images/blog/gavel-law-desk.jpg",
        alt: "Wooden gavel resting on a desk",
        altFr: "Marteau de juge en bois posé sur un bureau",
        width: 1600,
        height: 2400,
        captionEn: "The same fine applies whether the waste is left in a park or in your own yard.",
        captionFr: "La même amende s'applique, que les déjections soient laissées dans un parc ou dans votre propre cour.",
        credit: {
          photographer: "Sora Shimazaki",
          url: "https://www.pexels.com/photo/black-wooden-gavel-5668484/",
        },
      },
      { type: "heading", level: 2, textEn: "Does \"regular\" mean you have to scoop every day?", textFr: "Est-ce que « régulier » veut dire tous les jours?" },
      {
        type: "paragraph",
        textEn:
          "The bylaw does not spell out an exact interval for Article 39 the way it does for Article 37, which uses the word \"immediately\" for walks. \"Regularly and hygienically\" is a standard, not a countdown, but it is written that way on purpose: it leaves room for a normal cleanup routine at home instead of requiring you to run outside the moment your dog goes, while still making clear that letting waste accumulate is not compliant. The clause banning any inconvenience to the neighbourhood is doing real work here too, since Laval yards tend to sit close together, and a yard that smells or draws complaints is exactly the situation this article targets.",
        textFr:
          "Le règlement ne précise pas d'intervalle exact pour l'article 39 comme il le fait pour l'article 37, qui utilise le mot « immédiatement » pour les sorties. « De façon régulière et hygiénique » est une norme, pas un compte à rebours, mais elle est rédigée ainsi volontairement : elle laisse place à une routine de nettoyage normale à la maison plutôt que d'exiger de sortir dès que votre chien fait ses besoins, tout en précisant clairement que laisser les déjections s'accumuler ne respecte pas la règle. La clause qui interdit d'incommoder le voisinage a aussi un vrai rôle ici, puisque les cours à Laval sont souvent rapprochées, et une cour qui sent mauvais ou qui suscite des plaintes est exactement la situation que cet article vise.",
      },
      {
        type: "paragraph",
        textEn:
          "In practice, enforcement is complaint-driven. A bylaw officer is not routinely inspecting backyards, so most Article 39 cases start with a neighbour reporting the smell or the mess to the city. That does not make the obligation optional, it just means the risk is highest for a yard that has been left long enough for someone else to notice.",
        textFr:
          "En pratique, l'application se fait généralement à la suite d'une plainte. Un agent municipal n'inspecte pas les cours arrière de façon routinière, donc la plupart des cas liés à l'article 39 débutent lorsqu'un voisin signale l'odeur ou le dégât à la ville. Cela ne rend pas l'obligation facultative pour autant, cela veut simplement dire que le risque est le plus élevé pour une cour laissée à l'abandon assez longtemps pour que quelqu'un d'autre le remarque.",
      },
      { type: "heading", level: 2, textEn: "Why it is worth staying ahead of, fine or not", textFr: "Pourquoi garder une longueur d'avance, amende ou pas" },
      {
        type: "paragraph",
        textEn:
          "The bylaw is one reason to keep the yard clear on a schedule, but it is not the only one.",
        textFr:
          "Le règlement est une raison de garder la cour propre sur une base régulière, mais ce n'est pas la seule.",
      },
      {
        type: "list",
        itemsEn: [
          "Health: uncollected waste carries bacteria and parasite eggs that can sit in the soil for months, a real risk for kids and other pets. See [the full breakdown](/blog/dog-poop-health-risks-yard).",
          "Lawn damage: waste is acidic and high in nitrogen, and it burns and kills grass in patches the longer it sits. See [how that happens](/blog/does-dog-poop-kill-grass).",
          "Odour and pests: a yard that has not been cleared for weeks draws flies and smells worse every warm day, especially in summer, and is the kind of thing a neighbour is most likely to complain about.",
          "Resale and showings: an agent or buyer walking the yard notices immediately, and it is not the impression most sellers want to make.",
        ],
        itemsFr: [
          "Santé : les déjections non ramassées contiennent des bactéries et des œufs de parasites qui peuvent rester dans le sol pendant des mois, un vrai risque pour les enfants et les autres animaux. Voyez [le détail complet](/fr/blogue/risques-sante-dejections-canines-cour).",
          "Dommages au gazon : les déjections sont acides et riches en azote, et elles brûlent et tuent le gazon par plaques plus elles restent longtemps. Voyez [comment cela se produit](/fr/blogue/les-crottes-de-chien-tuent-elles-le-gazon).",
          "Odeurs et ravageurs : une cour non ramassée depuis des semaines attire les mouches et sent de plus en plus mauvais à chaque journée chaude, surtout l'été, exactement le genre de chose qui pousse un voisin à se plaindre.",
          "Revente et visites : un agent ou un acheteur qui marche dans la cour le remarque immédiatement, et ce n'est pas l'impression que la plupart des vendeurs souhaitent laisser.",
        ],
      },
      {
        type: "image",
        src: "/images/blog/clean-backyard-lawn.jpg",
        alt: "Well-maintained green backyard lawn after cleanup",
        altFr: "Cour arrière bien entretenue avec un gazon vert après le nettoyage",
        width: 1600,
        height: 1087,
        captionEn: "A yard kept clear on a schedule satisfies Article 39 and everything else on this list at once.",
        captionFr: "Une cour tenue propre selon un horaire respecte l'article 39 et tout le reste sur cette liste en même temps.",
        credit: {
          photographer: "Max Vakhtbovych",
          url: "https://www.pexels.com/photo/house-backyard-with-lawn-green-grass-7546775/",
        },
      },
      {
        type: "callout",
        titleEn: "Stay compliant without thinking about it",
        titleFr: "Restez en règle sans y penser",
        bodyEn:
          "Recurring service clears your yard on a set schedule, weekly or biweekly, no contract, and sends a gate photo after every visit so you always know it was done.",
        bodyFr:
          "Le service récurrent nettoie votre cour selon un horaire fixe, hebdomadaire ou aux deux semaines, sans contrat, et vous envoie une photo du portail après chaque visite pour que vous sachiez toujours que le travail a été fait.",
      },
      { type: "heading", level: 2, textEn: "The easiest way to stay ahead of it", textFr: "La façon la plus simple de garder une longueur d'avance" },
      {
        type: "paragraph",
        textEn:
          "A weekly or biweekly visit keeps the yard from ever building up long enough to count as anything but \"regular\" under Article 39, and it removes the guesswork about what counts as often enough. It also keeps the yard from smelling, damaging the lawn, or becoming the kind of thing a neighbour notices. [The pricing](/blog/dog-poop-removal-cost-laval) starts at $20 a visit for one dog in a standard Laval yard, with no contract if you want to stop or change frequency.",
        textFr:
          "Une visite hebdomadaire ou aux deux semaines empêche la cour d'accumuler assez de déjections pour ne plus être « régulière » au sens de l'article 39, et enlève toute incertitude sur ce qui compte comme suffisamment fréquent. Cela évite aussi que la cour sente mauvais, abîme le gazon ou devienne le genre de chose qu'un voisin remarque. [Le prix](/fr/blogue/cout-ramassage-dejections-canines-laval) commence à 20 $ par visite pour un chien dans une cour standard à Laval, sans contrat si vous voulez arrêter ou changer la fréquence.",
      },
      { type: "heading", level: 2, textEn: "The bottom line", textFr: "En résumé" },
      {
        type: "paragraph",
        textEn:
          "Laval's bylaw does reach your own yard. Article 39 requires regular, hygienic cleanup there, with the same fine as leaving waste in a park, up to $1,000 and doubled for a repeat offence. On top of the legal side, a yard left uncleared still carries health risks and kills the lawn. Keeping it clear on a schedule covers all of it at once, and [recurring service](/dog-poop-cleanup#quote-form) is the easiest way to make sure it happens every week without adding it to your own list.",
        textFr:
          "Le règlement de Laval touche bel et bien votre propre cour. L'article 39 exige un ramassage régulier et hygiénique à cet endroit, avec la même amende que si les déjections étaient laissées dans un parc, jusqu'à 1000 $ et doublée en cas de récidive. Au-delà de l'aspect légal, une cour laissée à l'abandon comporte tout de même des risques pour la santé et tue le gazon. La garder propre selon un horaire règle tout cela à la fois, et [le service récurrent](/fr/ramassage-dejections#quote-form) est la façon la plus simple de s'assurer que ça se fasse chaque semaine sans l'ajouter à votre propre liste de tâches.",
      },
    ],
    faq: [
      {
        qEn: "Is it illegal to not pick up dog poop in my own yard in Laval?",
        qFr: "Est-il illégal de ne pas ramasser les crottes de son chien dans sa propre cour à Laval?",
        aEn: "Yes. Article 39 of Règlement L-12430 requires regular, hygienic removal of feces from the land where your dwelling is located, the same requirement that applies inside your home or on a balcony or gallery.",
        aFr: "Oui. L'article 39 du Règlement L-12430 exige un ramassage régulier et hygiénique des matières fécales sur le terrain où se trouve votre résidence, la même exigence qui s'applique dans votre logement ou sur un balcon ou une galerie.",
      },
      {
        qEn: "What is the fine for not picking up after your dog in Laval?",
        qFr: "Quelle est l'amende pour ne pas ramasser après son chien à Laval?",
        aEn: "Under Article 86(3), breaking Article 38 (public and other private places) or Article 39 (your own yard) carries the same fine: $300 to $1,000 for an individual and $600 to $2,000 for a corporation, per infraction, doubled for a repeat offence.",
        aFr: "En vertu de l'article 86(3), une infraction à l'article 38 (lieux publics et autres lieux privés) ou à l'article 39 (votre propre cour) entraîne la même amende : de 300 $ à 1000 $ pour une personne physique et de 600 $ à 2000 $ pour une personne morale, par infraction, un montant doublé en cas de récidive.",
      },
      {
        qEn: "Do I have to pick up immediately in my own yard, like I do on a walk?",
        qFr: "Dois-je ramasser immédiatement dans ma propre cour, comme lors d'une promenade?",
        aEn: "No. Article 37's \"immediately\" requirement to carry bags and pick up right away applies when you are out and away from your own home. Article 39 uses a \"regular and hygienic\" standard for your own yard instead, a routine cleanup requirement rather than an instant one.",
        aFr: "Non. L'exigence d'agir « immédiatement » de l'article 37, soit d'avoir des sacs et de ramasser sur-le-champ, s'applique lorsque vous êtes en sortie, loin de votre résidence. L'article 39 utilise plutôt une norme de ramassage « régulier et hygiénique » pour votre propre cour, une exigence de routine plutôt qu'instantanée.",
      },
      {
        qEn: "Can a neighbour report me for dog poop in my yard?",
        qFr: "Un voisin peut-il me signaler pour des crottes de chien dans ma cour?",
        aEn: "Yes. Enforcement of Article 39 is complaint-driven, and the article specifically states the neighbourhood must never be inconvenienced by how you dispose of waste, so an uncleared yard is exactly the kind of thing that can prompt a bylaw complaint.",
        aFr: "Oui. L'application de l'article 39 se fait généralement à la suite d'une plainte, et l'article précise que le voisinage ne doit jamais être incommodé par la façon dont vous disposez des déjections, donc une cour non ramassée est exactement le genre de situation qui peut mener à une plainte au règlement municipal.",
      },
    ],
    sources: [
      {
        labelEn: "Ville de Laval: Règlement L-12430 concernant les animaux (codification administrative, PDF)",
        labelFr: "Ville de Laval : Règlement L-12430 concernant les animaux (codification administrative, PDF)",
        url: "https://www.laval.ca/wp-content/uploads/2024/12/reglement-l-12430.pdf",
      },
      {
        labelEn: "Ville de Laval: Animaux domestiques, règlements et permis",
        labelFr: "Ville de Laval : Animaux domestiques, règlements et permis",
        url: "https://www.laval.ca/reglements-permis/index-reglements/animaux/",
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
