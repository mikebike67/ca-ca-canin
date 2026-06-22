'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteFooter from "@/components/site-footer"
import dynamic from 'next/dynamic'
import { REGULAR_SERVICE_LOCATIONS } from "@/lib/regular-service-area"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { CheckCircle2, Heart, Camera, Bell, ClipboardCheck, MapPin, PawPrint, Smartphone } from 'lucide-react'
import SiteHeader from "@/components/site-header"

const RegularServiceCalculator = dynamic(() => import('@/components/regular-service-calculator'), { ssr: false })
const BeforeAfterGallery = dynamic(() => import('@/components/before-after-gallery'), { ssr: false })
const ServiceAreaMap = dynamic(() => import('@/components/service-area-map'), { ssr: false })

export default function DogPoopCleanupPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const faqItems = [
    {
      q: "How much does recurring dog poop cleanup cost?",
      a: "Weekly service starts at $20/visit for one dog in a standard yard. Pricing adjusts based on dog count, yard size, and frequency. Use the calculator above to see your estimate.",
    },
    {
      q: "Do I need to sign a contract?",
      a: "No contract required. You can request service and adjust or cancel at any time.",
    },
    {
      q: "Do I need to be home?",
      a: "No. As long as we have gate access, we can complete the visit and send a confirmation afterward.",
    },
    {
      q: "How do you confirm the service area?",
      a: "Every request is checked by postal code before booking so availability is confirmed first.",
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
    <div className={`flex flex-col min-h-screen bg-white text-gray-900`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Skip to content
      </a>
      <SiteHeader locale="en" altHref="/fr/ramassage-dejections" ctaLabel="Get a Free Quote" />

      <main id="main-content" className="flex-grow scroll-mt-12 pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Service",
                  name: "Recurring dog poop cleanup",
                  serviceType: "Dog poop cleanup",
                  provider: {
                    "@type": "LocalBusiness",
                    name: "Ca-Ca Canin",
                    telephone: "+1-438-880-8922",
                    url: "https://cacacanin.com/dog-poop-cleanup",
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
                    "Sainte-Therese, QC",
                  ],
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

        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-brown font-semibold mb-3">
              Laval and North Shore, QC
            </p>
            <h1 className={`mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-6xl`}>
              DOG POOP CLEANUP IN LAVAL AND THE NORTH SHORE
            </h1>
            <p className="mb-6 text-lg text-gray-600 sm:text-xl md:text-2xl">
              Never deal with yard waste again. Recurring dog waste removal starting at $20/visit — weekly, biweekly, or monthly.
            </p>
            <div className="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center">
              <Button size="lg" className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#quote-form">Get My Free Quote</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-6 py-4 text-base text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm font-semibold text-brand-green">
              Route spots are limited. Most requests are confirmed within 1 business day when availability is open.
            </p>
            <ul className="mt-8 grid gap-3 text-left max-w-2xl mx-auto text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Weekly, biweekly, monthly, or one-time service
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Clear pricing based on yard size, dog count, and frequency
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Fast confirmation across the served locations
              </li>
            </ul>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
              {[
                "From $20/visit",
                "No contract required",
                "Visit confirmation after each visit",
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
            <RegularServiceCalculator locale="en" />
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900`}>
                How it works
              </h2>
              <p className="text-lg text-gray-600">
                Simple setup, recurring cleanup, and no ongoing effort required from you.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: ClipboardCheck, title: "Request a quote", desc: "Tell us your frequency, yard size, dog count, and postal code." },
                { icon: PawPrint, title: "Choose your schedule", desc: "We confirm your service area and lock in the best frequency for your yard." },
                { icon: Smartphone, title: "We keep the yard clean", desc: "Once booked, the service follows the selected schedule to prevent buildup." },
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
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900`}>
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
                    Wanted to share my experience with Micheal from Ca-Ca Canin, very professional, he came over to asses our lawn , which let me tell you was a doozy and a half to say the least , old tenants left garbage in thw yard the grass was almost 4 feet tall with random shrubs and over growth literally everywhere , yoy couldn&apos;t see the ground, they hadn&apos;t cleaned the yard in years there dog made basically a layer of poop , Micheal came out and meticulously lifted everything and got most of turd mines . For 80$ I couldn&apos;t have spent my money more wisely , I recommend Micheal to everyone who owns a dog and needs some help with their yard . KEEP IT UP MAN 💪💯
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
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
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
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Facebook recommendation
                  </div>
                  <CardTitle className="text-xl">Elisa A. | Laval</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    I recently had the pleasure of hiring a young entrepreneur who runs a dog waste removal service, and I couldn&apos;t be more impressed. He arrived right on time, was extremely professional, and got straight to work. Not only did he do a thorough and efficient job, but he also paid attention to detail and left my yard looking spotless. It&apos;s clear he takes pride in his work and is serious about his business. It&apos;s always great to support someone who is motivated and dependable, and he absolutely delivered on both. I would highly recommend Michael&apos;s services to anyone looking for a reliable and hassle-free solution for keeping their yard clean. Thank you !!!
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] lg:col-span-2">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Facebook recommendation
                  </div>
                  <CardTitle className="text-xl">Pete B. | Lorraine</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Very professional job. Winter snow just melted to reveal all of the winter&apos;s poop. Thankfully I was given Michael&apos;s number. He came super fast with all his equipment and in no time my yard was spotless.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Facebook recommendation
                  </div>
                  <CardTitle className="text-xl">Sylvain D. | Mirabel</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Excellent travail! Je recommande fortement!
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <BeforeAfterGallery locale="en" />

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900`}>
                Why book recurring service
              </h2>
              <p className="text-lg text-gray-600">
                Most quote requests are reviewed quickly and recurring service is confirmed within 1 business day when route space is available.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: "Less hassle every week", desc: "Recurring cleanup takes one messy job off your schedule for good." },
                { icon: Camera, title: "Visit confirmation", desc: "We send a confirmation after each completed visit." },
                { icon: Bell, title: "Flexible frequency", desc: "Choose weekly, biweekly, monthly, or one-time cleanup based on your yard." },
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

        <ServiceAreaMap locale="en" />

        <section id="faq" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900`}>
                Frequently asked questions
              </h2>
              <p className="text-lg text-gray-600">
                Answers about frequency, pricing, and the service area.
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
