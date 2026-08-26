'use client'

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import Link from "next/link"
import dynamic from "next/dynamic"
import { CheckCircle2, MessageSquareHeart, CalendarClock, Camera, Bell } from "lucide-react"

const FreeTrialSignup = dynamic(() => import("@/components/free-trial-signup"), { ssr: false })
const TestimonialsCarousel = dynamic(() => import("@/components/testimonials-carousel"), { ssr: false })

export default function FreeTrialPage() {
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
        altHref="/fr/essai-gratuit"
        ctaLabel="Claim your spot"
        ctaHref="#signup"
      />

      <main id="main-content" className="flex-grow scroll-mt-12 pt-24">

        {/* Hero */}
        <section className="bg-white px-4 pt-12 pb-6 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 mb-5">
              Only 10 spots available
            </span>
            <h1 className="mb-5 text-3xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
              2 Weeks of Cleanup,<br />
              <span className="text-brand-green">On Us</span>
            </h1>
            <p className="mb-8 text-base text-gray-600 sm:text-xl md:text-2xl">
              We&rsquo;re picking 10 homeowners in Laval and the North Shore for a free 2-week trial, 1 visit a week, no cost. All we ask in return is honest feedback.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="#signup"
                data-cta="hero-signup"
                className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-6 sm:text-lg inline-flex items-center justify-center font-semibold transition-colors"
              >
                Claim your spot
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600">
              No cost. No obligation. Just your yard, cleaned, for 2 weeks.
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
          </div>
        </section>

        {/* Signup form */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-2xl mx-auto scroll-animation">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Reserve one of the 10 free spots
              </h2>
              <p className="text-gray-500">Tell us where to show up and we&rsquo;ll confirm your first visit.</p>
            </div>
            <FreeTrialSignup locale="en" />
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How the Trial Works</h2>
              <p className="text-xl text-gray-600">Three steps, two weeks, zero cost.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                { icon: MessageSquareHeart, title: "1. Sign Up", desc: "Fill in your details below. We confirm your spot and your first visit day." },
                { icon: CalendarClock, title: "2. We Visit Weekly", desc: "One full yard cleanup a week, for 2 weeks, completely free." },
                { icon: CheckCircle2, title: "3. Share Your Feedback", desc: "Tell us honestly how it went. No obligation to continue after the trial." },
              ].map((step, index) => (
                <Card key={step.title} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]" style={{ transitionDelay: `${index * 0.1}s` }}>
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

        {/* Reviews */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Current Customers Say</h2>
            </div>
            <TestimonialsCarousel locale="en" />
          </div>
        </section>

        {/* FAQ */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Questions About the Trial</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "What does this actually cost?", a: "Nothing. The trial is 2 full visits, 1 per week for 2 weeks, at no charge for the 10 homeowners we select." },
                { q: "Do I have to continue after the trial?", a: "No. There's no obligation to sign up for paid service afterward. We just ask for honest feedback either way." },
                { q: "What area is this for?", a: "Laval and the North Shore cities we already serve. If you're outside our service area we'll let you know." },
                { q: "What kind of feedback do you need?", a: "Just your honest experience, what worked, what didn't, and whether you'd recommend us. A short review helps the most." },
                { q: "How many spots are left?", a: "The counter above the signup form updates live. Once all 10 are claimed, new signups join a waitlist." },
              ].map((faq) => (
                <Card key={faq.q} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-brand-green/30 hover:shadow-[0_18px_45px_rgba(48,121,68,0.10)]">
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
