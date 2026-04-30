'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import {
  Bell,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Heart,
  MapPin,
  PawPrint,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LocationSwitcher from "@/components/location-switcher";
import RegularServiceCalculator from "@/components/regular-service-calculator";
import SiteFooter from "@/components/site-footer";
import {
  calculateBookingPrice,
  getMonthlyVisits,
  getYardCategory,
  isCanadianPostalCode,
  normalizePostalCode,
  type DogCount,
  type ServiceFrequency,
} from "@/lib/booking";
import {
  getRegularServiceLocationBySlug,
  isRegularServicePostalCode,
  REGULAR_SERVICE_LOCATIONS,
  type RegularServiceLocation,
} from "@/lib/regular-service-area";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
});

const yardOptions = {
  en: [
    { key: "small", label: "Standard / Small", detail: "~1,000-3,000 sq ft" },
    { key: "medium", label: "Medium", detail: "~3,000-6,000 sq ft" },
    { key: "large", label: "Large", detail: "~6,000-10,000 sq ft" },
    { key: "xlarge", label: "X-Large", detail: "10,000+ sq ft" },
  ],
  fr: [
    { key: "small", label: "Standard / Petit", detail: "~1 000-3 000 pi²" },
    { key: "medium", label: "Moyen", detail: "~3 000-6 000 pi²" },
    { key: "large", label: "Grand", detail: "~6 000-10 000 pi²" },
    { key: "xlarge", label: "Très grand", detail: "10 000+ pi²" },
  ],
} as const;

const frequencyNotes = {
  en: {
    weekly: "Best for keeping the yard under control every week.",
    biweekly: "A practical balance of upkeep and cost.",
    monthly: "A lighter maintenance option for lower buildup.",
    onetime: "A one-time cleanup visit with up to 30 minutes included.",
  },
  fr: {
    weekly: "Le meilleur choix pour garder la cour sous contrôle chaque semaine.",
    biweekly: "Un bon équilibre entre l'entretien et le prix.",
    monthly: "Une option plus légère lorsque l'accumulation est moindre.",
    onetime: "Une visite ponctuelle avec jusqu'à 30 minutes incluses.",
  },
} as const;

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

type RegularServiceLocationPageProps = {
  locale: "en" | "fr";
  location: RegularServiceLocation;
};

export default function RegularServiceLocationPage({
  locale,
  location,
}: RegularServiceLocationPageProps) {
  const isFrench = locale === "fr";
  const locationName = isFrench ? location.nameFr : location.name;
  const homeHref = isFrench ? "/fr" : "/";
  const baseHref = isFrench ? "/fr/ramassage-dejections" : "/dog-poop-cleanup";
  const altHref = isFrench ? `/dog-poop-cleanup/${location.slug}` : `/fr/ramassage-dejections/${location.slug}`;
  const legalHref = isFrench ? "/fr/terms" : "/terms";
  const privacyHref = isFrench ? "/fr/privacy" : "/privacy";
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [frequency, setFrequency] = useState<ServiceFrequency>("weekly");
  const [dogs, setDogs] = useState<DogCount>("1");
  const [yardSqft, setYardSqft] = useState(3000);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [postalCode, setPostalCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postalStatus, setPostalStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingMessage, setBookingMessage] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [websiteField, setWebsiteField] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const yardCategory = useMemo(() => getYardCategory(yardSqft), [yardSqft]);

  const pricingDetails = useMemo(() => {
    const perVisit = calculateBookingPrice(frequency, dogs, yardSqft);
    return { perVisit, note: frequencyNotes[locale][frequency] };
  }, [dogs, frequency, locale, yardSqft]);

  const monthlyTotal = useMemo(() => {
    const visitsPerMonth = getMonthlyVisits(frequency);
    return Math.round(pricingDetails.perVisit * visitsPerMonth * 100) / 100;
  }, [frequency, pricingDetails.perVisit]);

  useEffect(() => {
    const duration = 350;
    const start = displayPrice;
    const end = pricingDetails.perVisit;
    const startTime = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = start + (end - start) * eased;
      setDisplayPrice(value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pricingDetails.perVisit]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("animate-in");
      });
    }, { threshold: 0.1, rootMargin: "50px" });

    document.querySelectorAll(".scroll-animation").forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const handlePostalCodeCheck = () => {
    const normalized = normalizePostalCode(postalCode);

    if (!isCanadianPostalCode(normalized)) {
      setPostalStatus("invalid");
      setBookingStatus("idle");
      setBookingMessage("");
      return;
    }

    if (!isRegularServicePostalCode(normalized)) {
      setPostalStatus("invalid");
      setBookingStatus("idle");
      setBookingMessage("");
      return;
    }

    if (!consentChecked) {
      setConsentError(
        isFrench
          ? "Veuillez accepter les conditions et la politique de confidentialité pour continuer."
          : "Please agree to the Terms and Privacy Policy to continue.",
      );
      setPostalStatus("idle");
      return;
    }

    setConsentError("");
    setPostalStatus("valid");
  };

  const handleBookingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!consentChecked) {
      setConsentError(
        isFrench
          ? "Veuillez accepter les conditions et la politique de confidentialité avant l'envoi."
          : "Please agree to the Terms and Privacy Policy before submitting.",
      );
      return;
    }

    if (!isCanadianPostalCode(postalCode) || !isRegularServicePostalCode(postalCode)) {
      setPostalStatus("invalid");
      setBookingStatus("idle");
      setBookingMessage("");
      return;
    }

    setBookingStatus("loading");
    setBookingMessage("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          postalCode: normalizePostalCode(postalCode),
          consent: true,
          website: websiteField,
          source: "home-calculator",
          locale,
          frequency,
          dogs,
          yardSqft,
          price: pricingDetails.perVisit,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || (isFrench ? "Échec de l'envoi de la confirmation." : "Failed to send confirmation."),
        );
      }

      setPostalCode("");
      setName("");
      setPhone("");
      setEmail("");
      setConsentChecked(false);
      setConsentError("");
      setPostalStatus("idle");
      setWebsiteField("");
      router.push(`/thank-you?lang=${locale}&type=quote`);
    } catch (err: any) {
      setBookingStatus("error");
      setBookingMessage(
        err?.message || (isFrench ? "Une erreur s'est produite. Veuillez réessayer." : "Something went wrong. Please try again."),
      );
    }
  };

  const heroBullets = isFrench
    ? [
        "Service ponctuel ou récurrent",
        "Tarification claire selon la fréquence, les chiens et la taille du terrain",
        "Confirmation rapide dans les villes desservies",
      ]
    : [
        "One-time or recurring cleanup service",
        "Clear pricing based on frequency, dog count, and yard size",
        "Fast confirmation across the served locations",
      ];

  const howItWorksCopy = isFrench
    ? {
        title: "Comment ça fonctionne",
        subtitle: location.regularFitFr,
        steps: [
          { icon: ClipboardCheck, title: "Demander un devis", desc: "Indiquez la fréquence, la taille de la cour, le nombre de chiens et votre code postal." },
          { icon: PawPrint, title: "Choisir l'horaire", desc: "Nous confirmons votre zone de service et validons la meilleure fréquence pour votre cour." },
          { icon: Smartphone, title: "On garde la cour propre", desc: "Une fois réservé, le service suit la fréquence choisie pour éviter l'accumulation." },
        ],
      }
    : {
        title: "How it works",
        subtitle: location.regularFitEn,
        steps: [
          { icon: ClipboardCheck, title: "Request a quote", desc: "Tell us the frequency, yard size, dog count, and your postal code." },
          { icon: PawPrint, title: "Choose the schedule", desc: "We confirm your service area and lock in the best frequency for your yard." },
          { icon: Smartphone, title: "We keep the yard clean", desc: "Once booked, the service follows the selected schedule to prevent buildup." },
        ],
      };

  const whyBookCopy = isFrench
    ? {
        title: "Pourquoi réserver le service régulier",
        subtitle: location.regularTimingFr,
        items: [
          { icon: Heart, title: "Moins de corvées", desc: "Le service régulier enlève une tâche sale de votre semaine." },
          { icon: Camera, title: "Confirmation après la visite", desc: "Nous envoyons une confirmation après chaque passage." },
          { icon: Bell, title: "Fréquence flexible", desc: "Choisissez une visite hebdomadaire, aux deux semaines, mensuelle ou ponctuelle." },
        ],
      }
    : {
        title: "Why book recurring service",
        subtitle: location.regularTimingEn,
        items: [
          { icon: Heart, title: "Less hassle every week", desc: "Recurring cleanup takes one messy job off your schedule." },
          { icon: Camera, title: "Visit confirmation", desc: "We send a confirmation after each completed visit." },
          { icon: Bell, title: "Flexible frequency", desc: "Choose weekly, biweekly, monthly, or one-time cleanup based on your yard." },
        ],
      };

  const faqItems = isFrench
    ? [
        { q: `Offrez-vous le service régulier à ${locationName}?`, a: `Oui. Nous acceptons maintenant le service régulier dans ${locationName} lorsque le code postal se trouve dans la zone desservie.` },
        { q: "Puis-je choisir une fréquence différente?", a: "Oui. Vous pouvez demander un service hebdomadaire, aux deux semaines, mensuel ou ponctuel selon vos besoins." },
        { q: "Dois-je être sur place?", a: "Non. Si nous avons accès au portail, nous pouvons faire la visite et confirmer ensuite." },
        { q: "Comment confirmez-vous la zone desservie?", a: "Chaque demande est validée avec le code postal avant la réservation afin de confirmer la disponibilité." },
      ]
    : [
        { q: `Do you offer regular service in ${locationName}?`, a: `Yes. We now accept recurring dog poop cleanup requests in ${locationName} when the postal code is inside the served area.` },
        { q: "Can I choose a different frequency?", a: "Yes. You can request weekly, biweekly, monthly, or one-time cleanup depending on your yard and budget." },
        { q: "Do I need to be home?", a: "No. As long as we have gate access, we can complete the visit and confirm afterward." },
        { q: "How do you confirm the service area?", a: "Every request is checked by postal code before booking so availability is confirmed first." },
      ];

  const copy = {
    languageLink: isFrench ? "English" : "Français",
    pricingNav: isFrench ? "Tarifs" : "Pricing",
    faqNav: "FAQ",
    contactNav: isFrench ? "Contact" : "Contact",
    cta: isFrench ? "Vérifier ma disponibilité" : "Check Availability",
    heroEyebrow: `${locationName}, QC`,
    heroTitle: isFrench ? "RAMASSAGE DE DÉJECTIONS CANINES" : "DOG POOP CLEANUP",
    heroSubtitle: isFrench ? location.regularIntroFr : location.regularIntroEn,
    howItWorks: howItWorksCopy,
    pricingTitle: isFrench ? "Calculateur de prix" : "Pricing Calculator",
    pricingSubtitle: isFrench
      ? "Entrez vos détails, voyez votre prix estimé et demandez un service régulier dans votre secteur."
      : "Enter your details, see your estimated price, and request recurring service in your area.",
    faqTitle: isFrench ? "Questions fréquentes" : "Frequently asked questions",
    faqSubtitle: isFrench
      ? "Réponses sur la fréquence, la tarification et la zone desservie."
      : "Answers about frequency, pricing, and the served area.",
    validPostal: isFrench
      ? "Nous desservons ce code postal. Passez à l'étape 2."
      : "We service that postal code. Continue to step 2.",
    invalidPostal: isFrench
      ? "Désolé, ce code postal est hors de notre zone de service régulière."
      : "Sorry, that postal code is outside our regular service area.",
    invalidCanadian: isFrench
      ? "Veuillez entrer un code postal canadien valide."
      : "Please enter a valid Canadian postal code.",
    consent: isFrench
      ? "J'accepte les conditions et la politique de confidentialité et j'autorise Ca-Ca Canin à me contacter au sujet de ma demande de devis."
      : "I agree to the Terms and Privacy Policy and allow Ca-Ca Canin to contact me about my quote request.",
    note: isFrench
      ? "Le prix dépend de la fréquence, de la taille de la cour et du nombre de chiens. Le prix final est confirmé après vérification."
      : "Pricing depends on frequency, yard size, and dog count. Final pricing is confirmed after review.",
    estimate: isFrench ? "Estimation du service" : "Service estimate",
    thankYou: isFrench ? "Votre demande de devis est envoyée." : "Your quote request is in.",
    thankYouBody: isFrench
      ? "Nous avons bien reçu votre demande et nous vous contacterons sous peu. Inutile de renvoyer le formulaire."
      : "We received your request and will follow up shortly. No need to send the form again.",
    thankYouFoot: isFrench ? "Vous ne l'avez pas reçu? Vérifiez vos courriels indésirables." : "Didn't receive it? Check your junk folder.",
    submit: isFrench ? "Demander mon devis" : "Request My Quote",
    sending: isFrench ? "Envoi..." : "Sending...",
    replyTime: isFrench ? "Nous répondons habituellement en 1 jour ouvrable." : "We usually reply within 1 business day.",
    relatedTitle: isFrench ? "Autres villes desservies" : "Other served locations",
    relatedIntro: isFrench ? "Consultez aussi les autres pages locales du service régulier." : "Browse the other local recurring-service pages as well.",
  };

  const breadcrumbItems = [
    {
      name: isFrench ? "Accueil" : "Home",
      url: `https://cacacanin.com${homeHref}`,
    },
    {
      name: isFrench ? "Service régulier" : "Regular service",
      url: `https://cacacanin.com${baseHref}`,
    },
    {
      name: locationName,
      url: `https://cacacanin.com${baseHref}/${location.slug}`,
    },
  ];

  return (
    <div lang={isFrench ? "fr" : "en"} className={`flex min-h-screen flex-col bg-white text-gray-900 ${montserrat.className}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        {isFrench ? "Passer au contenu" : "Skip to content"}
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href={homeHref} className="flex min-w-0 items-center space-x-3">
              <Image src="/images/cacacaninlogo.jpg" alt={isFrench ? "Logo Ca-Ca Canin" : "Ca-Ca Canin logo"} width={40} height={40} className="h-10 w-10" />
              <span className={`text-lg font-bold text-brand-green sm:text-2xl ${montserrat.className}`}>CA-CA CANIN</span>
            </Link>

            <div className="hidden items-center space-x-6 md:flex">
              <LocationSwitcher locale={locale} currentSlug={location.slug} basePath={baseHref} />
              <Link href="#how-it-works" className="text-gray-700 transition-colors hover:text-brand-green">{copy.howItWorks.title}</Link>
              <Link href="#quote-form" className="text-gray-700 transition-colors hover:text-brand-green">{copy.pricingNav}</Link>
              <Link href="#faq" className="text-gray-700 transition-colors hover:text-brand-green">{copy.faqNav}</Link>
              <Link href={isFrench ? "/fr/contact" : "/contact"} className="text-gray-700 transition-colors hover:text-brand-green">{copy.contactNav}</Link>
              <Link href={altHref} className="text-brand-brown transition-colors hover:text-brand-brown/80">{copy.languageLink}</Link>
              <Button size="lg" className="bg-brand-green text-white hover:bg-brand-green-dark" asChild>
                <Link href="#quote-form">{copy.cta}</Link>
              </Button>
            </div>

            <button
              className="rounded-lg p-3 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isFrench ? "Basculer le menu de navigation" : "Toggle navigation menu"}
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className="space-y-2 border-t border-gray-200 py-4 md:hidden">
              <LocationSwitcher locale={locale} currentSlug={location.slug} basePath={baseHref} mobile />
              <Link href="#how-it-works" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">{copy.howItWorks.title}</Link>
              <Link href="#quote-form" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">{copy.pricingNav}</Link>
              <Link href="#faq" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">{copy.faqNav}</Link>
              <Link href={isFrench ? "/fr/contact" : "/contact"} className="block rounded-md py-2 text-gray-700 hover:text-brand-green">{copy.contactNav}</Link>
              <Link href={altHref} className="block rounded-md py-2 text-brand-brown hover:text-brand-brown/80">{copy.languageLink}</Link>
            </div>
          )}
        </nav>
      </header>

      <main id="main-content" className="flex-grow pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Service",
                  name: isFrench ? `Ramassage de déjections canines à ${locationName}` : `Dog poop cleanup in ${locationName}`,
                  serviceType: isFrench ? "Ramassage de déjections canines" : "Dog poop cleanup",
                  provider: {
                    "@type": "LocalBusiness",
                    name: "Ca-Ca Canin",
                    telephone: "+1-438-880-8922",
                    url: `https://cacacanin.com${baseHref}/${location.slug}`,
                  },
                  areaServed: { "@type": "City", name: locationName },
                },
                {
                  "@type": "FAQPage",
                  mainEntity: faqItems.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: { "@type": "Answer", text: item.a },
                  })),
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: breadcrumbItems.map((item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: item.name,
                    item: item.url,
                  })),
                },
              ],
            }),
          }}
        />

        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <nav aria-label={isFrench ? "Fil d'Ariane" : "Breadcrumb"} className="mb-6">
              <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
                <li>
                  <Link href={homeHref} className="hover:text-brand-green">
                    {isFrench ? "Accueil" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={baseHref} className="hover:text-brand-green">
                    {isFrench ? "Service régulier" : "Regular service"}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-gray-700">{locationName}</li>
              </ol>
            </nav>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-brown">{copy.heroEyebrow}</p>
            <h1 className={`mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-6xl ${montserrat.className}`}>
              {copy.heroTitle}
            </h1>
            <p className="mb-4 text-lg text-gray-600 sm:text-xl md:text-2xl">{copy.heroSubtitle}</p>
            <p className="mx-auto mb-6 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
              {isFrench ? location.regularFitFr : location.regularFitEn}
            </p>
            <div className="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center">
              <Button size="lg" className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#quote-form">{isFrench ? "Demander mon devis" : "Request My Quote"}</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-6 py-4 text-base text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#how-it-works">{copy.howItWorks.title}</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm font-semibold text-brand-green">{isFrench ? location.regularTimingFr : location.regularTimingEn}</p>
            <ul className="mx-auto mt-8 grid max-w-2xl gap-3 text-left text-gray-700">
              {heroBullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-green" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="quote-form" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <RegularServiceCalculator locale={locale} />
          </div>
        </section>

        <section id="how-it-works" className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center scroll-animation">
              <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>{copy.howItWorks.title}</h2>
              <p className="text-lg text-gray-600">{copy.howItWorks.subtitle}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {copy.howItWorks.steps.map((step) => (
                <Card key={step.title} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                      <step.icon className="h-6 w-6 text-brand-green" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">{step.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center scroll-animation">
              <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>{whyBookCopy.title}</h2>
              <p className="text-lg text-gray-600">{whyBookCopy.subtitle}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {whyBookCopy.items.map((item) => (
                <Card key={item.title} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                      <item.icon className="h-6 w-6 text-brand-green" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">{item.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center scroll-animation">
              <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>{copy.faqTitle}</h2>
              <p className="text-lg text-gray-600">{copy.faqSubtitle}</p>
            </div>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <Card key={item.q} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                  <CardHeader>
                    <CardTitle className="text-xl">{item.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-8 text-gray-600">{item.a}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center scroll-animation">
              <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>{copy.relatedTitle}</h2>
              <p className="text-lg text-gray-600">{copy.relatedIntro}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {REGULAR_SERVICE_LOCATIONS.filter((item) => item.slug !== location.slug).map((item) => (
                <Link
                  key={item.slug}
                  href={`${baseHref}/${item.slug}`}
                  className="scroll-animation rounded-3xl border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(17,24,39,0.05)] transition-all hover:-translate-y-1 hover:border-brand-green/40"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">{isFrench ? item.nameFr : item.name}</p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900">{isFrench ? item.regularPrimaryKeywordFr : item.regularPrimaryKeywordEn}</h3>
                  <p className="mt-3 text-gray-600">{isFrench ? item.regularIntroFr : item.regularIntroEn}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
