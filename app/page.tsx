'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteFooter from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import dynamic from 'next/dynamic'
import { useEffect, useRef } from "react"
import { CheckCircle2, Shield, Heart, Bell, Camera, Smartphone, FileText } from 'lucide-react'
import SiteHeader from "@/components/site-header"

const RegularServiceCalculator = dynamic(() => import('@/components/regular-service-calculator'), { ssr: false })
const BeforeAfterGallery = dynamic(() => import('@/components/before-after-gallery'), { ssr: false })
const ServiceAreaMap = dynamic(() => import('@/components/service-area-map'), { ssr: false })

export default function Page() {
  const observerRef = useRef<IntersectionObserver | null>(null);

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
    <div className={`flex flex-col min-h-screen bg-white text-gray-900`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Skip to content
      </a>
      <SiteHeader locale="en" altHref="/fr" ctaLabel="Check Availability" showAnnouncement />

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
                <h1 className={`mb-5 text-3xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl`}>
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

        {/* Customer Promise Section */}
        {/* RESPONSIVE: add breathing room below the hero on mobile so the next section does not feel cramped. */}
        <section className="bg-white px-4 pb-16 pt-8 sm:px-6 sm:pt-0 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900`}>
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
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900`}>
                  Why Homeowners Call Us
                </h2>
                {/* RESPONSIVE: render the section image after the heading on mobile while preserving the desktop side-by-side layout. */}
                <Image
                  src="/images/our dog waste renewal company.png"
                  alt="Ca-Ca Canin team in a residential yard with cleanup tools and service truck"
                  width={1200}
                  height={900}
                  loading="lazy"
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
                  loading="lazy"
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
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900`}>
                  Keep Your Yard Clean Without Doing It Yourself
                </h2>
                {/* RESPONSIVE: render the section image after the heading on mobile while preserving the desktop side-by-side layout. */}
                <Image
                  src="/images/revised residential pooper scooper services.png"
                  alt="Residential pooper scooper team cleaning a backyard with a dog nearby"
                  width={1200}
                  height={900}
                  loading="lazy"
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
                  loading="lazy"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900`}>
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
        <ServiceAreaMap locale="en" />

        {/* FAQ Section */}
        <section id="faq" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900`}>
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
      <SiteFooter locale="en" />
    </div>
  )
}
