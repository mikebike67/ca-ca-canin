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
  { key: 'small', label: 'Small', detail: 'Up to 2,000 sq ft' },
  { key: 'medium', label: 'Medium', detail: '2,000 - 3,000 sq ft' },
  { key: 'large', label: 'Large', detail: '3,000+ sq ft' },
];

const frequencyNotes: Record<'weekly' | 'biweekly' | 'monthly' | 'onetime', string> = {
  weekly: "Perfect for keeping your yard consistently clean.",
  biweekly: "Great balance of price and convenience.",
  monthly: "Ideal for light maintenance.",
  onetime: "Includes up to 30 minutes. +$5 per extra 5 minutes.",
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
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Primary">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/images/cacacaninlogo.jpg" 
                alt="Ca-Ca Canin logo" 
                className="h-10 w-10"
              />
              <span className={`text-2xl font-bold text-brand-green ${montserrat.className}`}>
                CA-CA CANIN
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#services" className="text-gray-700 hover:text-brand-green transition-colors">Services</Link>
              <Link href="#about" className="text-gray-700 hover:text-brand-green transition-colors">About</Link>
              <Link href="#faq" className="text-gray-700 hover:text-brand-green transition-colors">FAQ</Link>
              <Link href="/fr" className="text-brand-brown hover:text-brand-brown/80 transition-colors">Français</Link>
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
                  Get a Quote
                </Link>
              </Button>
            </div>

            <button 
              className="md:hidden p-2"
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

          {isMenuOpen && (
            <div id="mobile-nav" className="md:hidden py-4 space-y-4">
              <Link href="#services" className="block text-gray-700 hover:text-brand-green">Services</Link>
              <Link href="#about" className="block text-gray-700 hover:text-brand-green">About</Link>
              <Link href="#faq" className="block text-gray-700 hover:text-brand-green">FAQ</Link>
              <Link href="/fr" className="block text-brand-brown hover:text-brand-brown/80">Français</Link>
              <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link
                  href="#quote-form"
                  data-cta="spring-quote"
                  onClick={() => handleCtaClick("mobile-quote")}
                >
                  Get a Quote
                </Link>
              </Button>
            </div>
          )}
        </nav>
        <Link
          href="/spring-cleanup"
          className="block bg-brand-green text-white text-center text-sm font-semibold py-2 px-4"
        >
          Spring cleanup starting at $60 →
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
              description: "Dog waste removal and pooper scooper services in Laval, Quebec.",
              areaServed: "Laval, QC",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Laval",
                addressRegion: "QC",
                addressCountry: "CA"
              },
              telephone: "438 880 8922",
              email: "cacacaninqc@gmail.com",
              serviceType: "Dog waste removal",
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
                    alt="Happy dog sitting in a clean yard"
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
                  Laval&apos;s Premier<br />
                  <span className="text-brand-green">Pooper Scooper Service</span>
                </h1>
                <p className="mb-8 max-w-3xl text-lg text-gray-600 sm:text-xl md:text-2xl lg:max-w-2xl">
                  Transparent pricing, flexible schedules, and a cleaner yard in no time.
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
                      Get a Quote
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-8 py-6 text-lg text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto"
                    asChild
                  >
                    <Link href="#services">Watch how it works</Link>
                  </Button>
                </div>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-gray-600 sm:flex-row sm:flex-wrap lg:justify-start">
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <CheckCircle2 className="h-4 w-4 text-brand-green" />
                    No contracts
                  </div>
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Camera className="h-4 w-4 text-brand-green" />
                    Gate photo after every visit
                  </div>
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Bell className="h-4 w-4 text-brand-green" />
                    Text updates before arrival
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
                Ca-Ca Canin Customer Promise
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="scroll-animation scroll-delay-1 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <CheckCircle2 className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Reliable, Hassle-Free Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Our reliable, hassle-free dog waste removal service ensures timely, efficient visits, leaving your yard pristine. Enjoy more time with your dog—let us handle the mess!
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="scroll-animation scroll-delay-2 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Shield className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Satisfaction Guaranteed</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    At Ca-Ca Canin, we guarantee your satisfaction with our Laval pooper scooper service. If you&apos;re not happy, we&apos;ll make it right—your happiness is our priority.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="scroll-animation scroll-delay-3 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Heart className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Health and Safety Commitment</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Ca-Ca Canin prioritizes health and safety by using sanitary practices and eco-friendly disposal methods, ensuring a clean, safe environment for Laval pets and families.
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
                  Our Dog Waste Removal Company
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  Ca-Ca Canin was founded with the goal of improving the lives of dog owners by offering high-quality dog waste removal services throughout Laval, Quebec. We&apos;re a new, locally-owned business dedicated to providing reliable, professional service to our community. Every customer matters to us, and we&apos;re committed to building trust through exceptional service and attention to detail.
                </p>
                <Button className="bg-brand-green hover:bg-brand-green-dark text-white">
                  Learn More
                </Button>
              </div>
              <div className="scroll-animation scroll-delay-1">
                <img 
                  src="/images/our dog waste renewal company.png" 
                  alt="Ca-Ca Canin team in a residential yard with cleanup tools and service truck" 
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
                  alt="Residential pooper scooper team cleaning a backyard with a dog nearby" 
                  className="rounded-lg shadow-lg w-full"
                  loading="lazy"
                />
              </div>
              <div className="scroll-animation order-1 md:order-2">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900 ${montserrat.className}`}>
                  Residential Pooper Scooper Services
                </h2>
                <ul className="space-y-4 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Flexible service options: weekly, bi-weekly, monthly, and one-time.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Personalized service with attention to detail for every customer.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Deodorizer services keep your yard smelling fresh and odor-free.</span>
                  </li>
                </ul>
                <Button className="bg-brand-green hover:bg-brand-green-dark text-white">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section id="quote-form" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <Link
              href="/spring-cleanup#quote-form"
              className="mb-6 flex flex-col gap-3 rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-5 text-left shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Need a one-time reset?</p>
                <p className="mt-1 text-xl font-bold text-gray-900">Looking for a spring cleanup instead?</p>
                <p className="mt-1 text-sm text-gray-600">Use the spring cleanup calculator for time-based pricing and one-time yard cleanup quotes.</p>
              </div>
              <span className="inline-flex max-w-fit items-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white">
                Go to spring cleanup
              </span>
            </Link>
            <div className="text-center mb-10">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Pricing Calculator
              </h2>
              <p className="text-lg text-gray-600">
                Estimate your per-visit and monthly price based on frequency, dogs, and yard size.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Frequency</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'weekly', label: 'Weekly' },
                        { key: 'biweekly', label: 'Bi-Weekly' },
                        { key: 'monthly', label: 'Monthly' },
                        { key: 'onetime', label: 'One-Time' },
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
                      Yard Size (sq ft)
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
                        <span className="font-semibold text-brand-green">{yardSqft.toLocaleString()} sq ft</span>
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
                      {frequency === 'onetime' ? 'Estimated Visit' : 'Estimated Per-Visit'}
                    </p>
                    <p className="mb-2 text-4xl font-extrabold text-gray-900">
                      {frequency === 'onetime'
                        ? `${formatMoney(displayPrice)} / first 30 mins`
                        : `${formatMoney(displayPrice)}/visit`}
                    </p>
                    {frequency !== 'onetime' && (
                      <div className="space-y-1 text-sm font-semibold text-gray-700">
                        <p>Estimated monthly total: {formatMoney(monthlyTotal)}/month</p>
                        <p>Pay annually: {formatMoney(yearlyTotal)}/year ({formatMoney(annualMonthlyEquivalent)}/month equivalent, 20% off)</p>
                      </div>
                    )}
                    {frequency === 'onetime' && (
                      <p className="text-sm text-gray-600">
                        +$5 per additional 5-minute block.
                      </p>
                    )}
                    <p className="mt-3 text-base font-semibold text-brand-green">
                      {pricingDetails.note}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#d7e6da] bg-white p-4 text-sm text-gray-600 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                    Exact pricing depends on yard size and number of dogs. Request a free quote for a personalized estimate.
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 rounded-2xl border border-[#d7e6da] bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.05)]">
                    {bookingStatus !== 'success' && (
                      <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white">1</span>
                        Check service area
                      </div>
                      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                        <div className="space-y-1">
                          <label htmlFor="postal-code" className="text-sm font-semibold text-gray-700">
                            Postal code
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
                          Check availability
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
                            I agree to the{" "}
                            <Link href="/terms" className="font-semibold text-brand-green hover:underline">
                              Terms
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="font-semibold text-brand-green hover:underline">
                              Privacy Policy
                            </Link>{" "}
                            and consent to be contacted about my request.
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
                          Great, we serve that Laval postal code. Continue to step 2.
                        </div>
                      )}
                      {postalStatus === 'invalid' && (
                        <div className="text-sm text-red-600" role="status" aria-live="polite">
                          {postalCode && !isCanadianPostalCode(postalCode)
                            ? 'Please enter a valid Canadian postal code.'
                            : 'Sorry, we currently only serve Laval, QC.'}
                        </div>
                      )}
                    </div>

                    {postalStatus === 'valid' && (
                      <>
                        <div className="space-y-3 border-t border-gray-200 pt-4">
                          <div className="hidden" aria-hidden="true">
                            <label htmlFor="website-field">Leave this field empty</label>
                            <input
                              id="website-field"
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
                            Contact information
                          </div>
                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            <div className="space-y-1">
                              <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Name
                              </label>
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
                              <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                                Phone number
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
                                Email
                              </label>
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
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-brand-green hover:bg-brand-green-dark text-white text-lg py-3"
                          disabled={bookingStatus === 'loading'}
                        >
                          {bookingStatus === 'loading' ? 'Sending...' : 'Get a Quote'}
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
                          We typically respond within 1 business day.
                        </p>
                      </>
                    )}
                      </>
                    )}
                    {bookingStatus === 'success' && (
                      <div className="rounded-2xl border border-brand-green/20 bg-[#eef7f0] p-6 text-center shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Thank you</p>
                        <h3 className="mt-2 text-2xl font-bold text-gray-900">Your quote request has been sent.</h3>
                        <p className="mt-3 text-base text-gray-600">
                          We received your details and will follow up shortly. You do not need to submit the form again.
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
                Why Choose Ca-Ca Canin?
              </h2>
              <p className="text-xl text-gray-600">
                When you hire Ca-Ca Canin as your Laval pooper scooper company, you can be confident you made the right decision with our 100% satisfaction guarantee.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: "Pet Safety", desc: "We clean all of our equipment and shoes with a kennel-grade disinfectant after every cleanup, minimizing the spread of germs and illness." },
                { icon: Smartphone, title: "Easy Scheduling", desc: "Book service, make updates, and ask questions directly with our team by phone or email." },
                { icon: FileText, title: "No Contracts", desc: "Enjoy the freedom of our flexible services without being tied down by any contracts, giving you the flexibility to start or stop whenever you need." },
                { icon: Camera, title: "Gate Photos", desc: "You will receive a reassuring snapshot of your closed gate after each service visit, giving you peace of mind as your furry friends venture back into their tidy yard." },
                { icon: Bell, title: "Notification Texts", desc: "We'll send you a notification text 60 minutes before we arrive and an email once the job is done, ensuring you're informed at every step of the process." },
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
                Pooper Scooper Locations
              </h2>
              <p className="text-xl text-gray-600">
                Ca-Ca Canin proudly services all of Laval, Quebec
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
                    Dog Waste Removal Services
                  </p>
                  <p className="text-gray-600">
                    Serving all neighborhoods throughout Laval, Quebec
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
                Frequently Asked Pooper Scooper Questions!
              </h2>
              <p className="text-xl text-gray-600">
                Get the answers to your pooper scooper service questions right here.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: "Does Ca-Ca Canin Clean the Entire Yard?", a: "Ca-Ca Canin will clean any areas of your property that have dog waste issues, including front, back, and side yards, flower beds, dog runs, etc." },
                { q: "Do you provide dog waste removal services all year round?", a: "Yes! Ca-Ca Canin provides dog waste removal services year-round in Laval. Even in the winter, we will still show up to provide services. In locations with snow, most of the waste that accumulates is still scoopable." },
                { q: "How do you ensure the safety of my dogs?", a: "The safety of our clients and their dogs is a top priority at Ca-Ca Canin. To ensure all dogs are safe, we clean all our equipment and shoes between each yard with a kennel-grade disinfectant to prevent the spread of germs. We also take gate pictures when we are done cleaning so you know your pets won't get out of the yard, and we ensure all our employees are background checked." },
                { q: "How much does it cost to hire a professional pooper scooper?", a: "Ca-Ca Canin has pooper scooper service plans starting as low as $60 per month. However, pricing is based on the size of the yard, service frequency, and number of dogs. Most of our clients end up paying between $95 and $135 per month." },
                { q: "Do I have to sign a contract for pooper scooper services?", a: "No contracts! You can start, pause, and cancel your service at any time by calling or emailing our team." },
                { q: "How do you dispose of the pet waste after each cleanup?", a: "We bag the waste and place it in the customer&apos;s outdoor trash bin for disposal. If the bin isn&apos;t accessible, we&apos;ll leave it neatly beside the bin location as arranged." },
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
          <div className="grid gap-8 md:grid-cols-5 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/images/cacacaninlogo.jpg" 
                  alt="Ca-Ca Canin logo" 
                  className="h-8 w-8"
                />
                <span className={`text-xl font-bold text-brand-green ${montserrat.className}`}>
                  CA-CA CANIN
                </span>
              </div>
              <p className="text-gray-400">
                Laval&apos;s premier pet waste removal pooper scooper service provider.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#services" className="hover:text-white">Residential</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#about" className="hover:text-white">About</Link></li>
                <li><Link href="#faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Get in touch</h3>
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
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 Ca-Ca Canin • Laval&apos;s premier pet waste removal pooper scooper service provider.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
