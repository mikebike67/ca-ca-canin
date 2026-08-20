'use client'

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { CheckCircle2, Shield, Heart, Bell, Camera, Smartphone, FileText } from "lucide-react"

const FreeCleanupCalculator = dynamic(() => import("@/components/free-cleanup-calculator"), { ssr: false })
const TestimonialsCarousel = dynamic(() => import("@/components/testimonials-carousel"), { ssr: false })

export default function FreeFirstCleanupPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in")
        })
      },
      { threshold: 0.1, rootMargin: "50px" },
    )
    document.querySelectorAll(".scroll-animation").forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Skip to content
      </a>
      <SiteHeader
        locale="en"
        altHref="/fr/nettoyage-gratuit"
        ctaLabel="Get your free cleanup"
        ctaHref="#calculator"
      />

      <main id="main-content" className="flex-grow scroll-mt-12 pt-24">

        {/* Hero */}
        <section className="bg-white px-4 pt-12 pb-6 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 mb-5">
              Limited Time Offer · Expires September 30, 2026
            </span>
            <h1 className="mb-5 text-3xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
              Your First Cleanup<br />
              <span className="text-brand-green">Is Free</span>
            </h1>
            <p className="mb-8 text-base text-gray-600 sm:text-xl md:text-2xl">
              Sign up for weekly or bi-weekly recurring dog waste removal and we&rsquo;ll do your first yard cleanup at no charge.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                asChild
              >
                <Link href="#calculator" data-cta="hero-quote">Get your free cleanup</Link>
              </Button>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600">
              No contract. Quick quote. Clean yard.
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-green">
              Most requests are confirmed within 1 business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green" />
                No contracts
              </div>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-brand-green" />
                Gate photo sent
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-brand-green" />
                Arrival text
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto">
              {["Laval and North Shore service", "Usually replies within 1 business day", "Gate photo after each visit"].map((item) => (
                <div key={item} className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] px-4 py-3 text-sm font-semibold text-gray-700 shadow-[0_12px_30px_rgba(48,121,68,0.08)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                See your price and claim your free visit
              </h2>
              <p className="text-gray-500">Fill in your details and we&rsquo;ll be in touch within 1 business day.</p>
            </div>
            <FreeCleanupCalculator locale="en" />
          </div>
        </section>

        {/* Customer Promise */}
        <section className="bg-white px-4 pb-16 pt-8 sm:px-6 sm:pt-0 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                What You Get Instead of Another Messy Weekend
              </h2>
            </div>
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

        {/* Testimonials */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <TestimonialsCarousel locale="en" />
          </div>
        </section>

        {/* About */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="scroll-animation order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Why Homeowners Call Us</h2>
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

        {/* Residential Services */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="scroll-animation order-2 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Keep Your Yard Clean Without Doing It Yourself
                </h2>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Homeowners Stick With Us</h2>
              <p className="text-xl text-gray-600">
                Built for homeowners who want the smell gone, the mess gone, and one less thing to worry about.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                { icon: Heart,       title: "Built for Busy Families",        desc: "We clean carefully so your yard feels ready for kids, pets, and guests again." },
                { icon: Smartphone,  title: "Fast, Local Communication",       desc: "Ask for a quote, book service, and get answers without waiting around." },
                { icon: FileText,    title: "No Long-Term Lock-In",            desc: "Start when you need it and stop when you do not. Simple." },
                { icon: Camera,      title: "Gate Photos",                     desc: "See the proof after each visit so you know the job was done." },
                { icon: Bell,        title: "Arrival Updates",                 desc: "Know when we are coming so you are not left wondering." },
              ].map((feature, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]" style={{ transitionDelay: `${index * 0.1}s` }}>
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

        {/* FAQ */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Questions Homeowners Ask Before They Book
              </h2>
              <p className="text-xl text-gray-600">
                Straight answers about pricing, scheduling, and what happens when you book.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: "How does the free first cleanup work?", a: "When you sign up for weekly or bi-weekly recurring service, your first yard cleanup is completely free. No hidden fees. Just sign up, confirm your schedule, and we do the first visit at no charge." },
                { q: "Do you clean the whole yard?", a: "Yes. We clean the areas of your property where dog waste is present, including front, back, and side yards, plus dog runs and similar spaces." },
                { q: "Do you offer service year-round?", a: "Yes. Ca-Ca Canin offers dog waste removal service throughout Laval and the served North Shore cities year-round, including winter conditions when cleanup is still accessible." },
                { q: "How is pricing calculated?", a: "Pricing depends on yard size, service frequency, and the number of dogs. Use the calculator above for an estimate, then request a quote for final pricing." },
                { q: "Do I need a contract?", a: "No. You can start, pause, or cancel service by contacting our team." },
                { q: "What happens after each visit?", a: "You receive service confirmation, and we can provide a gate photo after the visit." },
              ].map((faq, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-brand-green/30 hover:shadow-[0_18px_45px_rgba(48,121,68,0.10)]" style={{ transitionDelay: `${index * 0.05}s` }}>
                  <CardHeader><CardTitle className="text-lg">{faq.q}</CardTitle></CardHeader>
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
