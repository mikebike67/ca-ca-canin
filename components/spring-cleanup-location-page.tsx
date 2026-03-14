'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Heart,
  MapPin,
  PawPrint,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SiteFooter from "@/components/site-footer";
import type { SpringCleanupLocation } from "@/lib/spring-cleanup-service-area";
import { SPRING_CLEANUP_LOCATIONS, isSpringCleanupPostalCode } from "@/lib/spring-cleanup-service-area";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
});

const basePricing: Record<"weekly" | "biweekly" | "monthly" | "onetime", Record<"1" | "2" | "3plus", number>> = {
  weekly: { "1": 20, "2": 25, "3plus": 30 },
  biweekly: { "1": 30, "2": 35, "3plus": 40 },
  monthly: { "1": 50, "2": 55, "3plus": 60 },
  onetime: { "1": 60, "2": 60, "3plus": 60 },
};

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
    weekly: "Best for ongoing cleanup after the initial reset.",
    biweekly: "A practical balance of upkeep and cost.",
    monthly: "A lighter maintenance option.",
    onetime: "One-time spring cleanup visit.",
  },
  fr: {
    weekly: "Idéal pour garder la cour propre après le grand nettoyage.",
    biweekly: "Un bon équilibre entre entretien et coût.",
    monthly: "Une option d'entretien plus léger.",
    onetime: "Visite ponctuelle de nettoyage de printemps.",
  },
} as const;

const formatMoney = (value: number) => `$${value.toFixed(2)}`;
const normalizePostalCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");
const isCanadianPostalCode = (value: string) => /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalizePostalCode(value));

type SpringCleanupLocationPageProps = {
  locale: "en" | "fr";
  location: SpringCleanupLocation;
};

export default function SpringCleanupLocationPage({
  locale,
  location,
}: SpringCleanupLocationPageProps) {
  const isFrench = locale === "fr";
  const locationName = isFrench ? location.nameFr : location.name;
  const homeHref = isFrench ? "/fr" : "/";
  const baseHref = isFrench ? "/fr/nettoyage-printemps" : "/spring-cleanup";
  const altHref = isFrench ? `/spring-cleanup/${location.slug}` : `/fr/nettoyage-printemps/${location.slug}`;
  const legalHref = isFrench ? "/fr/terms" : "/terms";
  const privacyHref = isFrench ? "/fr/privacy" : "/privacy";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dogs, setDogs] = useState<"1" | "2" | "3plus">("1");
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
  const quoteThankYouRef = useRef<HTMLDivElement | null>(null);

  const yardCategory = useMemo<"small" | "medium" | "large" | "xlarge">(() => {
    if (yardSqft <= 3000) return "small";
    if (yardSqft <= 6000) return "medium";
    if (yardSqft < 10000) return "large";
    return "xlarge";
  }, [yardSqft]);

  const pricingDetails = useMemo(() => {
    const base = basePricing.onetime[dogs];
    return {
      perVisit: base,
      note: frequencyNotes[locale].onetime,
    };
  }, [dogs, locale]);

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
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "50px",
    });

    document.querySelectorAll(".scroll-animation").forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (bookingStatus !== "success" || !quoteThankYouRef.current) return;

    requestAnimationFrame(() => {
      quoteThankYouRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      quoteThankYouRef.current?.focus();
    });
  }, [bookingStatus]);

  const handlePostalCodeCheck = () => {
    const normalized = normalizePostalCode(postalCode);

    if (!isCanadianPostalCode(normalized) || !isSpringCleanupPostalCode(normalized)) {
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

    if (!isCanadianPostalCode(postalCode) || !isSpringCleanupPostalCode(postalCode)) {
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
          source: "spring-cleanup",
          locale,
          frequency: "onetime",
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

      setBookingStatus("success");
      setBookingMessage(
        isFrench
          ? "Courriel de confirmation envoyé! Nous vous contacterons sous peu."
          : "Confirmation email sent! We will follow up shortly.",
      );
      setPostalCode("");
      setName("");
      setPhone("");
      setEmail("");
      setConsentChecked(false);
      setConsentError("");
      setPostalStatus("idle");
      setWebsiteField("");
    } catch (err: any) {
      setBookingStatus("error");
      setBookingMessage(
        err?.message || (isFrench ? "Une erreur s'est produite. Veuillez réessayer." : "Something went wrong. Please try again."),
      );
    }
  };

  const heroBullets = isFrench
    ? [
        "Enleve l'accumulation de dejections de l'hiver",
        "Visite ponctuelle avec tarification claire selon le temps",
        "Disponibilite confirmee avant la reservation",
      ]
    : [
        "Clears winter dog waste buildup",
        "One-time visit with clear time-based pricing",
        "Availability confirmed before booking",
      ];

  const howItWorksCopy = isFrench
    ? {
        title: "Comment ça fonctionne",
        subtitle: location.fitFr,
        steps: [
          { icon: ClipboardCheck, title: "Demander un devis", desc: "Indiquez la taille de la cour, le nombre de chiens et votre code postal." },
          { icon: PawPrint, title: "Confirmer la visite", desc: "Nous validons les détails et planifions le nettoyage selon la disponibilité printanière." },
          { icon: Sparkles, title: "On nettoie la cour", desc: "Nous enlevons l'accumulation et laissons l'espace plus propre et prêt à être réutilisé." },
        ],
      }
    : {
        title: "How it works",
        subtitle: location.fitEn,
        steps: [
          { icon: ClipboardCheck, title: "Request a quote", desc: "Tell us your yard size, dog count, and postal code." },
          { icon: PawPrint, title: "Confirm your visit", desc: "We review the details and schedule your cleanup around spring availability." },
          { icon: Sparkles, title: "We clean the yard", desc: "We remove winter buildup and leave the space cleaner and easier to use again." },
        ],
      };

  const testimonialsCopy = isFrench
    ? {
        title: "Témoignages",
        subtitle: "Avis de clients Ca-Ca Canin.",
      }
    : {
        title: "Testimonials",
        subtitle: "Reviews from Ca-Ca Canin customers.",
      };

  const whyBookCopy = isFrench
    ? {
        title: "Pourquoi réserver votre nettoyage printanier",
        subtitle: location.timingFr,
        items: [
          { icon: Heart, title: "Cour plus propre, moins de tracas", desc: "Une visite concentrée pour remettre la cour en ordre après l'hiver." },
          { icon: Camera, title: "Confirmation de visite", desc: "Nous envoyons une confirmation une fois le nettoyage terminé." },
          { icon: ClipboardCheck, title: "Tarification claire", desc: "Le nettoyage de printemps commence à 60 $ pour les 30 premières minutes, puis 5 $ par tranche additionnelle de 5 minutes." },
        ],
      }
    : {
        title: "Why book your spring cleanup",
        subtitle: location.timingEn,
        items: [
          { icon: Heart, title: "Cleaner yard, less hassle", desc: "A focused visit to get the yard back into shape after winter." },
          { icon: Camera, title: "Visit confirmation", desc: "We send confirmation once the cleanup is complete." },
          { icon: ClipboardCheck, title: "Clear time-based pricing", desc: "Spring cleanup starts at $60 for the first 30 minutes, then $5 per additional 5 minutes." },
        ],
      };

  const faqItems = isFrench
    ? [
        {
          q: "Que comprend le nettoyage printanier?",
          a: "Un nettoyage complet de la cour pour enlever l'accumulation de l'hiver et rendre l'espace plus utilisable.",
        },
        {
          q: "Comment confirmez-vous la disponibilite?",
          a: "Nous validons chaque demande par code postal avant la reservation afin de confirmer que l'adresse se trouve bien dans la zone de nettoyage printanier.",
        },
        {
          q: "Dois-je être sur place?",
          a: "Non. Si nous avons accès au portail, nous pouvons faire le nettoyage et envoyer une confirmation après la visite.",
        },
        {
          q: "À quelle vitesse puis-je réserver?",
          a: "Les places de printemps sont limitées et nous confirmons généralement les demandes en 1 jour ouvrable.",
        },
      ]
    : [
        {
          q: "What is included in spring cleanup?",
          a: "A full yard sweep to remove winter buildup and leave the property cleaner and ready to use.",
        },
        {
          q: "How do you confirm availability?",
          a: "We validate each request by postal code before booking so the address is confirmed inside the spring cleanup service area.",
        },
        {
          q: "Do I need to be home?",
          a: "No. If we have access to the gate, we can complete the cleanup and send confirmation after the visit.",
        },
        {
          q: "How fast can I book?",
          a: "Spring spots are limited, and we typically confirm requests within 1 business day.",
        },
      ];

  const copy = {
    languageLink: isFrench ? "English" : "Français",
    pricingNav: isFrench ? "Tarifs" : "Pricing",
    faqNav: "FAQ",
    contactNav: isFrench ? "Contact" : "Contact",
    cta: isFrench ? "Obtenir un devis gratuit" : "Get a Free Quote",
    heroEyebrow: `${locationName}, QC`,
    heroTitle: isFrench
      ? "NETTOYAGE PRINTANIER DES DÉJECTIONS CANINES"
      : "SPRING DOG POOP CLEANUP",
    heroSubtitle: isFrench ? location.introFr : location.introEn,
    howItWorks: howItWorksCopy,
    testimonials: testimonialsCopy,
    pricingTitle: isFrench ? "Calculateur de prix" : "Spring Cleanup Pricing Calculator",
    pricingSubtitle: isFrench
      ? "Estimez le prix d'un nettoyage ponctuel avec une tarification claire selon le temps et une confirmation rapide des disponibilites."
      : "Estimate the price of a one-time cleanup with clear time-based pricing and a fast availability check.",
    serviceAreaTitle: isFrench ? "Zone de service" : "Service area",
    serviceAreaSubtitle: isFrench
      ? "Consultez cette page locale puis explorez les autres villes desservies pour le nettoyage printanier."
      : "Browse this local page, then explore the other served towns for spring cleanup service.",
    faqTitle: isFrench ? "FAQ du nettoyage de printemps" : "Spring Cleanup FAQs",
    faqSubtitle: isFrench
      ? "Reponses sur le nettoyage ponctuel, la tarification et la reservation printaniere."
      : "Answers about one-time cleanup, pricing, and spring booking.",
    validPostal: isFrench
      ? "Nous desservons ce code postal. Passez à l'étape 2."
      : "We service that postal code. Continue to step 2.",
    invalidPostal: isFrench
      ? "Désolé, ce code postal est hors de notre zone de service pour le nettoyage de printemps."
      : "Sorry, that postal code is outside our spring cleanup service area.",
    invalidCanadian: isFrench
      ? "Veuillez entrer un code postal canadien valide."
      : "Please enter a valid Canadian postal code.",
    consent: isFrench
      ? "J'accepte les conditions et la politique de confidentialité et j'autorise Ca-Ca Canin à me contacter au sujet de ma demande de devis."
      : "I agree to the Terms and Privacy Policy and allow Ca-Ca Canin to contact me about my quote request.",
    note: isFrench
      ? "Le prix dépend de la taille de la cour et du nombre de chiens. Demandez un devis gratuit pour le prix final."
      : "Pricing depends on yard size and number of dogs. Request a free quote for final pricing.",
    estimate: isFrench ? "Estimation du nettoyage de printemps" : "Spring Cleanup Estimate",
    thankYou: isFrench ? "Votre demande de nettoyage de printemps est envoyée." : "Your spring cleanup request is in.",
    thankYouBody: isFrench
      ? "Nous avons bien reçu votre demande et nous vous contacterons sous peu. Inutile de renvoyer le formulaire."
      : "We received your request and will follow up shortly. No need to send the form again.",
    thankYouFoot: isFrench
      ? "Vous ne l'avez pas reçu? Vérifiez vos courriels indésirables."
      : "Didn't receive it? Check your junk folder.",
    submit: isFrench ? "Demander mon devis de printemps" : "Request My Spring Quote",
    sending: isFrench ? "Envoi..." : "Sending...",
    replyTime: isFrench ? "Nous répondons habituellement en 1 jour ouvrable." : "We usually reply within 1 business day.",
    areaCardTitle: locationName,
    areaCardNote: isFrench ? "Page locale actuelle" : "Current local page",
    relatedTitle: isFrench ? "Autres villes desservies" : "Other served locations",
    relatedIntro: isFrench
      ? "Cliquez sur une carte pour consulter la page locale d'une autre ville."
      : "Click any card to open another local service page.",
  };

  return (
    <div lang={isFrench ? "fr" : "en"} className={`flex flex-col min-h-screen bg-white text-gray-900 ${montserrat.className}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        {isFrench ? "Passer au contenu" : "Skip to content"}
      </a>
      <style jsx global>{`
        html { scroll-behavior: smooth; scroll-padding-top: 1.5rem; }
        main[id], main [id] { scroll-margin-top: 1.5rem; }
        :root {
          --brand-green: #307944;
          --brand-green-dark: #307944;
          --brand-brown: #724420;
        }
        .scroll-animation {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .scroll-animation.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label={isFrench ? "Principal" : "Primary"}>
          <div className="flex h-16 items-center justify-between">
            <Link href={homeHref} className="flex min-w-0 items-center space-x-3">
              <Image src="/images/cacacaninlogo.jpg" alt={isFrench ? "Logo Ca-Ca Canin" : "Ca-Ca Canin logo"} width={40} height={40} className="h-10 w-10" />
              <span className={`text-lg font-bold text-brand-green sm:text-2xl ${montserrat.className}`}>CA-CA CANIN</span>
            </Link>

            <div className="hidden items-center space-x-8 md:flex">
              <Link href="#how-it-works" className="text-gray-700 hover:text-brand-green transition-colors">{copy.howItWorks.title}</Link>
              <Link href="#quote-form" className="text-gray-700 hover:text-brand-green transition-colors">{copy.pricingNav}</Link>
              <Link href="#faq" className="text-gray-700 hover:text-brand-green transition-colors">{copy.faqNav}</Link>
              <Link href={isFrench ? "/fr/contact" : "/contact"} className="text-gray-700 hover:text-brand-green transition-colors">{copy.contactNav}</Link>
              <Link href={altHref} className="text-brand-brown hover:text-brand-brown/80 transition-colors">{copy.languageLink}</Link>
              <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link href="#quote-form">{copy.cta}</Link>
              </Button>
            </div>

            <button
              className="rounded-lg p-3 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isFrench ? "Basculer le menu de navigation" : "Toggle navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div id="mobile-nav" className="space-y-2 border-t border-gray-200 py-4 md:hidden">
              <Link href="#how-it-works" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">{copy.howItWorks.title}</Link>
              <Link href="#quote-form" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">{copy.pricingNav}</Link>
              <Link href="#faq" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">{copy.faqNav}</Link>
              <Link href={isFrench ? "/fr/contact" : "/contact"} className="block rounded-md py-2 text-gray-700 hover:text-brand-green">{copy.contactNav}</Link>
              <Link href={altHref} className="block rounded-md py-2 text-brand-brown hover:text-brand-brown/80">{copy.languageLink}</Link>
              <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link href="#quote-form">{copy.cta}</Link>
              </Button>
            </div>
          )}
        </nav>
      </header>

      <main id="main-content" className="flex-grow scroll-mt-12 pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Service",
                  name: isFrench
                    ? `Nettoyage printanier des dejections canines a ${locationName}`
                    : `Spring dog poop cleanup in ${locationName}`,
                  serviceType: isFrench
                    ? "Nettoyage printanier des dejections canines"
                    : "Spring dog poop cleanup",
                  provider: {
                    "@type": "LocalBusiness",
                    name: "Ca-Ca Canin",
                    telephone: "+1-438-880-8922",
                    url: `https://cacacanin.com${baseHref}/${location.slug}`,
                  },
                  areaServed: {
                    "@type": "City",
                    name: locationName,
                  },
                },
                {
                  "@type": "FAQPage",
                  mainEntity: faqItems.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: { "@type": "Answer", text: item.a },
                  })),
                }
              ]
            }),
          }}
        />

        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-brown">
              {copy.heroEyebrow}
            </p>
            <h1 className={`mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-6xl ${montserrat.className}`}>
              {copy.heroTitle}
            </h1>
            <p className="mb-4 text-lg text-gray-600 sm:text-xl md:text-2xl">{copy.heroSubtitle}</p>
            <p className="mx-auto mb-6 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">{isFrench ? location.fitFr : location.fitEn}</p>
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Button size="lg" className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#quote-form">{isFrench ? "Obtenir mon devis de printemps" : "Get My Spring Quote"}</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-6 py-4 text-base text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#how-it-works">{copy.howItWorks.title}</Link>
              </Button>
            </div>
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

        <section id="how-it-works" className="scroll-mt-12 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
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
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center scroll-animation">
              <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>{copy.testimonials.title}</h2>
              <p className="text-lg text-gray-600">
                {isFrench
                  ? "Avis de proprietaires qui voulaient remettre leur cour en ordre rapidement apres l'hiver."
                  : "Reviews from homeowners who wanted the yard reset quickly after winter."}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    {isFrench ? "Avis 5 etoiles" : "5-star review"}
                  </div>
                  <CardTitle className="text-xl">Zander M.</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-8 text-gray-600">
                    Wanted to share my experience with Micheal from Ca-Ca Canin, very professional, he came over to asses our lawn , which let me tell you was a doozy and a half to say the least , old tenants left garbage in thw yard the grass was almost 4 feet tall with random shrubs and over growth literally everywhere , yoy couldn&apos;t see the ground, they hadn&apos;t cleaned the yard in years there dog made basically a layer of poop , Micheal came out and meticulously lifted everything and got most of turd mines . For 80$ I couldn&apos;t have spent my money more wisely , I recommend Micheal to everyone who owns a dog and needs some help with their yard . KEEP IT UP MAN 💪💯
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    {isFrench ? "Recommandation Facebook" : "Facebook recommendation"}
                  </div>
                  <CardTitle className="text-xl">Julie B.</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-8 text-gray-600">
                    Excellent service provided by Michael Atallah. He shows up on time, professional and courteous. Very thorough inspection of the back lawn and pickup of our dog&apos;s poop.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    {isFrench ? "Avis 5 etoiles" : "5-star review"}
                  </div>
                  <CardTitle className="text-xl">Daniella H.</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-8 text-gray-600">
                    Michael is fantastic! Super professional, clean, and his customer service is 100%. We hired Michael to clean our yard after a long winter and would do so again in a heartbeat! He offers a great service at a great price. Truly can&apos;t recommend him enough!
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="quote-form" className="scroll-mt-12 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl scroll-animation">
            <div className="mb-8 text-center">
              <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>{copy.pricingTitle}</h2>
              <p className="text-lg text-gray-600">{copy.pricingSubtitle}</p>
            </div>

            <div className="rounded-2xl border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(17,24,39,0.05)] md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 md:col-span-1">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-700">{isFrench ? "Fréquence" : "Frequency"}</p>
                    <div className="rounded-lg border border-brand-green bg-brand-green px-3 py-2 text-sm font-semibold text-white shadow-md">
                      {isFrench ? "Nettoyage de printemps ponctuel" : "One-Time Spring Cleanup"}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-700">{isFrench ? "Nombre de chiens" : "Number of Dogs"}</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: "1", label: isFrench ? "1 chien" : "1 Dog" },
                        { key: "2", label: isFrench ? "2 chiens" : "2 Dogs" },
                        { key: "3plus", label: isFrench ? "3+ chiens" : "3+ Dogs" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setDogs(item.key as typeof dogs)}
                          className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition sm:flex-none ${
                            dogs === item.key
                              ? "border-brand-green bg-brand-green text-white shadow-md"
                              : "border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="yard-size" className="mb-2 block text-sm font-semibold text-gray-700">
                      {isFrench ? "Taille de la cour (pi²)" : "Yard Size (sq ft)"}
                    </label>
                    <div className="space-y-2">
                      <input
                        id="yard-size"
                        type="range"
                        min={3000}
                        max={10000}
                        step={100}
                        value={yardSqft}
                        onChange={(e) => setYardSqft(Math.max(3000, Math.min(10000, Math.round(Number(e.target.value) / 100) * 100)))}
                        className="w-full accent-brand-green"
                        required
                      />
                      <div className="flex flex-col gap-2 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-semibold text-brand-green">
                          {yardSqft >= 10000
                            ? isFrench ? "10 000+ pi²" : "10,000+ sq ft"
                            : isFrench ? `${yardSqft.toLocaleString()} pi²` : `${yardSqft.toLocaleString()} sq ft`}
                        </span>
                        <span className="inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-3 py-1 text-xs font-semibold text-brand-green">
                          {yardOptions[locale].find((o) => o.key === yardCategory)?.label} · {yardOptions[locale].find((o) => o.key === yardCategory)?.detail}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:col-span-2">
                  <div className="mx-auto w-full max-w-[26rem] rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-5 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-[0.14em] text-brand-green/80">{copy.estimate}</p>
                    <p className="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">{`${formatMoney(displayPrice)} / ${isFrench ? "premières 30 min" : "first 30 mins"}`}</p>
                    <p className="text-sm text-gray-600">{isFrench ? "+5 $ par bloc additionnel de 5 minutes." : "+$5 per additional 5-minute block."}</p>
                    <p className="mt-3 text-sm font-semibold text-brand-green sm:text-base">{pricingDetails.note}</p>
                  </div>

                  <div className="rounded-2xl border border-[#d7e6da] bg-white p-4 text-sm text-gray-600 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                    {copy.note}
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 rounded-2xl border border-[#d7e6da] bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.05)]">
                    {bookingStatus !== "success" && (
                      <>
                        <div className="hidden" aria-hidden="true">
                          <label htmlFor={`website-field-${locale}-${location.slug}`}>Leave this field empty</label>
                          <input
                            id={`website-field-${locale}-${location.slug}`}
                            type="text"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={websiteField}
                            onChange={(e) => setWebsiteField(e.target.value)}
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white">1</span>
                            {isFrench ? "Vérifier la zone desservie" : "Check service area"}
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="postal-code" className="text-sm font-semibold text-gray-700">{isFrench ? "Code postal" : "Postal code"}</label>
                            <input
                              id="postal-code"
                              type="text"
                              name="postalCode"
                              placeholder={location.fsaPrefixes[0] ? `${location.fsaPrefixes[0]} 1A1` : "J7E 1A1"}
                              value={postalCode}
                              onChange={(e) => {
                                setPostalCode(e.target.value);
                                setPostalStatus("idle");
                                setConsentError("");
                              }}
                              autoComplete="postal-code"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-brand-green"
                              required
                            />
                          </div>
                          <div className="rounded-xl border border-[#d7e6da] bg-[#f7faf7] p-4">
                            <label className="flex items-start gap-3 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={consentChecked}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setConsentChecked(checked);
                                  setConsentError("");
                                  if (!checked) setPostalStatus("idle");
                                }}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                              />
                              <span>
                                {isFrench ? "J'accepte les " : "I agree to the "}
                                <Link href={legalHref} className="font-semibold text-brand-green hover:underline">
                                  {isFrench ? "conditions" : "Terms"}
                                </Link>
                                {isFrench ? " et la " : " and "}
                                <Link href={privacyHref} className="font-semibold text-brand-green hover:underline">
                                  {isFrench ? "politique de confidentialité" : "Privacy Policy"}
                                </Link>
                                {isFrench
                                  ? " et j'autorise Ca-Ca Canin à me contacter au sujet de ma demande de devis."
                                  : " and allow Ca-Ca Canin to contact me about my quote request."}
                              </span>
                            </label>
                            {consentError && <p className="mt-2 text-sm text-red-600">{consentError}</p>}
                          </div>
                          <Button type="button" className="w-full bg-brand-green text-white hover:bg-brand-green-dark" onClick={handlePostalCodeCheck}>
                            {isFrench ? "Vérifier" : "Check availability"}
                          </Button>
                          {postalStatus === "valid" && <div className="text-sm text-brand-green">{copy.validPostal}</div>}
                          {postalStatus === "invalid" && (
                            <div className="text-sm text-red-600">
                              {postalCode && !isCanadianPostalCode(postalCode) ? copy.invalidCanadian : copy.invalidPostal}
                            </div>
                          )}
                        </div>

                        {postalStatus === "valid" && (
                          <>
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                              <div className="space-y-1">
                                <label htmlFor="name" className="text-sm font-semibold text-gray-700">{isFrench ? "Nom" : "Name"}</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" required />
                              </div>
                              <div className="space-y-1">
                                <label htmlFor="phone" className="text-sm font-semibold text-gray-700">{isFrench ? "Téléphone" : "Phone number"}</label>
                                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" required />
                              </div>
                              <div className="space-y-1">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-700">{isFrench ? "Courriel" : "Email"}</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" required />
                              </div>
                            </div>
                            <Button type="submit" className="w-full bg-brand-green hover:bg-brand-green-dark text-white text-lg py-3" disabled={bookingStatus === "loading"}>
                              {bookingStatus === "loading" ? copy.sending : copy.submit}
                            </Button>
                            {bookingMessage && <div className="text-sm text-red-600">{bookingMessage}</div>}
                            <p className="text-xs text-gray-500">{copy.replyTime}</p>
                          </>
                        )}
                      </>
                    )}

                    {bookingStatus === "success" && (
                      <div id={`spring-location-thank-you-${locale}-${location.slug}`} ref={quoteThankYouRef} tabIndex={-1} className="rounded-2xl border border-brand-green/20 bg-[#eef7f0] p-6 text-center shadow-[0_18px_45px_rgba(48,121,68,0.08)] outline-none">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">{isFrench ? "Merci" : "Thank you"}</p>
                        <h3 className="mt-2 text-2xl font-bold text-gray-900">{copy.thankYou}</h3>
                        <p className="mt-3 text-base text-gray-600">{copy.thankYouBody}</p>
                        <p className="mt-2 text-sm text-gray-600">{copy.thankYouFoot}</p>
                        <p className="mt-4 text-sm text-brand-green">{bookingMessage}</p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
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
              {whyBookCopy.items.map((feature) => (
                <Card key={feature.title} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                      <feature.icon className="h-6 w-6 text-brand-green" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">{feature.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center scroll-animation">
              <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>{copy.serviceAreaTitle}</h2>
              <p className="text-lg text-gray-600">{copy.serviceAreaSubtitle}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {SPRING_CLEANUP_LOCATIONS.map((areaLocation) => {
                const areaName = isFrench ? areaLocation.nameFr : areaLocation.name;
                const areaHref = `${baseHref}/${areaLocation.slug}`;
                const isCurrent = areaLocation.slug === location.slug;
                return (
                  <Link key={areaLocation.slug} href={areaHref} className="block h-full">
                    <Card className={`h-full border bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)] ${isCurrent ? "border-2 border-brand-green" : "border-[#d7e6da]"}`}>
                      <CardHeader className="items-center text-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-brand-green/15 bg-[#eef7f0]">
                          <MapPin className="h-7 w-7 text-brand-green" />
                        </div>
                        <CardTitle className="text-xl">{areaName}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-center">
                        <p className="text-sm text-gray-600">
                          {isCurrent ? copy.areaCardNote : copy.relatedIntro}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-12 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center scroll-animation">
              <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>{copy.faqTitle}</h2>
              <p className="text-lg text-gray-600">{copy.faqSubtitle}</p>
            </div>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <Card key={faq.q} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.05)]" style={{ transitionDelay: `${index * 0.05}s` }}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">{faq.a}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
