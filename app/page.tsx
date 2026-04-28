'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteFooter from "@/components/site-footer"
import RegularServiceCalculator from "@/components/regular-service-calculator"
import { calculateBookingPrice, getMonthlyVisits, getYardCategory, isCanadianPostalCode, normalizePostalCode, type DogCount, type ServiceFrequency, type YardCategory } from "@/lib/booking"
import { REGULAR_SERVICE_LOCATIONS } from "@/lib/regular-service-area"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { Montserrat } from 'next/font/google'
import { CheckCircle2, Shield, Heart, Bell, Camera, Smartphone, FileText, MapPin, ChevronDown } from 'lucide-react'
import BeforeAfterGallery from "@/components/before-after-gallery"

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
  weekly: "Best for keeping your yard clean week after week.",
  biweekly: "A practical balance of price and upkeep.",
  monthly: "A simple option for lighter maintenance.",
  onetime: "Includes up to 30 minutes. Add $5 for each extra 5 minutes.",
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;
const isRegularServicePostalCode = (value: string) =>
  REGULAR_SERVICE_LOCATIONS.some((location) =>
    location.fsaPrefixes.some((prefix) => normalizePostalCode(value).startsWith(prefix))
  );

export default function Page() {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const quoteThankYouRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [frequency, setFrequency] = useState<ServiceFrequency>('weekly');
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
  const [selectedServiceLocation, setSelectedServiceLocation] = useState(REGULAR_SERVICE_LOCATIONS[0]?.slug ?? 'laval');
  const [selectedHeaderLocation, setSelectedHeaderLocation] = useState(REGULAR_SERVICE_LOCATIONS[0]?.slug ?? 'laval');

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
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
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

    if (!isRegularServicePostalCode(normalized)) {
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

    if (!isCanadianPostalCode(postalCode) || !isRegularServicePostalCode(postalCode)) {
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
          locale: 'en',
          postalCode: normalizePostalCode(postalCode),
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
              <Link href="#about" className="text-gray-700 hover:text-brand-green transition-colors">About</Link>
              <Link href="#faq" className="text-gray-700 hover:text-brand-green transition-colors">FAQ</Link>
              <Link href="/contact" className="text-gray-700 hover:text-brand-green transition-colors">Contact</Link>
              <div className="group relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-gray-700 transition-colors hover:text-brand-green"
                  aria-label="Browse served locations"
                >
                  <span>Locations</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="invisible absolute left-0 top-full z-50 mt-3 w-64 max-h-[21rem] overflow-y-auto rounded-2xl border border-[#d7e6da] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(17,24,39,0.08)] transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {REGULAR_SERVICE_LOCATIONS.map((location) => (
                    <Link
                      key={location.slug}
                      href={`/dog-poop-cleanup/${location.slug}`}
                      className="block rounded-xl px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-[#eef7f0] hover:text-brand-green"
                    >
                      {location.name}
                    </Link>
                  ))}
                  <Link
                    href="/dog-poop-cleanup"
                    className="block rounded-xl border-t border-gray-100 px-4 py-3 text-sm font-semibold text-brand-green transition-colors hover:bg-[#eef7f0]"
                  >
                    See all locations →
                  </Link>
                </div>
              </div>
              <Link href="/fr" className="text-brand-brown hover:text-brand-brown/80 transition-colors">Français</Link>
              <Button
                size="lg"
                className="bg-brand-green hover:bg-brand-green-dark text-white"
                asChild
              >
                  <Link
                      href="#quote-form"
                      data-cta="spring-quote"
                    >
                      Check Availability
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
              <Link href="#about" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">About</Link>
              <Link href="#faq" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">FAQ</Link>
              <Link href="/contact" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">Contact</Link>
              <div className="py-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Locations</label>
                <select
                  value={selectedHeaderLocation}
                  onChange={(e) => {
                    setSelectedHeaderLocation(e.target.value);
                    router.push(`/dog-poop-cleanup/${e.target.value}`);
                    setIsMenuOpen(false);
                  }}
                  className="h-11 w-full rounded-xl border border-[#d7e6da] px-3 text-sm text-gray-700"
                >
                  {REGULAR_SERVICE_LOCATIONS.map((location) => (
                    <option key={location.slug} value={location.slug}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <Link href="/fr" className="block rounded-md py-2 text-brand-brown hover:text-brand-brown/80">Français</Link>
              <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link
                  href="#quote-form"
                  data-cta="spring-quote"
                >
                  Check Availability
                </Link>
              </Button>
            </div>
          )}
        </nav>
        {/* RESPONSIVE: keep the announcement bar readable without overpowering the header on small screens. */}
        <Link
          href="/spring-cleanup"
          className="block bg-brand-green px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm"
        >
          Spring cleanup starting at $60 →
        </Link>
      </header>

      <main id="main-content" className="flex-grow scroll-mt-12 pt-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "LocalBusiness",
                  "@id": "https://cacacanin.com/#business",
                  name: "Ca-Ca Canin",
                  url: "https://cacacanin.com/",
                  image: "https://cacacanin.com/images/cacacaninlogo.jpg",
                  logo: "https://cacacanin.com/images/cacacaninlogo.jpg",
                  description: "Dog waste removal and pooper scooper service in Laval and select North Shore locations in Quebec.",
                  areaServed: [
                    { "@type": "City", name: "Laval" },
                    { "@type": "AdministrativeArea", name: "North Shore, QC" }
                  ],
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Laval",
                    addressRegion: "QC",
                    addressCountry: "CA"
                  },
                  telephone: "+1-438-880-8922",
                  email: "cacacaninqc@gmail.com",
                  priceRange: "$$"
                },
                {
                  "@type": "Service",
                  serviceType: "Dog waste removal",
                  provider: {
                    "@id": "https://cacacanin.com/#business"
                  },
                  areaServed: [
                    {
                      "@type": "City",
                      name: "Laval"
                    },
                    {
                      "@type": "AdministrativeArea",
                      name: "North Shore, QC"
                    }
                  ],
                  offers: {
                    "@type": "Offer",
                    availability: "https://schema.org/InStock"
                  }
                }
              ]
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
                  <Image
                    src="/images/hero-dog.png"
                    alt="Happy dog sitting in a clean yard"
                    width={1200}
                    height={1200}
                    priority
                    sizes="(min-width: 1024px) 34rem, 0px"
                    className="relative z-10 mx-auto h-auto w-full max-w-[21rem] -translate-y-6 object-contain sm:max-w-[30rem] sm:-translate-y-8 lg:max-w-[34rem] lg:-translate-y-10"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 z-20 h-14 bg-white sm:h-16 lg:h-20"
                    style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }}
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h1 className={`mb-5 text-3xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl ${montserrat.className}`}>
                  Dog waste removal in
                  <br />
                  <span className="text-brand-green">Laval and the North Shore</span>
                </h1>
                <p className="mb-8 max-w-3xl text-base text-gray-600 sm:text-xl md:text-2xl lg:max-w-2xl">
                  Get clear pricing, fast quotes, and regular dog poop cleanup across Laval and the North Shore. Choose your location, check availability, and stop letting the mess pile up.
                </p>
                {/* RESPONSIVE: keep CTA buttons full-width on phones so they are easy to tap. */}
                <div className="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center lg:justify-start">
                  <Button
                    size="lg"
                    className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                    asChild
                  >
                    <Link
                      href="#quote-form"
                      data-cta="spring-quote"
                    >
                      Check Availability
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-6 py-4 text-base text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                    asChild
                  >
                    <Link href="/spring-cleanup">
                      Book Spring Cleanup
                    </Link>
                  </Button>
                </div>
                <p className="mt-3 text-sm font-medium text-gray-600 lg:max-w-md">
                  No contract. No back-and-forth. Just a quick quote and a clean yard.
                </p>
                <p className="mt-2 text-sm font-semibold text-brand-green lg:max-w-md">
                  Spring spots are limited. Most requests are confirmed within 1 business day.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-gray-600 sm:flex-row sm:flex-wrap lg:justify-start">
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <CheckCircle2 className="h-4 w-4 text-brand-green" />
                    No contracts
                  </div>
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Camera className="h-4 w-4 text-brand-green" />
                    Gate photo sent
                  </div>
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Bell className="h-4 w-4 text-brand-green" />
                    Arrival text
                  </div>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-3 lg:max-w-2xl">
                  {[
                    "Laval and North Shore service",
                    "Usually replies within 1 business day",
                    "Gate photo after each visit",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] px-4 py-3 text-sm font-semibold text-gray-700 shadow-[0_12px_30px_rgba(48,121,68,0.08)]"
                    >
                      {item}
                    </div>
                  ))}
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
                What You Get Instead of Another Messy Weekend
              </h2>
            </div>
            {/* RESPONSIVE: cards stay single-column until medium screens to avoid cramped content. */}
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              <Card className="scroll-animation scroll-delay-1 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <CheckCircle2 className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Stop Stepping In It</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    You stop checking the yard before every dog walk, and we take the cleanup off your list.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="scroll-animation scroll-delay-2 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Shield className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Simple, Fast, Local Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Ask for a quote, get a fast answer, and start service without a long-term commitment.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="scroll-animation scroll-delay-3 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Heart className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">A Yard You Actually Want to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Your lawn stops smelling like a chore, and your backyard feels usable again.
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
                  Why Homeowners Call Us
                </h2>
                {/* RESPONSIVE: render the section image after the heading on mobile while preserving the desktop side-by-side layout. */}
                <Image
                  src="/images/our dog waste renewal company.png"
                  alt="Ca-Ca Canin team in a residential yard with cleanup tools and service truck"
                  width={1200}
                  height={900}
                  sizes="(max-width: 767px) 100vw, 0px"
                  className="mb-6 rounded-lg shadow-lg w-full md:hidden"
                />
                <p className="text-lg text-gray-700 mb-4">
                  Ca-Ca Canin is for homeowners across Laval and the North Shore who are tired of the smell, tired of the mess, and tired of spending their own time cleaning up after the dog.
                </p>
                <p className="text-lg text-gray-700">
                  You get a local team, clear pricing, and a simple way to keep the yard ready for kids, guests, and everyday use.
                </p>
              </div>
              <div className="scroll-animation scroll-delay-1 order-1 hidden md:order-2 md:block">
                <Image
                  src="/images/our dog waste renewal company.png"
                  alt="Ca-Ca Canin team in a residential yard with cleanup tools and service truck"
                  width={1200}
                  height={900}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <BeforeAfterGallery locale="en" />

        {/* Residential Services */}
        <section id="services" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* RESPONSIVE: keep the service image/text pair balanced as the layout collapses to one column. */}
            <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="scroll-animation order-2 md:order-2">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900 ${montserrat.className}`}>
                  Keep Your Yard Clean Without Doing It Yourself
                </h2>
                {/* RESPONSIVE: render the section image after the heading on mobile while preserving the desktop side-by-side layout. */}
                <Image
                  src="/images/revised residential pooper scooper services.png"
                  alt="Residential pooper scooper team cleaning a backyard with a dog nearby"
                  width={1200}
                  height={900}
                  sizes="(max-width: 767px) 100vw, 0px"
                  className="mb-6 rounded-lg shadow-lg w-full md:hidden"
                />
                <ul className="space-y-4 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Choose the schedule that keeps the mess from piling up.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>We clean the spots your dog uses most, so you do not have to think about it.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Book one-time or recurring cleanup with a local service that actually shows up across Laval and the North Shore.</span>
                  </li>
                </ul>
              </div>
              <div className="scroll-animation scroll-delay-1 order-1 hidden md:order-1 md:block">
                <Image
                  src="/images/revised residential pooper scooper services.png"
                  alt="Residential pooper scooper team cleaning a backyard with a dog nearby"
                  width={1200}
                  height={900}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="quote-form" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <RegularServiceCalculator locale="en" />

            <Link
              href="/spring-cleanup#quote-form"
              className="mt-6 flex flex-col gap-3 rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-5 text-left shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Spring cleanup</p>
                <p className="mt-1 text-xl font-bold text-gray-900">If winter left your yard a mess, book the reset now.</p>
                <p className="mt-1 text-sm text-gray-600">Starting at $60. No recurring plan required. Most spring requests are confirmed within 1 business day.</p>
              </div>
              <span className="inline-flex max-w-fit items-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white">
                Book spring cleanup
              </span>
            </Link>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900 ${montserrat.className}`}>
                Why Homeowners Stick With Us
              </h2>
              <p className="text-xl text-gray-600">
                Built for homeowners who want the smell gone, the mess gone, and one less thing to worry about.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                { icon: Heart, title: "Built for Busy Families", desc: "We clean carefully so your yard feels ready for kids, pets, and guests again." },
                { icon: Smartphone, title: "Fast, Local Communication", desc: "Ask for a quote, book service, and get answers without waiting around." },
                { icon: FileText, title: "No Long-Term Lock-In", desc: "Start when you need it and stop when you do not. Simple." },
                { icon: Camera, title: "Gate Photos", desc: "See the proof after each visit so you know the job was done." },
                { icon: Bell, title: "Arrival Updates", desc: "Know when we are coming so you are not left wondering." },
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
                Service Area
              </h2>
              <p className="text-xl text-gray-600">
                Regular dog poop cleanup is now available across Laval and the same North Shore cities already served for spring cleanup: Blainville, Boisbriand, Bois-des-Filion, Deux-Montagnes, Lorraine, Mirabel, Oka, Pointe-Calumet, Rosemère, Saint-Eustache, Saint-Joseph-du-Lac, Sainte-Anne-des-Plaines, Sainte-Marthe-sur-le-Lac, and Sainte-Thérèse.
              </p>
            </div>
            <div className="max-w-3xl mx-auto scroll-animation">
              <Card className="border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-brand-green/15 bg-[#eef7f0]">
                    <MapPin className="h-8 w-8 text-brand-green" />
                  </div>
                  <CardTitle className="text-2xl">Browse served locations</CardTitle>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Choose a city to open its local regular-service page and confirm that the area is now covered.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <select
                      value={selectedServiceLocation}
                      onChange={(e) => setSelectedServiceLocation(e.target.value)}
                      className="h-12 rounded-xl border border-[#d7e6da] px-4 text-base text-gray-900"
                    >
                      {REGULAR_SERVICE_LOCATIONS.map((location) => (
                        <option key={location.slug} value={location.slug}>
                          {location.name}, QC
                        </option>
                      ))}
                    </select>
                    <Button className="h-12 bg-brand-green text-white hover:bg-brand-green-dark" asChild>
                      <Link href={`/dog-poop-cleanup/${selectedServiceLocation}`}>View local page</Link>
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Currently serving {REGULAR_SERVICE_LOCATIONS.map((location) => location.name).join(", ")}.
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
                Questions Homeowners Ask Before They Book
              </h2>
              <p className="text-xl text-gray-600">
                Straight answers about pricing, scheduling, and what happens when you book.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: "Do you clean the whole yard?", a: "Yes. We clean the areas of your property where dog waste is present, including front, back, and side yards, plus dog runs and similar spaces." },
                { q: "Do you offer service year-round?", a: "Yes. Ca-Ca Canin offers dog waste removal service throughout Laval and the served North Shore cities year-round, including winter conditions when cleanup is still accessible." },
                { q: "How is pricing calculated?", a: "Pricing depends on yard size, service frequency, and the number of dogs. Use the calculator for an estimate, then request a quote for final pricing." },
                { q: "Do I need a contract?", a: "No. You can start, pause, or cancel service by contacting our team." },
                { q: "What happens after each visit?", a: "You receive service confirmation, and we can provide a gate photo after the visit." },
                { q: "How is the waste disposed of?", a: "Waste is bagged and placed in the outdoor trash bin when available. If the bin is not accessible, disposal is handled based on the service arrangement." },
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
      <SiteFooter locale="en" isHome />
    </div>
  )
}
