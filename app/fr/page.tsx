'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { Montserrat } from 'next/font/google'
import { CheckCircle2, Shield, Heart, Bell, Camera, Smartphone, FileText, MapPin, Phone, Mail } from 'lucide-react'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal'],
})

const basePricing: Record<'weekly' | 'biweekly' | 'monthly' | 'onetime', Record<'1' | '2' | '3plus', number>> = {
  weekly: { '1': 20, '2': 25, '3plus': 30 },
  biweekly: { '1': 30, '2': 35, '3plus': 40 },
  monthly: { '1': 50, '2': 55, '3plus': 60 },
  onetime: { '1': 60, '2': 60, '3plus': 60 },
};

const yardModifiers = {
  small: 1,
  medium: 1.12,
  large: 1.24,
  xlarge: 1.36,
};

const yardOptions: { key: 'small' | 'medium' | 'large' | 'xlarge'; label: string; detail: string }[] = [
  { key: 'small', label: 'Standard / Petit', detail: '~1 000-3 000 pi²' },
  { key: 'medium', label: 'Moyen', detail: '~3 000-6 000 pi²' },
  { key: 'large', label: 'Grand', detail: '~6 000-10 000 pi²' },
  { key: 'xlarge', label: 'Très grand', detail: '10 000+ pi²' },
];

const frequencyNotes: Record<'weekly' | 'biweekly' | 'monthly' | 'onetime', string> = {
  weekly: "Le meilleur choix pour garder la cour propre chaque semaine.",
  biweekly: "Un bon équilibre entre prix et entretien.",
  monthly: "Une option simple pour un entretien léger.",
  onetime: "Inclut jusqu'à 30 minutes. Ajoutez 5 $ par tranche supplémentaire de 5 minutes.",
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;
const normalizePostalCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');
const isCanadianPostalCode = (value: string) => /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalizePostalCode(value));
const isLavalPostalCode = (value: string) => normalizePostalCode(value).startsWith('H7');

export default function Page() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'onetime'>('weekly');
  const [dogs, setDogs] = useState<'1' | '2' | '3plus'>('1');
  const [yardSqft, setYardSqft] = useState(3000);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [postalCode, setPostalCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [postalStatus, setPostalStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingMessage, setBookingMessage] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [websiteField, setWebsiteField] = useState('');

  const yardCategory = useMemo<'small' | 'medium' | 'large' | 'xlarge'>(() => {
    if (yardSqft <= 3000) return 'small';
    if (yardSqft <= 6000) return 'medium';
    if (yardSqft < 10000) return 'large';
    return 'xlarge';
  }, [yardSqft]);

  const pricingDetails = useMemo(() => {
    const base = basePricing[frequency][dogs];
    const modifier = yardModifiers[yardCategory];
    const baseWithMod = base * modifier;

    if (frequency === 'onetime') {
      return { perVisit: base, note: frequencyNotes[frequency] };
    }

    const extraSqft = Math.max(0, yardSqft - 3000);
    const increments = Math.floor(extraSqft / 100);
    const midIncrements = Math.min(increments, 20);
    const largeIncrements = Math.max(0, increments - 20);
    const multiplier = Math.pow(1.004, midIncrements) * Math.pow(1.0025, largeIncrements);

    const perVisit = Math.round(baseWithMod * multiplier * 100) / 100;
    return { perVisit, note: frequencyNotes[frequency] };
  }, [dogs, frequency, yardCategory, yardSqft]);

  const monthlyTotal = useMemo(() => {
    const visitsPerMonth =
      frequency === 'weekly' ? 4 :
      frequency === 'biweekly' ? 2 :
      frequency === 'monthly' ? 1 :
      0;

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
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const value = start + (end - start) * eased;
      setDisplayPrice(value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pricingDetails.perVisit]);

  const handleCtaClick = (label: string) => {
    console.log(`[cta] ${label}`);
  };

  const handlePostalCodeCheck = () => {
    const normalized = normalizePostalCode(postalCode);

    if (!isCanadianPostalCode(normalized)) {
      setPostalStatus('invalid');
      setBookingStatus('idle');
      setBookingMessage('');
      return;
    }

    if (!isLavalPostalCode(normalized)) {
      setPostalStatus('invalid');
      setBookingStatus('idle');
      setBookingMessage('');
      return;
    }

    if (!consentChecked) {
      setConsentError("Veuillez accepter les conditions et la politique de confidentialité pour continuer.");
      setPostalStatus('idle');
      return;
    }

    setConsentError('');
    setPostalStatus('valid');
  };

  const handleBookingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consentChecked) {
      setConsentError("Veuillez accepter les conditions et la politique de confidentialité avant l'envoi.");
      return;
    }

    if (!isCanadianPostalCode(postalCode) || !isLavalPostalCode(postalCode)) {
      setPostalStatus('invalid');
      setBookingStatus('idle');
      setBookingMessage('');
      return;
    }

    setBookingStatus('loading');
    setBookingMessage('');

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          consent: true,
          website: websiteField,
          locale: 'fr',
          postalCode: normalizePostalCode(postalCode),
          frequency,
          dogs,
          yardSqft,
          price: pricingDetails.perVisit,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Échec de l'envoi de la confirmation.");
      }

      setBookingStatus('success');
      setBookingMessage('Courriel de confirmation envoyé! Nous vous contacterons sous peu.');
      setPostalCode('');
      setName('');
      setPhone('');
      setEmail('');
      setConsentChecked(false);
      setConsentError('');
      setPostalStatus('idle');
      setWebsiteField('');
    } catch (err: any) {
      setBookingStatus('error');
      setBookingMessage(err?.message || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.scroll-animation').forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div lang="fr" className={`flex flex-col min-h-screen bg-white text-gray-900 ${montserrat.className}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Passer au contenu
      </a>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 1.5rem;
        }

        main[id],
        main [id] {
          scroll-margin-top: 1.5rem;
        }

        :root {
          --brand-green: #307944;
          --brand-green-dark: #307944;
          --brand-green-light: #307944;
          --brand-green-lighter: #307944;
          --brand-brown: #724420;
          --brand-brown-light: #8b5a3c;
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

        .scroll-delay-1 { transition-delay: 0.1s; }
        .scroll-delay-2 { transition-delay: 0.2s; }
        .scroll-delay-3 { transition-delay: 0.3s; }
        .scroll-delay-4 { transition-delay: 0.4s; }

        .brand-green { color: var(--brand-green); }
        .bg-brand-green { background-color: var(--brand-green); }
        .bg-brand-green-dark { background-color: var(--brand-green-dark); }
        .bg-brand-green-light { background-color: var(--brand-green-light); }
        .bg-brand-green-lighter { background-color: var(--brand-green-lighter); }
        .border-brand-green { border-color: var(--brand-green); }
        .hover\\:bg-brand-green-dark:hover { background-color: var(--brand-green-dark); }
        .hover\\:text-brand-green:hover { color: var(--brand-green); }
        .hover\\:border-brand-green:hover { border-color: var(--brand-green); }
        .text-brand-green { color: var(--brand-green); }
        .text-brand-brown { color: var(--brand-brown); }
      `}</style>

      {/* Navigation */}
      {/* RESPONSIVE: keep the sticky header compact and readable on narrow screens without changing the desktop layout. */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Principal">
          <div className="flex items-center justify-between h-16">
            <Link href="/fr" className="flex min-w-0 items-center space-x-3">
              <img 
                src="/images/cacacaninlogo.jpg" 
                alt="Logo Ca-Ca Canin" 
                className="h-10 w-10"
              />
              <span className={`text-lg font-bold text-brand-green sm:text-2xl ${montserrat.className}`}>
                CA-CA CANIN
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#about" className="text-gray-700 hover:text-brand-green transition-colors">À propos</Link>
              <Link href="#faq" className="text-gray-700 hover:text-brand-green transition-colors">FAQ</Link>
              <Link href="/" className="text-brand-brown hover:text-brand-brown/80 transition-colors">English</Link>
              <Button
                size="lg"
                className="bg-brand-green hover:bg-brand-green-dark text-white"
                asChild
              >
                <Link
                  href="#quote-form"
                  data-cta="spring-quote"
                  onClick={() => handleCtaClick("nav-quote")}
                >
                  Obtenir un devis
                </Link>
              </Button>
            </div>

            {/* RESPONSIVE: enlarge the mobile menu trigger to a comfortable 44px touch target. */}
            <button 
              className="md:hidden rounded-lg p-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Basculer le menu de navigation"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* RESPONSIVE: add spacing and tap area so mobile navigation is easy to use on 320px screens. */}
          {isMenuOpen && (
            <div id="mobile-nav" className="space-y-2 border-t border-gray-200 py-4 md:hidden">
              <Link href="#about" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">À propos</Link>
              <Link href="#faq" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">FAQ</Link>
              <Link href="/" className="block rounded-md py-2 text-brand-brown hover:text-brand-brown/80">English</Link>
              <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link
                  href="#quote-form"
                  data-cta="spring-quote"
                  onClick={() => handleCtaClick("mobile-quote")}
                >
                  Obtenir un devis
                </Link>
              </Button>
            </div>
          )}
        </nav>
        {/* RESPONSIVE: keep the announcement bar readable without overpowering the header on small screens. */}
        <Link
          href="/fr/nettoyage-printemps"
          className="block bg-brand-green px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm"
        >
          Nettoyage de printemps à partir de 60 $ →
        </Link>
      </header>

      <main id="main-content" className="flex-grow scroll-mt-12 pt-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Ca-Ca Canin",
              description: "Service de ramassage de déjections canines à Laval, Québec.",
              areaServed: "Laval, QC",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Laval",
                addressRegion: "QC",
                addressCountry: "CA"
              },
              telephone: "438 880 8922",
              email: "cacacaninqc@gmail.com",
              serviceType: "Ramassage de déjections canines",
              priceRange: "$$"
            })
          }}
        />
        {/* Hero Section */}
        {/* RESPONSIVE: reduce hero density on phones while preserving the desktop art/text composition. */}
        <section className="bg-white px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1fr)] lg:gap-10">
              {/* RESPONSIVE: hide the decorative hero image on smaller screens to keep the mobile hero compact and focused on the CTA. */}
              <div className="hidden justify-center lg:flex lg:justify-start">
                <div className="relative w-full max-w-[23rem] overflow-hidden sm:max-w-[30rem] lg:max-w-[38rem]">
                  <div className="absolute inset-x-8 bottom-8 h-12 rounded-full bg-brand-brown/15 blur-3xl sm:inset-x-10 sm:bottom-10 sm:h-14 lg:inset-x-12" />
                  <img
                    src="/images/hero-dog.png"
                    alt="Chien heureux assis dans une cour propre"
                    className="relative z-10 mx-auto h-auto w-full max-w-[21rem] object-contain sm:max-w-[30rem] lg:max-w-[34rem]"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 z-20 h-20 bg-white sm:h-24 lg:h-28"
                    style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }}
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h1 className={`mb-5 text-3xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl ${montserrat.className}`}>
                  Ramassage de déjections<br />
                  <span className="text-brand-green">de déjections canines à Laval</span>
                </h1>
                <p className="mb-8 max-w-3xl text-base text-gray-600 sm:text-xl md:text-2xl lg:max-w-2xl">
                  Un service de ramassage à Laval avec tarifs clairs, horaires flexibles et une cour enfin propre.
                </p>
                {/* RESPONSIVE: keep CTA buttons full-width on phones so they are easy to tap. */}
                <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
                  <Button
                    size="lg"
                    className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                    asChild
                  >
                    <Link
                      href="#quote-form"
                      data-cta="spring-quote"
                      onClick={() => handleCtaClick("hero-quote")}
                    >
                      Obtenir un devis
                    </Link>
                  </Button>
                </div>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-gray-600 sm:flex-row sm:flex-wrap lg:justify-start">
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <CheckCircle2 className="h-4 w-4 text-brand-green" />
                    Aucun contrat
                  </div>
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Camera className="h-4 w-4 text-brand-green" />
                    Photo du portail après chaque visite
                  </div>
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Bell className="h-4 w-4 text-brand-green" />
                    Textos avant l&apos;arrivée
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Promise Section */}
        {/* RESPONSIVE: add breathing room below the hero on mobile so the next section does not feel cramped. */}
        <section className="bg-white px-4 pb-16 pt-8 sm:px-6 sm:pt-0 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900 ${montserrat.className}`}>
                Ce que vous obtenez
              </h2>
            </div>
            {/* RESPONSIVE: cards stay single-column until medium screens to avoid cramped content. */}
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              <Card className="scroll-animation scroll-delay-1 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <CheckCircle2 className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Nettoyage fiable</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Nous passons, nous nettoyons soigneusement, puis nous laissons une cour plus propre sans compliquer votre semaine.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="scroll-animation scroll-delay-2 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Shield className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Service simple à gérer</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Communication claire, planification simple et aucun contrat à long terme. Le service est facile à démarrer et facile à ajuster.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="scroll-animation scroll-delay-3 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Heart className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Approche propre et pensée pour les chiens</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Nous misons sur des pratiques de nettoyage sanitaires pour rendre votre cour plus agréable pour votre famille et votre chien.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* RESPONSIVE: tighten stacked section spacing on mobile to reduce long scroll jumps. */}
            <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="scroll-animation order-2 md:order-1">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900 ${montserrat.className}`}>
                  À propos de Ca-Ca Canin
                </h2>
                {/* RESPONSIVE: render the section image after the heading on mobile while preserving the desktop side-by-side layout. */}
                <img 
                  src="/images/our dog waste renewal company.png" 
                  alt="Équipe Ca-Ca Canin dans une cour résidentielle avec outils de nettoyage et camion de service" 
                  className="mb-6 rounded-lg shadow-lg w-full md:hidden"
                  loading="lazy"
                />
                <p className="text-lg text-gray-700 mb-4">
                  Ca-Ca Canin est une entreprise locale de ramassage de déjections canines qui dessert Laval, Québec. Nous avons créé ce service pour aider les propriétaires de chiens occupés à garder leur cour propre sans ajouter une corvée de plus.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  Notre service résidentiel est conçu pour les propriétaires qui veulent un nettoyage fiable, des tarifs clairs et une planification souple. Que vous ayez besoin d&apos;un passage chaque semaine ou d&apos;une aide occasionnelle, nous visons des résultats constants et une communication directe.
                </p>
                <p className="text-lg text-gray-700">
                  L&apos;objectif est simple. Laisser chaque propriété plus propre et rendre le service facile à faire confiance.
                </p>
              </div>
              <div className="scroll-animation scroll-delay-1 order-1 hidden md:order-2 md:block">
                <img 
                  src="/images/our dog waste renewal company.png" 
                  alt="Équipe Ca-Ca Canin dans une cour résidentielle avec outils de nettoyage et camion de service" 
                  className="rounded-lg shadow-lg w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Residential Services */}
        <section id="services" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* RESPONSIVE: keep the service image/text pair balanced as the layout collapses to one column. */}
            <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="scroll-animation order-2 md:order-2">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900 ${montserrat.className}`}>
                  Service résidentiel de ramassage de déjections canines
                </h2>
                {/* RESPONSIVE: render the section image after the heading on mobile while preserving the desktop side-by-side layout. */}
                <img 
                  src="/images/revised residential pooper scooper services.png" 
                  alt="Équipe de ramassage résidentiel en train de nettoyer une cour avec un chien à proximité" 
                  className="mb-6 rounded-lg shadow-lg w-full md:hidden"
                  loading="lazy"
                />
                <ul className="space-y-4 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Choisissez un passage hebdomadaire, aux deux semaines, mensuel ou ponctuel.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Obtenez un nettoyage soigné dans les zones que votre chien utilise le plus.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Réservez un nettoyage ponctuel ou un service récurrent selon votre cour et votre horaire.</span>
                  </li>
                </ul>
              </div>
              <div className="scroll-animation scroll-delay-1 order-1 hidden md:order-1 md:block">
                <img 
                  src="/images/revised residential pooper scooper services.png" 
                  alt="Équipe de ramassage résidentiel en train de nettoyer une cour avec un chien à proximité" 
                  className="rounded-lg shadow-lg w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section id="quote-form" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <Link
              href="/fr/nettoyage-printemps#quote-form"
              className="mb-6 flex flex-col gap-3 rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-5 text-left shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Besoin d&apos;un grand nettoyage?</p>
                <p className="mt-1 text-xl font-bold text-gray-900">Besoin d&apos;un nettoyage printanier ponctuel?</p>
                <p className="mt-1 text-sm text-gray-600">Utilisez le calculateur de nettoyage de printemps pour une tarification selon le temps et un devis rapide à Laval.</p>
              </div>
              <span className="inline-flex max-w-fit items-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white">
                Aller au nettoyage de printemps
              </span>
            </Link>
            <div className="text-center mb-10">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Calculateur de prix pour le ramassage
              </h2>
              <p className="text-lg text-gray-600">
                Estimez votre prix par visite et par mois selon la fréquence, le nombre de chiens et la taille de votre cour.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8">
              {/* RESPONSIVE: keep the live price visible on mobile while users move between controls and the form fields. */}
              {/* RESPONSIVE: keep the pricing controls stacked first on mobile, then promote the price panel beside them at tablet widths. */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="order-2 space-y-4 md:order-1 md:col-span-1">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Fréquence</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'weekly', label: 'Hebdomadaire' },
                        { key: 'biweekly', label: 'Aux deux semaines' },
                        { key: 'monthly', label: 'Mensuel' },
                        { key: 'onetime', label: 'Ponctuel' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setFrequency(item.key as typeof frequency)}
                          className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition sm:flex-none ${
                            frequency === item.key
                              ? 'bg-brand-green text-white border-brand-green shadow-md'
                              : 'border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green'
                          }`}
                          type="button"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Nombre de chiens</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: '1', label: '1 chien' },
                        { key: '2', label: '2 chiens' },
                        { key: '3plus', label: '3+ chiens' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setDogs(item.key as typeof dogs)}
                          className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition sm:flex-none ${
                            dogs === item.key
                              ? 'bg-brand-green text-white border-brand-green shadow-md'
                              : 'border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green'
                          }`}
                          type="button"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="yard-size" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Taille de la cour (pi²)
                    </label>
                    <div className="space-y-2">
                      <input
                        id="yard-size"
                        type="range"
                        min={3000}
                        max={10000}
                        step={100}
                        value={yardSqft}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const snapped = Math.round(raw / 100) * 100;
                          const clamped = Math.max(3000, Math.min(10000, snapped));
                          setYardSqft(clamped);
                        }}
                        className="w-full accent-brand-green"
                        required
                      />
                      <div className="flex flex-col gap-2 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-semibold text-brand-green">
                          {yardSqft >= 10000 ? '10 000+ pi²' : `${yardSqft.toLocaleString()} pi²`}
                        </span>
                        <span
                          className="inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-3 py-1 text-xs font-semibold text-brand-green"
                        >
                          {yardOptions.find((o) => o.key === yardCategory)?.label} · {yardOptions.find((o) => o.key === yardCategory)?.detail}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-1 md:order-2 md:col-span-2">
                  <div className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                      {frequency === 'onetime' ? 'Visite estimée' : 'Estimation par visite'}
                    </p>
                    <p className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                      {frequency === 'onetime'
                        ? `${formatMoney(displayPrice)} / premières 30 min`
                        : `${formatMoney(displayPrice)}/visite`}
                    </p>
                    {frequency !== 'onetime' && (
                      <div className="mt-4 rounded-2xl bg-white/75 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                          Total mensuel estimé
                        </p>
                        <p className="text-3xl font-extrabold text-brand-green sm:text-5xl">
                          {formatMoney(monthlyTotal)}
                          <span className="ml-1 text-lg font-semibold text-gray-600 sm:text-xl">/mois</span>
                        </p>
                      </div>
                    )}
                    {frequency === 'onetime' && (
                      <p className="text-sm text-gray-600">
                        +5 $ par bloc additionnel de 5 minutes.
                      </p>
                    )}
                    <p className="mt-3 text-base font-semibold text-brand-green">
                      {pricingDetails.note}
                    </p>
                  </div>
                </div>

                <div className="order-3 flex flex-col gap-4 md:col-span-2 md:col-start-2">
                  <div className="rounded-2xl border border-[#d7e6da] bg-white p-4 text-sm text-gray-600 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                    Le prix dépend de la taille de la cour, du nombre de chiens et de la fréquence. Demandez un devis gratuit pour le prix final.
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 rounded-2xl border border-[#d7e6da] bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.05)]">
                    {bookingStatus !== 'success' && (
                      <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white">1</span>
                        Vérifier la zone desservie
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="postal-code" className="text-sm font-semibold text-gray-700">
                          Code postal
                        </label>
                        <input
                          id="postal-code"
                          type="text"
                          name="postalCode"
                          placeholder="H7A 1A1"
                          value={postalCode}
                          onChange={(e) => {
                            setPostalCode(e.target.value);
                            setPostalStatus('idle');
                            setConsentError('');
                          }}
                          autoComplete="postal-code"
                          inputMode="text"
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
                              setConsentError('');
                              if (!checked) {
                                setPostalStatus('idle');
                              }
                            }}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                          />
                          <span>
                            J&apos;accepte les{" "}
                            <Link href="/terms" className="font-semibold text-brand-green hover:underline">
                              conditions
                            </Link>{" "}
                            et la{" "}
                            <Link href="/privacy" className="font-semibold text-brand-green hover:underline">
                              politique de confidentialité
                            </Link>{" "}
                            et j&apos;autorise Ca-Ca Canin à me contacter au sujet de ma demande de devis.
                          </span>
                        </label>
                        {consentError && (
                          <p className="mt-2 text-sm text-red-600" role="alert">
                            {consentError}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        className="w-full bg-brand-green text-white hover:bg-brand-green-dark"
                        onClick={handlePostalCodeCheck}
                      >
                        Vérifier
                      </Button>
                      {postalStatus === 'valid' && (
                        <div className="text-sm text-brand-green" role="status" aria-live="polite">
                          Nous desservons ce code postal de Laval. Passez à l&apos;étape 2.
                        </div>
                      )}
                      {postalStatus === 'invalid' && (
                        <div className="text-sm text-red-600" role="status" aria-live="polite">
                          {postalCode && !isCanadianPostalCode(postalCode)
                            ? 'Veuillez entrer un code postal canadien valide.'
                            : 'Désolé, nous desservons actuellement seulement Laval, QC.'}
                        </div>
                      )}
                    </div>

                    {postalStatus === 'valid' && (
                      <>
                        <div className="space-y-3 border-t border-gray-200 pt-4">
                          <div className="hidden" aria-hidden="true">
                            <label htmlFor="website-field-fr">Laisser ce champ vide</label>
                            <input
                              id="website-field-fr"
                              type="text"
                              name="website"
                              tabIndex={-1}
                              autoComplete="off"
                              value={websiteField}
                              onChange={(e) => setWebsiteField(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white">2</span>
                            Vos coordonnées
                          </div>
                        {/* RESPONSIVE: collect lead details in one column on phones, then grow to multi-column layouts as space allows. */}
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            <div className="space-y-1">
                              <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Nom
                              </label>
                              <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Jean Dupont"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                                Téléphone
                              </label>
                              <input
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="438 880 8922"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                autoComplete="tel"
                                inputMode="tel"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                Courriel
                              </label>
                              <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="vous@courriel.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-brand-green hover:bg-brand-green-dark text-white text-lg py-3"
                          disabled={bookingStatus === 'loading'}
                        >
                          {bookingStatus === 'loading' ? 'Envoi...' : 'Demander mon devis'}
                        </Button>
                        {bookingMessage && (
                          <div
                            className="text-sm text-red-600"
                            role="status"
                            aria-live="polite"
                          >
                            {bookingMessage}
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Nous répondons habituellement en 1 jour ouvrable.
                        </p>
                      </>
                    )}
                      </>
                    )}
                    {bookingStatus === 'success' && (
                      <div className="rounded-2xl border border-brand-green/20 bg-[#eef7f0] p-6 text-center shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Merci</p>
                        <h3 className="mt-2 text-2xl font-bold text-gray-900">Votre demande de devis est envoyée.</h3>
                        <p className="mt-3 text-base text-gray-600">
                          Nous avons bien reçu vos informations et nous vous contacterons sous peu. Inutile de renvoyer le formulaire.
                        </p>
                        <p className="mt-4 text-sm text-brand-green">{bookingMessage}</p>
                      </div>
                    )}
                    {/* RESPONSIVE: keep the mobile estimate below the form steps so the flow stays linear on smaller screens. */}
                    <div className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-4 shadow-[0_14px_34px_rgba(48,121,68,0.12)] md:hidden">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                        {frequency === 'onetime' ? 'Visite estimée' : 'Prix en direct'}
                      </p>
                      <div className="mt-2 flex items-end justify-between gap-3">
                        <p className="text-2xl font-extrabold text-gray-900">
                          {frequency === 'onetime'
                            ? `${formatMoney(displayPrice)}+`
                            : `${formatMoney(displayPrice)}/visite`}
                        </p>
                        {frequency !== 'onetime' && (
                          <p className="text-right text-sm font-semibold text-brand-green">
                            {formatMoney(monthlyTotal)}/mois
                          </p>
                        )}
                      </div>
                      {frequency === 'onetime' && (
                        <p className="mt-2 text-sm text-gray-600">
                          +5 $ toutes les 5 minutes additionnelles apr&egrave;s les 30 premi&egrave;res minutes.
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900 ${montserrat.className}`}>
                Pourquoi les propriétaires choisissent Ca-Ca Canin
              </h2>
              <p className="text-xl text-gray-600">
                Un service pensé pour les propriétaires qui veulent un ramassage simple, régulier et facile à réserver à Laval.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                { icon: Heart, title: "Visites pensées pour les chiens", desc: "Nous utilisons des pratiques de nettoyage sanitaires adaptées aux cours familiales avec chiens." },
                { icon: Smartphone, title: "Planification facile", desc: "Demandez le service, faites des changements et posez vos questions par téléphone ou par courriel." },
                { icon: FileText, title: "Aucun contrat", desc: "Commencez, mettez en pause ou arrêtez le service sans engagement à long terme." },
                { icon: Camera, title: "Photos du portail", desc: "Recevez une photo de confirmation après la visite pour savoir que le portail est bien fermé." },
                { icon: Bell, title: "Mises à jour de visite", desc: "Restez informé avec des mises à jour avant et après votre passage prévu." },
              ].map((feature, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]" style={{ transitionDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                      <feature.icon className="w-6 h-6 text-brand-green" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900 ${montserrat.className}`}>
                Zones desservies
              </h2>
              <p className="text-xl text-gray-600">
                Service de ramassage de déjections canines partout à Laval, Québec.
              </p>
            </div>
            <div className="max-w-2xl mx-auto scroll-animation scroll-delay-1">
              <Card className="border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-brand-green/15 bg-[#eef7f0]">
                    <MapPin className="h-8 w-8 text-brand-green" />
                  </div>
                  <CardTitle className="text-2xl">Laval, QC</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-gray-700 mb-4">
                    Ramassage résidentiel de déjections canines
                  </p>
                  <p className="text-gray-600">
                    Service récurrent et ponctuel pour les propriétaires de Laval
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900 ${montserrat.className}`}>
                FAQ sur le ramassage de déjections canines
              </h2>
              <p className="text-xl text-gray-600">
                Réponses aux questions sur notre service à Laval.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: "Nettoyez-vous toute la cour?", a: "Oui. Nous nettoyons les zones de la propriété où il y a des déjections, y compris l'avant, l'arrière, les côtés et les espaces comme les enclos à chiens." },
                { q: "Offrez-vous le service toute l&apos;année?", a: "Oui. Ca-Ca Canin offre le service à Laval toute l&apos;année, y compris en hiver lorsque le nettoyage demeure accessible." },
                { q: "Comment le prix est-il calculé?", a: "Le prix dépend de la taille de la cour, de la fréquence du service et du nombre de chiens. Utilisez le calculateur pour une estimation, puis demandez un devis pour le prix final." },
                { q: "Dois-je signer un contrat?", a: "Non. Vous pouvez commencer, mettre en pause ou annuler le service en communiquant avec notre équipe." },
                { q: "Que se passe-t-il après chaque visite?", a: "Vous recevez une confirmation de service et, au besoin, une photo du portail après la visite." },
                { q: "Comment les déchets sont-ils disposés?", a: "Les déchets sont mis dans des sacs et déposés dans la poubelle extérieure lorsqu&apos;elle est accessible. Sinon, la disposition suit l&apos;entente prévue pour le service." },
              ].map((faq, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-brand-green/30 hover:shadow-[0_18px_45px_rgba(48,121,68,0.10)]" style={{ transitionDelay: `${index * 0.05}s` }}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">
                      {faq.a}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      {/* RESPONSIVE: center footer sections on phones and restore the multi-column layout progressively. */}
      <footer className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 grid gap-8 text-center sm:grid-cols-2 sm:text-left xl:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center justify-center space-x-3 sm:justify-start">
                <img 
                  src="/images/cacacaninlogo.jpg" 
                  alt="Logo Ca-Ca Canin" 
                  className="h-8 w-8"
                />
                <span className={`text-lg font-bold text-brand-green sm:text-xl ${montserrat.className}`}>
                  CA-CA CANIN
                </span>
              </div>
              <p className="text-gray-400">
                Service de ramassage de déjections canines pour les propriétaires de Laval.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#services" className="hover:text-white">Résidentiel</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">À propos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#about" className="hover:text-white">À propos</Link></li>
                <li><Link href="#faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Nous joindre</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Laval, QC</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+14388808922" className="hover:text-white">
                    438 880 8922
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:cacacaninqc@gmail.com" className="break-all hover:text-white">
                    cacacaninqc@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 Ca-Ca Canin</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
