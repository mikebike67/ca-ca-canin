'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { Montserrat } from 'next/font/google'
import { CheckCircle2, Shield, Heart, Camera, MapPin, Phone, Mail, ClipboardCheck, Sparkles, PawPrint } from 'lucide-react'

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
  weekly: "Idéal pour garder la cour propre.",
  biweekly: "Bon équilibre coût/praticité.",
  monthly: "Option d'entretien léger.",
  onetime: "Visite de nettoyage de printemps.",
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;
const normalizePostalCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');
const isCanadianPostalCode = (value: string) => /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalizePostalCode(value));
const isLavalPostalCode = (value: string) => normalizePostalCode(value).startsWith('H7');

export default function SpringCleanupFrenchPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'onetime'>('onetime');
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
          postalCode: normalizePostalCode(postalCode),
          consent: true,
          website: websiteField,
          source: 'spring-cleanup',
          locale: 'fr',
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

  const handleCtaClick = (label: string) => {
    console.log(`[cta] ${label}`);
  };

  const faqItems = [
    {
      q: "Qu'est-ce qui est inclus dans le nettoyage de printemps?",
      a: "Un balayage complet de la cour pour enlever l'accumulation de l'hiver."
    },
    {
      q: "Le nettoyage commence vraiment à 60 $?",
      a: "Oui. Le nettoyage de printemps est de 60 $ pour les 30 premières minutes, puis 5 $ pour chaque tranche additionnelle de 5 minutes. Nous arrondissons vers le bas, donc si le travail prend 54 minutes, il est facturé comme 50 minutes au lieu de 55."
    },
    {
      q: "Dois-je être sur place?",
      a: "Non. Nous pouvons intervenir avec l'accès au portail et envoyer une confirmation."
    },
    {
      q: "À quelle vitesse puis-je réserver?",
      a: "Les places sont limitées au printemps et nous confirmons généralement en 1 jour ouvrable."
    }
  ];

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
      `}</style>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Principal">
          <div className="flex items-center justify-between h-16">
            <Link href="/fr" className="flex items-center space-x-3">
              <img
                src="/images/cacacaninlogo.jpg"
                alt="Logo Ca-Ca Canin"
                className="h-10 w-10"
              />
              <span className={`text-xl font-bold text-brand-green sm:text-2xl ${montserrat.className}`}>
                CA-CA CANIN
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-gray-700 hover:text-brand-green transition-colors">Comment ça fonctionne</Link>
              <Link href="#quote-form" className="text-gray-700 hover:text-brand-green transition-colors">Tarifs</Link>
              <Link href="#faq" className="text-gray-700 hover:text-brand-green transition-colors">FAQ</Link>
              <Link href="/spring-cleanup" className="text-brand-brown hover:text-brand-brown/80 transition-colors">English</Link>
              <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link href="#quote-form" data-cta="spring-quote" onClick={() => handleCtaClick("nav-quote")}>
                  Obtenir un devis gratuit
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
              <Link href="#how-it-works" className="block text-gray-700 hover:text-brand-green">Comment ça fonctionne</Link>
              <Link href="#quote-form" className="block text-gray-700 hover:text-brand-green">Tarifs</Link>
              <Link href="#faq" className="block text-gray-700 hover:text-brand-green">FAQ</Link>
              <Link href="/spring-cleanup" className="block text-brand-brown hover:text-brand-brown/80">English</Link>
              <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link href="#quote-form" data-cta="spring-quote" onClick={() => handleCtaClick("mobile-quote")}>
                  Obtenir un devis gratuit
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </header>

      <main id="main-content" className="flex-grow scroll-mt-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            })
          }}
        />
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-brown font-semibold mb-3">
              Laval, QC
            </p>
            <h1 className={`text-4xl md:text-6xl font-extrabold mb-4 text-gray-900 ${montserrat.className}`}>
              NETTOYAGE PRINTEMPS DES DÉJECTIONS CANINES
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6">
              À partir de 60 $ • Places limitées au printemps
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white text-lg px-8 py-5 rounded-full" asChild>
                <Link href="#quote-form" data-cta="spring-quote" onClick={() => handleCtaClick("hero-quote")}>
                  Obtenir un devis gratuit
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-5 rounded-full border-2 border-brand-brown bg-brand-brown text-white hover:bg-brand-brown/90 hover:text-white" asChild>
                <Link href="#how-it-works">Comment ça fonctionne</Link>
              </Button>
            </div>
            <ul className="mt-8 grid gap-3 text-left max-w-2xl mx-auto text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Enlève l'accumulation de l'hiver
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Sécuritaire pour les enfants et les animaux
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Outils professionnels désinfectés après chaque visite
              </li>
            </ul>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Comment ça fonctionne
              </h2>
              <p className="text-lg text-gray-600">
                Simple, rapide, et pensé pour le printemps à Laval, QC.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: ClipboardCheck, title: "Demander un devis", desc: "Indiquez la taille de la cour et le nombre de chiens." },
                { icon: PawPrint, title: "Confirmer un horaire", desc: "On confirme les détails et la visite." },
                { icon: Sparkles, title: "On nettoie", desc: "On enlève l'accumulation et on laisse la cour propre." },
              ].map((step, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                      <step.icon className="w-6 h-6 text-brand-green" />
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

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Témoignages
              </h2>
              <p className="text-lg text-gray-600">
                Un vrai commentaire client pour Ca-Ca Canin.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Avis 5 etoiles
                </div>
                <CardTitle className="text-xl">Zander M.</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-8 text-gray-600">
                    Wanted to share my experience with Micheal from Ca-Ca Canin, very professional, he came over to asses our lawn , which let me tell you was a doozy and a half to say the least , old tenants left garbage in thw yard the grass was almost 4 feet tall with random shrubs and over growth literally everywhere , yoy couldn&apos;t see the ground, they hadn&apos;t cleaned the yard in years there dog made basically a layer of poop , Micheal came out and meticulously lifted everything and got most of turd mines . For 80$ I couldn&apos;t have spent my money more wisely , I recommend Micheal to everyone who owns a dog and needs some help with their yard . KEEP IT UP MAN
                </CardDescription>
              </CardContent>
            </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Recommandation Facebook
                </div>
                <CardTitle className="text-xl">Julie B.</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-8 text-gray-600">
                    Excellent service provided by Michael Atallah. He shows up on time, professional and courteous. Very thorough inspection of the back lawn and pickup of our dog&apos;s poop. He also disposes the matter in an environmentally friendly way. I would definitely and highly recommend his services.
                </CardDescription>
              </CardContent>
            </Card>
            </div>
          </div>
        </section>

        <section id="quote-form" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <div className="text-center mb-8">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Estimation du nettoyage de printemps
              </h2>
              <p className="text-lg text-gray-600">
                Prix final confirmé par devis. Nettoyages ponctuels à partir de 60 $.
              </p>
            </div>

            <div className="rounded-2xl border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(17,24,39,0.05)] md:p-8">
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
                      {frequency === 'onetime' ? 'Estimation du nettoyage de printemps' : 'Estimation par visite'}
                    </p>
                    <p className="mb-2 text-4xl font-extrabold text-gray-900">
                      {frequency === 'onetime'
                        ? `${formatMoney(displayPrice)} / premières 30 min`
                        : `${formatMoney(displayPrice)}/visite`}
                    </p>
                    {frequency !== 'onetime' && (
                      <div className="mt-4 rounded-2xl bg-white/75 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                          Total mensuel estimé
                        </p>
                        <p className="text-4xl font-extrabold text-brand-green sm:text-5xl">
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

                  <div className="rounded-2xl border border-[#d7e6da] bg-white p-4 text-sm text-gray-600 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                    Prix final confirmé par devis. Demandez un devis gratuit pour une estimation personnalisée.
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 rounded-2xl border border-[#d7e6da] bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.05)]">
                    {bookingStatus !== 'success' && (
                      <>
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="website-field-spring-fr">Laisser ce champ vide</label>
                      <input
                        id="website-field-spring-fr"
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
                        Vérifier la zone desservie
                      </div>
                      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                        <div className="space-y-1">
                          <label htmlFor="postal-code" className="text-sm font-semibold text-gray-700">Code postal</label>
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
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          <div className="space-y-1">
                            <label htmlFor="name" className="text-sm font-semibold text-gray-700">Nom</label>
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
                            <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Téléphone</label>
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
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Courriel</label>
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
                        <Button type="submit" className="w-full bg-brand-green hover:bg-brand-green-dark text-white text-lg py-3" disabled={bookingStatus === 'loading'}>
                          {bookingStatus === 'loading' ? 'Envoi...' : 'Obtenir un devis gratuit'}
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
                        <h3 className="mt-2 text-2xl font-bold text-gray-900">Votre demande de nettoyage de printemps a bien été envoyée.</h3>
                        <p className="mt-3 text-base text-gray-600">
                          Nous avons bien reçu votre demande et nous vous contacterons sous peu. Inutile d&apos;envoyer le formulaire de nouveau.
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

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Pourquoi Ca-Ca Canin?
              </h2>
              <p className="text-lg text-gray-600">
                Local, fiable, et prêt pour le nettoyage de printemps à Laval.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Heart, title: "Procédés sûrs", desc: "Pratiques sanitaires pour une cour propre." },
                  { icon: Camera, title: "Photo du portail", desc: "Confirmation envoyée après la visite." },
                  { icon: ClipboardCheck, title: "Tarification claire", desc: "Le nettoyage de printemps commence à 60 $ pour les 30 premières minutes, puis 5 $ par tranche additionnelle de 5 minutes avec arrondi vers le bas." },
                ].map((feature, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                      <feature.icon className="w-6 h-6 text-brand-green" />
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

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Zone de service
              </h2>
              <p className="text-lg text-gray-600">
                Desservant Laval, QC pour le nettoyage de printemps.
              </p>
            </div>
            <div className="max-w-2xl mx-auto scroll-animation">
              <Card className="border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-brand-green/15 bg-[#eef7f0]">
                    <MapPin className="h-8 w-8 text-brand-green" />
                  </div>
                  <CardTitle className="text-2xl">Laval, QC</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-gray-700 mb-4">
                    Nettoyage de printemps et service continu
                  </p>
                  <p className="text-gray-600">
                    Planification rapide, places limitées
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                FAQ nettoyage de printemps
              </h2>
              <p className="text-lg text-gray-600">
                Réponses pour Laval, QC.
              </p>
            </div>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-brand-green/30 hover:shadow-[0_18px_45px_rgba(48,121,68,0.10)]" style={{ transitionDelay: `${index * 0.05}s` }}>
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

      <footer className="bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="flex items-center space-x-3 mb-4">
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
                Nettoyage de printemps et remise à zéro ponctuelle des cours à Laval, Québec.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+14388808922" className="hover:text-white">438 880 8922</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:cacacaninqc@gmail.com" className="break-all hover:text-white">cacacaninqc@gmail.com</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#quote-form" className="hover:text-white">Obtenir un devis gratuit</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white">Comment ça fonctionne</Link></li>
                <li><Link href="#faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
            <p>© 2026 Ca-Ca Canin</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
