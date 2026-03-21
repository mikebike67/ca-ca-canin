'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteFooter from "@/components/site-footer"
import { calculateBookingPrice, getMonthlyVisits, getYardCategory, isCanadianPostalCode, normalizePostalCode, type DogCount, type ServiceFrequency, type YardCategory } from "@/lib/booking"
import { SPRING_CLEANUP_LOCATIONS, isSpringCleanupPostalCode } from "@/lib/spring-cleanup-service-area"
import Link from "next/link"
import Image from "next/image"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { Montserrat } from 'next/font/google'
import { CheckCircle2, Shield, Heart, Camera, MapPin, ClipboardCheck, Sparkles, PawPrint } from 'lucide-react'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal'],
})

const yardOptions: { key: YardCategory; label: string; detail: string }[] = [
  { key: 'small', label: 'Standard / Small', detail: '~1,000-3,000 sq ft' },
  { key: 'medium', label: 'Medium', detail: '~3,000-6,000 sq ft' },
  { key: 'large', label: 'Large', detail: '~6,000-10,000 sq ft' },
  { key: 'xlarge', label: 'X-Large', detail: '10,000+ sq ft' },
];

const frequencyNotes: Record<ServiceFrequency, string> = {
  weekly: "Best for ongoing cleanup after the initial reset.",
  biweekly: "A practical balance of upkeep and cost.",
  monthly: "A lighter maintenance option.",
  onetime: "One-time spring cleanup visit.",
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

export default function SpringCleanupPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const quoteThankYouRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [frequency, setFrequency] = useState<ServiceFrequency>('onetime');
  const [dogs, setDogs] = useState<DogCount>('1');
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

  const yardCategory = useMemo(() => getYardCategory(yardSqft), [yardSqft]);

  const pricingDetails = useMemo(() => {
    const perVisit = calculateBookingPrice(frequency, dogs, yardSqft);
    return { perVisit, note: frequencyNotes[frequency] };
  }, [dogs, frequency, yardSqft]);

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

  const handlePostalCodeCheck = () => {
    const normalized = normalizePostalCode(postalCode);

    if (!isCanadianPostalCode(normalized)) {
      setPostalStatus('invalid');
      setBookingStatus('idle');
      setBookingMessage('');
      return;
    }

    if (!isSpringCleanupPostalCode(normalized)) {
      setPostalStatus('invalid');
      setBookingStatus('idle');
      setBookingMessage('');
      return;
    }

    if (!consentChecked) {
      setConsentError('Please agree to the Terms and Privacy Policy to continue.');
      setPostalStatus('idle');
      return;
    }

    setConsentError('');
    setPostalStatus('valid');
  };

  const handleBookingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!consentChecked) {
      setConsentError('Please agree to the Terms and Privacy Policy before submitting.');
      return;
    }

    if (!isCanadianPostalCode(postalCode) || !isSpringCleanupPostalCode(postalCode)) {
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
          locale: 'en',
          frequency,
          dogs,
          yardSqft,
          price: pricingDetails.perVisit,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send confirmation.');
      }

      setBookingStatus('success');
      setBookingMessage('Confirmation email sent! We will follow up shortly.');
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
      setBookingMessage(err?.message || 'Something went wrong. Please try again.');
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

  useEffect(() => {
    if (bookingStatus !== 'success' || !quoteThankYouRef.current) return;

    requestAnimationFrame(() => {
      quoteThankYouRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      quoteThankYouRef.current?.focus();
    });
  }, [bookingStatus]);

  const faqItems = [
    {
      q: "What is included in the spring cleanup?",
      a: "A full yard sweep to remove winter buildup and leave the property cleaner and ready to use."
    },
    {
      q: "Is the spring cleanup really starting at $60?",
      a: "Yes. Spring cleanup is $60 for the first 30 minutes, then $5 for every additional 5-minute increment. We round time down, so if the job takes 54 minutes, it is billed as 50 minutes instead of 55."
    },
    {
      q: "Do I need to be home?",
      a: "No. If we have access to the gate, we can complete the cleanup and send confirmation after the visit."
    },
    {
      q: "How fast can I book?",
      a: "Spring spots are limited, and we typically confirm requests within 1 business day."
    }
  ];

  return (
    <div className={`flex flex-col min-h-screen bg-white text-gray-900 ${montserrat.className}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Skip to content
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

      {/* RESPONSIVE: keep the sticky header compact and readable on narrow screens without changing the desktop layout. */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Primary">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex min-w-0 items-center space-x-3">
              <Image
                src="/images/cacacaninlogo.jpg"
                alt="Ca-Ca Canin logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className={`text-lg font-bold text-brand-green sm:text-2xl ${montserrat.className}`}>
                CA-CA CANIN
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-gray-700 hover:text-brand-green transition-colors">How it works</Link>
              <Link href="#quote-form" className="text-gray-700 hover:text-brand-green transition-colors">Pricing</Link>
              <Link href="#faq" className="text-gray-700 hover:text-brand-green transition-colors">FAQ</Link>
              <Link href="/contact" className="text-gray-700 hover:text-brand-green transition-colors">Contact</Link>
              <Link href="/fr/nettoyage-printemps" className="text-brand-brown hover:text-brand-brown/80 transition-colors">Français</Link>
              <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link href="#quote-form" data-cta="spring-quote">
                  Get a Free Quote
                </Link>
              </Button>
            </div>

            {/* RESPONSIVE: enlarge the mobile menu trigger to a comfortable 44px touch target. */}
            <button
              className="md:hidden rounded-lg p-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
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
              <Link href="#how-it-works" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">How it works</Link>
              <Link href="#quote-form" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">Pricing</Link>
              <Link href="#faq" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">FAQ</Link>
              <Link href="/contact" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">Contact</Link>
              <Link href="/fr/nettoyage-printemps" className="block rounded-md py-2 text-brand-brown hover:text-brand-brown/80">Français</Link>
              <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link href="#quote-form" data-cta="spring-quote">
                  Get a Free Quote
                </Link>
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
                  name: "Spring dog poop cleanup",
                  serviceType: "Spring dog poop cleanup",
                  provider: {
                    "@type": "LocalBusiness",
                    name: "Ca-Ca Canin",
                    telephone: "+1-438-880-8922",
                    url: "https://cacacanin.com/spring-cleanup",
                  },
                  areaServed: [
                    "Laval, QC",
                    "Blainville, QC",
                    "Bois-des-Filion, QC",
                    "Boisbriand, QC",
                    "Deux-Montagnes, QC",
                    "Lorraine, QC",
                    "Mirabel, QC",
                    "Oka, QC",
                    "Pointe-Calumet, QC",
                    "Rosemere, QC",
                    "Saint-Eustache, QC",
                    "Saint-Joseph-du-Lac, QC",
                    "Sainte-Anne-des-Plaines, QC",
                    "Sainte-Marthe-sur-le-Lac, QC",
                    "Sainte-Therese, QC"
                  ]
                },
                {
                  "@type": "FAQPage",
                  mainEntity: faqItems.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: item.a,
                    },
                  })),
                }
              ]
            })
          }}
        />
        {/* RESPONSIVE: reduce hero text density and let CTA buttons stack cleanly on narrow screens. */}
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-brown font-semibold mb-3">
              Laval and North Shore, QC
            </p>
            <h1 className={`mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-6xl ${montserrat.className}`}>
              SPRING DOG POOP CLEANUP IN LAVAL AND THE NORTH SHORE
            </h1>
            <p className="mb-6 text-lg text-gray-600 sm:text-xl md:text-2xl">
              Winter left the yard a mess. Book a one-time cleanup starting at $60 and get the space usable again without doing it yourself.
            </p>
            {/* RESPONSIVE: keep hero actions full-width on phones for easier tapping. */}
            <div className="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center">
              <Button size="lg" className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#quote-form" data-cta="spring-quote">
                  Book My Spring Cleanup
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-6 py-4 text-base text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm font-semibold text-brand-green">
              Spring spots are limited. Most requests are confirmed within 1 business day when availability is open.
            </p>
            <ul className="mt-8 grid gap-3 text-left max-w-2xl mx-auto text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Clears winter dog waste buildup
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Makes the yard easier to use again
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                One-time cleanup with clear time-based pricing
              </li>
            </ul>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
              {[
                "Starting at $60",
                "No recurring plan required",
                "Gate confirmation after service",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] px-4 py-3 font-semibold text-gray-700 shadow-[0_12px_30px_rgba(48,121,68,0.08)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="quote-form" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <div className="text-center mb-8">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Check Availability and Get Your Spring Cleanup Price
              </h2>
              <p className="text-lg text-gray-600">
                Enter your details, see the starting price, and request your cleanup before the next spring slot is gone.
              </p>
            </div>

            <div className="rounded-2xl border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(17,24,39,0.05)] md:p-8">
              {/* RESPONSIVE: keep the live price visible on mobile while users move between controls and the form fields. */}
              {/* RESPONSIVE: keep the pricing controls stacked first on mobile, then promote the price panel beside them at tablet widths. */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 md:col-span-1">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Frequency</p>
                    <div className="rounded-lg border border-brand-green bg-brand-green px-3 py-2 text-sm font-semibold text-white shadow-md">
                      One-Time Spring Cleanup
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Number of Dogs</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: '1', label: '1 Dog' },
                        { key: '2', label: '2 Dogs' },
                        { key: '3plus', label: '3+ Dogs' },
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
                      Yard Size (sq ft)
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
                      <div className="flex flex-col gap-2 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
                        <span className="font-semibold text-brand-green">
                          {yardSqft >= 10000 ? '10,000+ sq ft' : `${yardSqft.toLocaleString()} sq ft`}
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

                <div className="flex flex-col gap-4 md:col-span-2">
                  <div className="mx-auto w-full max-w-[26rem] rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-5 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                      {frequency === 'onetime' ? 'Spring Cleanup Estimate' : 'Estimated Per-Visit'}
                    </p>
                    <p className="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                      {frequency === 'onetime'
                        ? `${formatMoney(displayPrice)} / first 30 mins`
                        : `${formatMoney(displayPrice)}/visit`}
                    </p>
                    {frequency !== 'onetime' && (
                      <div className="mt-3 rounded-2xl bg-white/75 p-3 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                          Estimated monthly total
                        </p>
                        <p className="text-2xl font-extrabold text-brand-green sm:text-4xl">
                          {formatMoney(monthlyTotal)}
                          <span className="ml-1 text-lg font-semibold text-gray-600 sm:text-xl">/month</span>
                        </p>
                      </div>
                    )}
                    {frequency === 'onetime' && (
                      <p className="text-sm text-gray-600">
                        +$5 per additional 5-minute block.
                      </p>
                    )}
                    <p className="mt-3 text-sm font-semibold text-brand-green sm:text-base">
                      {pricingDetails.note}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#d7e6da] bg-white p-4 text-sm text-gray-600 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                    Starting at $60 for the first 30 minutes. Final pricing depends on yard size and number of dogs and is confirmed after review.
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 rounded-2xl border border-[#d7e6da] bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.05)]">
                    {bookingStatus !== 'success' && (
                      <>
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="website-field-spring">Leave this field empty</label>
                      <input
                        id="website-field-spring"
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
                        Check service area
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="postal-code" className="text-sm font-semibold text-gray-700">Postal code</label>
                        <input
                          id="postal-code"
                          type="text"
                          name="postalCode"
                          placeholder="J7E 1A1"
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
                            I agree to the{" "}
                            <Link href="/terms" className="font-semibold text-brand-green hover:underline">
                              Terms
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="font-semibold text-brand-green hover:underline">
                              Privacy Policy
                            </Link>{" "}
                            and allow Ca-Ca Canin to contact me about my quote request.
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
                        Check availability
                      </Button>
                      {postalStatus === 'valid' && (
                        <div className="text-sm text-brand-green" role="status" aria-live="polite">
                          We service that postal code. Continue to step 2.
                        </div>
                      )}
                      {postalStatus === 'invalid' && (
                        <div className="text-sm text-red-600" role="status" aria-live="polite">
                          {postalCode && !isCanadianPostalCode(postalCode)
                            ? 'Please enter a valid Canadian postal code.'
                            : <>Sorry, that postal code is outside our spring cleanup service area. We don&apos;t service your location? <Link href="/contact" className="font-semibold underline">Reach out to us</Link>.</>}
                        </div>
                      )}
                    </div>
                    {postalStatus === 'valid' && (
                      <>
                        {/* RESPONSIVE: collect lead details in one column on phones, then grow to multi-column layouts as space allows. */}
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          <div className="space-y-1">
                            <label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</label>
                            <input
                              id="name"
                              type="text"
                              name="name"
                              placeholder="Jane Doe"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              autoComplete="name"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone number</label>
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
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
                            <input
                              id="email"
                              type="email"
                              name="email"
                              placeholder="you@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              autoComplete="email"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                              required
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-brand-green hover:bg-brand-green-dark text-white text-lg py-3" disabled={bookingStatus === 'loading'}>
                          {bookingStatus === 'loading' ? 'Sending...' : 'Request My Spring Quote'}
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
                          We usually reply within 1 business day.
                        </p>
                      </>
                    )}
                      </>
                    )}
                    {bookingStatus === 'success' && (
                      <div id="spring-quote-thank-you" ref={quoteThankYouRef} tabIndex={-1} className="rounded-2xl border border-brand-green/20 bg-[#eef7f0] p-6 text-center shadow-[0_18px_45px_rgba(48,121,68,0.08)] outline-none">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Thank you</p>
                        <h3 className="mt-2 text-2xl font-bold text-gray-900">Your spring cleanup request is in.</h3>
                        <p className="mt-3 text-base text-gray-600">
                          We received your request and will follow up shortly. No need to send the form again.
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          Didn&apos;t receive it? Check your junk folder.
                        </p>
                        <p className="mt-4 text-sm text-brand-green">{bookingMessage}</p>
                      </div>
                    )}
                    {/* RESPONSIVE: keep the mobile estimate below the form steps so the flow stays linear on smaller screens. */}
                    {bookingStatus !== 'success' && (
                    <div className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-4 shadow-[0_14px_34px_rgba(48,121,68,0.12)] md:hidden">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                        {frequency === 'onetime' ? 'Spring Cleanup Estimate' : 'Live Price'}
                      </p>
                      <div className="mt-2 flex items-end justify-between gap-3">
                        <p className="min-w-[9rem] text-2xl font-extrabold tabular-nums text-gray-900">
                          {frequency === 'onetime'
                            ? `${formatMoney(displayPrice)}+`
                            : `${formatMoney(displayPrice)}/visit`}
                        </p>
                        {frequency !== 'onetime' && (
                          <p className="min-w-[7rem] text-right text-sm font-semibold tabular-nums text-brand-green">
                            {formatMoney(monthlyTotal)}/month
                          </p>
                        )}
                      </div>
                      {frequency === 'onetime' && (
                        <p className="mt-2 text-sm text-gray-600">
                          +$5 every additional 5 minutes after the first 30 minutes.
                        </p>
                      )}
                    </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                How it works
              </h2>
              <p className="text-lg text-gray-600">
                Fast quote, one-time cleanup, and no ongoing plan required to book a spring yard reset.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: ClipboardCheck, title: "Request a quote", desc: "Tell us your yard size and number of dogs." },
                { icon: PawPrint, title: "Confirm your visit", desc: "We review the details and schedule your cleanup." },
                { icon: Sparkles, title: "We clean the yard", desc: "We remove buildup and leave the space cleaner." },
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
                Why homeowners book now
              </h2>
              <p className="text-lg text-gray-600">
                Short proof points from people who wanted the yard reset quickly after winter.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] lg:col-span-2">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    5-star review
                  </div>
                  <CardTitle className="text-xl">Zander M.</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Wanted to share my experience with Micheal from Ca-Ca Canin, very professional, he came over to asses our lawn , which let me tell you was a doozy and a half to say the least , old tenants left garbage in thw yard the grass was almost 4 feet tall with random shrubs and over growth literally everywhere , yoy couldn&apos;t see the ground, they hadn&apos;t cleaned the yard in years there dog made basically a layer of poop , Micheal came out and meticulously lifted everything and got most of turd mines . For 80$ I couldn&apos;t have spent my money more wisely , I recommend Micheal to everyone who owns a dog and needs some help with their yard . KEEP IT UP MAN 💪💯
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Facebook recommendation
                  </div>
                  <CardTitle className="text-xl">Julie B.</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Excellent service provided by Michael Atallah. He shows up on time, professional and courteous. Very thorough inspection of the back lawn and pickup of our dog&apos;s poop. He also disposes the matter in an environmentally friendly way. I would definitely and highly recommend his services.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    5-star review
                  </div>
                  <CardTitle className="text-xl">Daniella H.</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Michael is fantastic! Super professional, clean, and his customer service is 100%. We hired Michael to clean our yard after a long winter and would do so again in a heartbeat! He offers a great service at a great price. Truly can&apos;t recommend him enough!
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Why Book Your Spring Cleanup With Ca-Ca Canin
              </h2>
              <p className="text-lg text-gray-600">
                A one-time pooper scooper visit that clears winter buildup without locking you into recurring service.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Heart, title: "Cleaner yard, less hassle", desc: "A focused cleanup that helps get your yard back into shape after winter." },
                  { icon: Camera, title: "Visit confirmation", desc: "We send confirmation after the cleanup is complete." },
                  { icon: ClipboardCheck, title: "Clear time-based pricing", desc: "Spring cleanup starts at $60 for the first 30 minutes, then $5 per additional 5 minutes." },
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
                Service area
              </h2>
              <p className="text-lg text-gray-600">
                Serving Laval plus select North Shore cities for one-time spring dog waste cleanup.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {SPRING_CLEANUP_LOCATIONS.map((location) => (
                <Link key={location.slug} href={`/spring-cleanup/${location.slug}`} className="block h-full">
                  <Card className="h-full border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                    <CardHeader className="items-center text-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-brand-green/15 bg-[#eef7f0]">
                        <MapPin className="h-7 w-7 text-brand-green" />
                      </div>
                      <CardTitle className="text-xl">{location.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Spring Cleanup FAQs
              </h2>
              <p className="text-lg text-gray-600">
                Answers about booking, pricing, and one-time yard cleanup service.
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

      <SiteFooter locale="en" />
    </div>
  )
}
