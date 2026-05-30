'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteFooter from "@/components/site-footer"
import dynamic from 'next/dynamic'
import Link from "next/link"
import { useEffect, useRef } from "react"
import { CheckCircle2, Heart, Camera, Bell, ClipboardCheck, Tag, Sparkles } from 'lucide-react'
import SiteHeader from "@/components/site-header"

const RegularServiceCalculator = dynamic(() => import('@/components/regular-service-calculator'), { ssr: false })
const BeforeAfterGallery = dynamic(() => import('@/components/before-after-gallery'), { ssr: false })

export default function SpringIntoServicePage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const faqItems = [
    {
      q: "Who qualifies for the 50% off first cleaning?",
      a: "Any new customer signing up for at least one month of recurring service (weekly, bi-weekly, or monthly) qualifies for the discounted first cleaning.",
    },
    {
      q: "What is the discounted price?",
      a: "Your first cleaning is $30 for the first 30 minutes (regularly $60), then $2.50 per additional 5-minute block (regularly $5). The 50% discount applies to the full cleaning.",
    },
    {
      q: "Do I need a contract?",
      a: "No contract required. You commit to a minimum of 1 month of recurring service to unlock the promo, but there is no long-term obligation beyond that.",
    },
    {
      q: "When does the offer expire?",
      a: "The Spring Into Service promotion is valid until June 20, 2026. Requests must be submitted before that date.",
    },
  ];

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
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Skip to content
      </a>
      <SiteHeader locale="en" altHref="/fr/printemps-en-service" ctaLabel="Claim 50% Off" ctaHref="#calculator" showAnnouncement={false} />

      <main id="main-content" className="flex-grow scroll-mt-12 pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Service",
                  name: "Spring Into Service — Dog waste removal promo",
                  serviceType: "Dog poop cleanup",
                  provider: {
                    "@type": "LocalBusiness",
                    name: "Ca-Ca Canin",
                    telephone: "+1-438-880-8922",
                    url: "https://cacacanin.com/spring-into-service",
                  },
                  areaServed: [
                    "Laval, QC",
                    "Blainville, QC",
                    "Bois-des-Filion, QC",
                    "Boisbriand, QC",
                    "Deux-Montagnes, QC",
                    "Lorraine, QC",
                    "Mirabel, QC",
                    "Rosemere, QC",
                    "Saint-Eustache, QC",
                    "Sainte-Therese, QC",
                  ],
                },
                {
                  "@type": "Offer",
                  name: "50% off first dog waste cleaning",
                  description: "50% off the initial cleaning fee when signing up for recurring dog waste removal service.",
                  price: "30",
                  priceCurrency: "CAD",
                  validThrough: "2026-06-20",
                  seller: { "@type": "LocalBusiness", name: "Ca-Ca Canin" },
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
                },
              ],
            }),
          }}
        />

        {/* Hero */}
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-green/25 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
              Limited-Time Offer · Expires June 20, 2026
            </div>
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-6xl">
              Spring Into Service
            </h1>
            <p className="mb-6 text-lg text-gray-600 sm:text-xl md:text-2xl">
              Sign up for weekly, bi-weekly, or monthly service and your first cleaning drops from $60 to $30. No contract required.
            </p>
            <div className="mb-6 flex items-baseline justify-center gap-3">
              <span className="text-3xl font-semibold text-gray-400 line-through">$60</span>
              <span className="text-6xl font-extrabold text-brand-green">$30</span>
              <span className="text-lg text-gray-500">initial cleaning</span>
            </div>
            <div className="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center">
              <Button size="lg" className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#calculator">Claim My 50% Off</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-6 py-4 text-base text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm font-semibold text-brand-green">
              Offer valid until June 20, 2026. Minimum 1-month recurring commitment required.
            </p>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
              {[
                "50% off your first cleaning",
                "No contract required",
                "Starting at $20/visit after",
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

        {/* How It Works */}
        <section id="how-it-works" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                How it works
              </h2>
              <p className="text-lg text-gray-600">
                Three simple steps to a clean yard all season long.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: ClipboardCheck, title: "Use the calculator", desc: "Get your instant price estimate below. Select weekly, bi-weekly, or monthly to unlock the promo." },
                { icon: Tag, title: "Sign up for recurring service", desc: "Choose your frequency and commit to at least one month of recurring service." },
                { icon: Sparkles, title: "First cleaning at 50% off", desc: "Your initial visit drops from $60 to $30. We handle the rest on your schedule." },
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

        {/* Why Ca-Ca Canin */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Why Ca-Ca Canin
              </h2>
              <p className="text-lg text-gray-600">
                Local Laval service that shows up reliably so your yard stays clean all season.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: "Less hassle every week", desc: "Recurring cleanup takes one messy job off your schedule for good." },
                { icon: Camera, title: "Visit confirmation", desc: "We send a confirmation after each completed visit so you always know it’s done." },
                { icon: Bell, title: "Flexible frequency", desc: "Weekly, bi-weekly, or monthly. Adjust your schedule anytime." },
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

        {/* Reviews */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                What our customers say
              </h2>
              <p className="text-lg text-gray-600">
                Real reviews from dog owners across Laval and the North Shore.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] lg:col-span-2">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    5-star review
                  </div>
                  <CardTitle className="text-xl">Zander M. | Laval</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Wanted to share my experience with Micheal from Ca-Ca Canin, very professional, he came over to asses our lawn, which let me tell you was a doozy and a half to say the least. Old tenants left garbage in the yard the grass was almost 4 feet tall with random shrubs and overgrowth literally everywhere, you couldn&apos;t see the ground. Micheal came out and meticulously lifted everything and got most of the turd mines. For 80$ I couldn&apos;t have spent my money more wisely, I recommend Micheal to everyone who owns a dog and needs some help with their yard. KEEP IT UP MAN 💪💯
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    5-star review
                  </div>
                  <CardTitle className="text-xl">Julie B. | Laval</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Michael&apos;s attention to detail is one of his best attributes. He did a thorough job of cleaning up all the doggy poop from this past winter. His attitude is professional, efficient and personable. As a dog owner himself, he understands how much we love our fur babies AND keeping our environment clean. I highly recommend his services, and I will use him again.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    5-star review
                  </div>
                  <CardTitle className="text-xl">Daniella H. | Deux-Montagnes</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Michael is fantastic! Super professional, clean, and his customer service is 100%. We hired Michael to clean our yard after a long winter and would do so again in a heartbeat! He offers a great service at a great price. Truly can&apos;t recommend him enough!
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] lg:col-span-2">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    5-star review
                  </div>
                  <CardTitle className="text-xl">Mohamed L. | Boisbriand</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Service impeccable de Ca-Ca Canin. Rapide, professionnel et ma cour est redevenue parfaitement propre après leur passage. Ça enlève vraiment une grosse corvée quand on a un chien. Le prix est très raisonnable et le travail est très bien fait. Je recommande sans hésiter à tous les propriétaires de chiens. Service 5 étoiles.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <BeforeAfterGallery locale="en" />

        {/* Offer Details */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#eef7f0]">
          <div className="max-w-3xl mx-auto text-center scroll-animation">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-green">Offer details</p>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">What&apos;s included</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              First cleaning: $30 for the first 30 minutes (regularly $60), then $2.50 per additional 5-minute block (regularly $5). 50% off applies to the full cleaning. Valid with a minimum 1-month recurring service commitment. Offer expires June 20, 2026. Cannot be combined with other promotions. Ca-Ca Canin reserves the right to end the promotion early.
            </p>
            <ul className="mt-6 grid gap-3 text-left text-sm max-w-lg mx-auto text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                First 30 minutes at $30 (50% off regular $60 rate)
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                +$2.50 per additional 5-minute block (regularly $5) if the yard needs extra time
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                Requires sign-up for at least 1 month of recurring service
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                Valid until June 20, 2026
              </li>
            </ul>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="scroll-mt-16 py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Get Your Price &amp; Claim Your 50% Off
              </h2>
              <p className="text-lg text-gray-600">
                Select weekly, bi-weekly, or monthly to lock in 50% off your first cleaning.
              </p>
            </div>
            <div className="scroll-animation">
              <RegularServiceCalculator locale="en" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Frequently asked questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know about the Spring Into Service offer.
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

        {/* Cross-link to regular service */}
        <section className="bg-[#eef7f0] px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-green">Regular service</p>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Keep the yard clean all year</h2>
            <p className="mb-6 text-gray-600">
              After your discounted first visit, recurring service continues at standard rates starting at $20/visit.
            </p>
            <Link
              href="/dog-poop-cleanup"
              className="inline-flex items-center rounded-full bg-brand-green px-7 py-3 font-semibold text-white hover:bg-brand-green-dark transition-colors"
            >
              View regular service →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale="en" />
    </div>
  )
}
