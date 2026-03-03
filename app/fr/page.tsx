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
  medium: 1.15,
  large: 1.3,
};

const yardOptions: { key: 'small' | 'medium' | 'large'; label: string; detail: string }[] = [
  { key: 'small', label: 'Petit', detail: "Jusqu'à 2 000 pi²" },
  { key: 'medium', label: 'Moyen', detail: '2 000 - 3 000 pi²' },
  { key: 'large', label: 'Grand', detail: '3 000+ pi²' },
];

const frequencyNotes: Record<'weekly' | 'biweekly' | 'monthly' | 'onetime', string> = {
  weekly: "Parfait pour garder votre cour propre en tout temps.",
  biweekly: "Excellent équilibre entre prix et commodité.",
  monthly: "Idéal pour un entretien léger.",
  onetime: "Inclut jusqu'à 30 minutes. +5 $ par tranche de 5 minutes.",
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
  const [yardSqft, setYardSqft] = useState(2000);
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

  const yardCategory = useMemo<'small' | 'medium' | 'large'>(() => {
    if (yardSqft <= 2000) return 'small';
    if (yardSqft <= 3000) return 'medium';
    return 'large';
  }, [yardSqft]);

  const pricingDetails = useMemo(() => {
    const base = basePricing[frequency][dogs];
    const modifier = yardModifiers[yardCategory];
    const baseWithMod = base * modifier;

    if (frequency === 'onetime') {
      return { perVisit: base, note: frequencyNotes[frequency] };
    }

    const extraSqft = Math.max(0, yardSqft - 2000);
    const increments = Math.floor(extraSqft / 100);
    const midIncrements = Math.min(increments, 10);
    const largeIncrements = Math.max(0, increments - 10);
    const multiplier = Math.pow(1.02, midIncrements) * Math.pow(1.015, largeIncrements);

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

  const yearlyTotal = useMemo(() => {
    if (frequency === 'onetime') {
      return 0;
    }

    return Math.round(monthlyTotal * 12 * 0.8 * 100) / 100;
  }, [frequency, monthlyTotal]);

  const annualMonthlyEquivalent = useMemo(() => {
    if (frequency === 'onetime') {
      return 0;
    }

    return Math.round((yearlyTotal / 12) * 100) / 100;
  }, [frequency, yearlyTotal]);

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
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Principal">
          <div className="flex items-center justify-between h-16">
            <Link href="/fr" className="flex items-center space-x-3">
              <img 
                src="/images/cacacaninlogo.jpg" 
                alt="Logo Ca-Ca Canin" 
                className="h-10 w-10"
              />
              <span className={`text-2xl font-bold text-brand-green ${montserrat.className}`}>
                CA-CA CANIN
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#services" className="text-gray-700 hover:text-brand-green transition-colors">Services</Link>
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

            <button 
              className="md:hidden p-2"
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

          {isMenuOpen && (
            <div id="mobile-nav" className="md:hidden py-4 space-y-4">
              <Link href="#services" className="block text-gray-700 hover:text-brand-green">Services</Link>
              <Link href="#about" className="block text-gray-700 hover:text-brand-green">À propos</Link>
              <Link href="#faq" className="block text-gray-700 hover:text-brand-green">FAQ</Link>
              <Link href="/" className="block text-brand-brown hover:text-brand-brown/80">English</Link>
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
        <Link
          href="/fr/nettoyage-printemps"
          className="block bg-brand-green text-white text-center text-sm font-semibold py-2 px-4"
        >
          Nettoyage de printemps à partir de 60 $ →
        </Link>
      </header>

      <main id="main-content" className="flex-grow scroll-mt-12">
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
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1fr)] lg:gap-10">
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-full max-w-[30rem] overflow-hidden sm:max-w-[34rem] lg:max-w-[38rem]">
                  <div className="absolute inset-x-8 bottom-8 h-12 rounded-full bg-brand-brown/15 blur-3xl sm:inset-x-10 sm:bottom-10 sm:h-14 lg:inset-x-12" />
                  <img
                    src="/images/hero-dog.png"
                    alt="Chien heureux assis dans une cour propre"
                    className="relative z-10 mx-auto h-auto w-full max-w-[27rem] object-contain sm:max-w-[30rem] lg:max-w-[34rem]"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 z-20 h-20 bg-white sm:h-24 lg:h-28"
                    style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }}
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h1 className={`mb-5 text-4xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl ${montserrat.className}`}>
                  Le service de ramassage<br />
                  <span className="text-brand-green">de déjections canines à Laval</span>
                </h1>
                <p className="mb-8 max-w-3xl text-lg text-gray-600 sm:text-xl md:text-2xl lg:max-w-2xl">
                  Tarifs clairs, horaires flexibles et une cour propre rapidement.
                </p>
                <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
                  <Button
                    size="lg"
                    className="w-full rounded-full bg-brand-green px-8 py-6 text-lg text-white hover:bg-brand-green-dark sm:w-auto"
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
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-8 py-6 text-lg text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto"
                    asChild
                  >
                    <Link href="#services">Voir comment ça fonctionne</Link>
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
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900 ${montserrat.className}`}>
                Promesse client Ca-Ca Canin
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="scroll-animation scroll-delay-1 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <CheckCircle2 className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Service fiable et sans tracas</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Notre service fiable et sans tracas assure des visites ponctuelles et efficaces, laissant votre cour impeccable. Profitez de plus de temps avec votre chien — on s&apos;occupe du reste!
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="scroll-animation scroll-delay-2 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Shield className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Satisfaction garantie</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Chez Ca-Ca Canin, votre satisfaction est garantie avec notre service de ramassage à Laval. Si vous n&apos;êtes pas satisfait, nous corrigerons la situation — votre bonheur est notre priorité.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="scroll-animation scroll-delay-3 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Heart className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Engagement santé et sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Ca-Ca Canin priorise la santé et la sécurité grâce à des pratiques sanitaires et une élimination écoresponsable, pour un environnement propre et sécuritaire pour les familles et animaux de Laval.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="scroll-animation">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900 ${montserrat.className}`}>
                  Notre entreprise de ramassage de déjections canines
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  Ca-Ca Canin a été fondée pour améliorer la vie des propriétaires de chiens en offrant des services de ramassage de déjections de grande qualité partout à Laval, Québec. Nous sommes une nouvelle entreprise locale dédiée à un service fiable et professionnel pour notre communauté. Chaque client compte, et nous bâtissons la confiance grâce à un service exceptionnel et un souci du détail.
                </p>
                <Button className="bg-brand-green hover:bg-brand-green-dark text-white">
                  En savoir plus
                </Button>
              </div>
              <div className="scroll-animation scroll-delay-1">
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
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="scroll-animation scroll-delay-1 order-2 md:order-1">
                <img 
                  src="/images/revised residential pooper scooper services.png" 
                  alt="Équipe de ramassage résidentiel en train de nettoyer une cour avec un chien à proximité" 
                  className="rounded-lg shadow-lg w-full"
                  loading="lazy"
                />
              </div>
              <div className="scroll-animation order-1 md:order-2">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900 ${montserrat.className}`}>
                  Services résidentiels de ramassage
                </h2>
                <ul className="space-y-4 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Options flexibles : hebdomadaire, aux deux semaines, mensuel et ponctuel.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Service personnalisé avec une grande attention aux détails pour chaque client.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Des services de désodorisation gardent votre cour fraîche et sans odeur.</span>
                  </li>
                </ul>
                <Button className="bg-brand-green hover:bg-brand-green-dark text-white">
                  En savoir plus
                </Button>
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
                <p className="mt-1 text-xl font-bold text-gray-900">Vous cherchez plutôt un nettoyage de printemps?</p>
                <p className="mt-1 text-sm text-gray-600">Utilisez le calculateur de nettoyage de printemps pour les devis ponctuels avec tarification selon le temps.</p>
              </div>
              <span className="inline-flex max-w-fit items-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white">
                Aller au nettoyage de printemps
              </span>
            </Link>
            <div className="text-center mb-10">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Calculateur de prix
              </h2>
              <p className="text-lg text-gray-600">
                Estimez votre prix par visite et par mois selon la fréquence, le nombre de chiens et la taille de la cour.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1 space-y-4">
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
                          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${
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
                          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${
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
                        min={2000}
                        max={4000}
                        step={100}
                        value={yardSqft}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const snapped = Math.round(raw / 100) * 100;
                          const clamped = Math.max(2000, Math.min(4000, snapped));
                          setYardSqft(clamped);
                        }}
                        className="w-full accent-brand-green"
                        required
                      />
                      <div className="flex flex-col gap-2 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-semibold text-brand-green">{yardSqft.toLocaleString()} pi²</span>
                        <span
                          className="inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-3 py-1 text-xs font-semibold text-brand-green"
                        >
                          {yardOptions.find((o) => o.key === yardCategory)?.label} · {yardOptions.find((o) => o.key === yardCategory)?.detail}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                  <div className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                      {frequency === 'onetime' ? 'Visite estimée' : 'Estimation par visite'}
                    </p>
                    <p className="mb-2 text-4xl font-extrabold text-gray-900">
                      {frequency === 'onetime'
                        ? `${formatMoney(displayPrice)} / premières 30 min`
                        : `${formatMoney(displayPrice)}/visite`}
                    </p>
                    {frequency !== 'onetime' && (
                      <div className="space-y-1 text-sm font-semibold text-gray-700">
                        <p>Total mensuel estimé : {formatMoney(monthlyTotal)}/mois</p>
                        <p>Paiement annuel : {formatMoney(yearlyTotal)}/an ({formatMoney(annualMonthlyEquivalent)}/mois en équivalent, rabais de 20 %)</p>
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

                  <div className="rounded-2xl border border-[#d7e6da] bg-white p-4 text-sm text-gray-600 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                    Le prix exact dépend de la taille de la cour et du nombre de chiens. Demandez un devis gratuit pour une estimation personnalisée.
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 rounded-2xl border border-[#d7e6da] bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.05)]">
                    {bookingStatus !== 'success' && (
                      <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white">1</span>
                        Vérifier la zone desservie
                      </div>
                      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
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
                        <Button
                          type="button"
                          className="w-full bg-brand-green text-white hover:bg-brand-green-dark md:w-auto"
                          onClick={handlePostalCodeCheck}
                        >
                          Vérifier
                        </Button>
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
                            et je consens à être contacté au sujet de ma demande.
                          </span>
                        </label>
                        {consentError && (
                          <p className="mt-2 text-sm text-red-600" role="alert">
                            {consentError}
                          </p>
                        )}
                      </div>
                      {postalStatus === 'valid' && (
                        <div className="text-sm text-brand-green" role="status" aria-live="polite">
                          Parfait, nous desservons ce code postal de Laval. Passez à l&apos;étape 2.
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
                            Coordonnées
                          </div>
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
                          {bookingStatus === 'loading' ? 'Envoi...' : 'Obtenir un devis'}
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
                          Nous répondons généralement en 1 jour ouvrable.
                        </p>
                      </>
                    )}
                      </>
                    )}
                    {bookingStatus === 'success' && (
                      <div className="rounded-2xl border border-brand-green/20 bg-[#eef7f0] p-6 text-center shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Merci</p>
                        <h3 className="mt-2 text-2xl font-bold text-gray-900">Votre demande de devis a bien été envoyée.</h3>
                        <p className="mt-3 text-base text-gray-600">
                          Nous avons bien reçu vos informations et nous vous contacterons sous peu. Inutile d&apos;envoyer le formulaire de nouveau.
                        </p>
                        <p className="mt-4 text-sm text-brand-green">{bookingMessage}</p>
                      </div>
                    )}
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
                Pourquoi choisir Ca-Ca Canin?
              </h2>
              <p className="text-xl text-gray-600">
                En choisissant Ca-Ca Canin pour votre service à Laval, vous faites le bon choix avec notre garantie de satisfaction à 100 %.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: "Sécurité des animaux", desc: "Nous nettoyons tout notre équipement et nos chaussures avec un désinfectant de grade chenil après chaque visite, limitant la propagation des germes." },
                { icon: Smartphone, title: "Planification facile", desc: "Réservez le service, faites des changements et posez vos questions directement à notre équipe par téléphone ou par courriel." },
                { icon: FileText, title: "Aucun contrat", desc: "Bénéficiez de services flexibles sans engagement, avec la liberté de commencer ou d&apos;arrêter quand vous le souhaitez." },
                { icon: Camera, title: "Photos du portail", desc: "Recevez une photo rassurante de votre portail fermé après chaque visite, pour votre tranquillité d&apos;esprit." },
                { icon: Bell, title: "Textos de notification", desc: "Nous envoyons un texto 60 minutes avant l&apos;arrivée et un courriel après le service pour vous tenir informé." },
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
                Ca-Ca Canin dessert fièrement tout Laval, Québec
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
                    Services de ramassage de déjections canines
                  </p>
                  <p className="text-gray-600">
                    Nous desservons tous les quartiers de Laval, Québec
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
                Questions fréquentes sur le service de ramassage!
              </h2>
              <p className="text-xl text-gray-600">
                Trouvez ici les réponses à vos questions sur notre service de ramassage.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: "Est-ce que Ca-Ca Canin nettoie toute la cour?", a: "Ca-Ca Canin nettoie toutes les zones de votre propriété où il y a des déjections, y compris l'avant, l'arrière, les côtés, les plates-bandes, les enclos à chiens, etc." },
                { q: "Offrez-vous le service de ramassage toute l'année?", a: "Oui! Ca-Ca Canin offre le service toute l'année à Laval. Même en hiver, nous assurons les visites. Dans les zones enneigées, la plupart des déjections restent ramassables." },
                { q: "Comment assurez-vous la sécurité de mes chiens?", a: "La sécurité de nos clients et de leurs chiens est une priorité chez Ca-Ca Canin. Nous désinfectons notre équipement et nos chaussures entre chaque cour avec un désinfectant de grade chenil pour limiter les germes. Nous prenons aussi des photos du portail une fois le nettoyage terminé, et tous nos employés sont vérifiés." },
                { q: "Combien coûte un service professionnel de ramassage?", a: "Les plans de Ca-Ca Canin commencent dès 60 $ par mois. Le prix dépend de la taille de la cour, de la fréquence et du nombre de chiens. La plupart de nos clients paient entre 95 $ et 135 $ par mois." },
                { q: "Dois-je signer un contrat pour le service?", a: "Aucun contrat! Vous pouvez commencer, mettre en pause ou annuler votre service à tout moment en appelant ou en écrivant à notre équipe." },
                { q: "Comment disposez-vous des déchets après chaque visite?", a: "L'élimination adéquate est essentielle puisque les déjections canines sont considérées comme un matériau potentiellement dangereux. Nous mettons les déchets dans un double sac et les déposons dans la poubelle du client ou près de la maison." },
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
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/images/cacacaninlogo.jpg" 
                  alt="Logo Ca-Ca Canin" 
                  className="h-8 w-8"
                />
                <span className={`text-xl font-bold text-brand-green ${montserrat.className}`}>
                  CA-CA CANIN
                </span>
              </div>
              <p className="text-gray-400">
                Le principal service de ramassage de déjections canines à Laval.
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
                  <a href="mailto:cacacaninqc@gmail.com" className="hover:text-white">
                    cacacaninqc@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 Ca-Ca Canin • Le principal service de ramassage de déjections canines à Laval.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
