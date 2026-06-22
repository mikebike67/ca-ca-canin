import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "About Ca-Ca Canin | Dog Waste Removal Laval & North Shore",
  description: "Ca-Ca Canin is a local dog waste removal service serving Laval and the North Shore. Learn who we are, why we started, and what makes us different.",
  alternates: {
    canonical: "/about",
    languages: { en: "/about", fr: "/fr/a-propos" },
  },
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <SiteHeader locale="en" altHref="/fr/a-propos" ctaLabel="Check Availability" />

      <main id="main-content" className="flex-grow pt-16">
        {/* Hero */}
        <section className="bg-[#eef7f0] px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-green">About Us</p>
            <h1 className="mb-5 text-4xl font-bold text-gray-900 md:text-5xl">
              We take care of the mess so you don't have to
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Ca-Ca Canin is a local dog waste removal service based in Laval, Quebec. We serve homeowners across Laval and select North Shore cities who want a clean, usable yard without doing the dirty work themselves.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Why Ca-Ca Canin exists</h2>
              <p className="mb-4 text-lg text-gray-700">
                We started this service because we kept hearing the same thing from local dog owners: the yard cleanup is the one chore that never gets done, and it makes the whole backyard feel off-limits.
              </p>
              <p className="mb-4 text-lg text-gray-700">
                Ca-Ca Canin was built to fix that. We provide fast, reliable, and affordable dog waste removal for homeowners in Laval and nearby North Shore cities. No complicated scheduling, no contracts, just a clean yard and one less thing to think about.
              </p>
              <p className="text-lg text-gray-700">
                Our service is built for families, busy professionals, and anyone who loves their dog but would rather spend their weekends doing something other than scooping.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/our dog waste renewal company.png"
                alt="Ca-Ca Canin team ready for a yard cleanup visit"
                width={800}
                height={600}
                loading="lazy"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">How we work</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Clear pricing",
                  body: "You see the price before you commit. No hidden fees, no surprises at the end of the month.",
                },
                {
                  title: "Proof of service",
                  body: "We send a gate photo after every visit so you always know the job was done.",
                },
                {
                  title: "No lock-in",
                  body: "Start, pause, or cancel at any time. We earn your business every visit.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]"
                >
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{v.title}</h3>
                  <p className="text-gray-600">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Ready to get started?</h2>
            <p className="mb-8 text-lg text-gray-600">
              Check availability in your area and get a quote in minutes. Most requests are confirmed within 1 business day.
            </p>
            <Link
              href="/#quote-form"
              className="inline-flex items-center rounded-full bg-brand-green px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-brand-green-dark transition-colors"
            >
              Check Availability
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale="en" />
    </div>
  )
}
