import type { Metadata } from "next"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "FAQ | Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
  description: "Answers to the most common questions about Ca-Ca Canin's dog waste removal service: pricing, scheduling, service area, contracts, and what happens after each visit.",
  alternates: {
    canonical: "/faq",
    languages: { en: "/faq", fr: "/fr/faq" },
  },
}

const faqs = [
  {
    q: "How much does recurring dog poop cleanup cost?",
    a: "Weekly service starts at $20 per visit for one dog in a standard yard. Pricing adjusts based on the number of dogs, yard size, and frequency. Use the calculator on the booking page to see your estimate.",
  },
  {
    q: "Do I need to sign a contract?",
    a: "No contract required. You can request service and adjust or cancel at any time by contacting our team.",
  },
  {
    q: "Do I need to be home during the visit?",
    a: "No. As long as we have access to your gate, we can complete the visit and send a confirmation with a gate photo afterward.",
  },
  {
    q: "What cities do you serve?",
    a: "We serve Laval and select North Shore cities including Blainville, Boisbriand, Bois-des-Filion, Deux-Montagnes, Lorraine, Mirabel, Oka, Pointe-Calumet, Rosemère, Saint-Eustache, Saint-Joseph-du-Lac, Sainte-Anne-des-Plaines, Sainte-Marthe-sur-le-Lac, and Sainte-Thérèse. Enter your postal code to confirm availability.",
  },
  {
    q: "Do you clean the whole yard?",
    a: "Yes. We clean the areas of your property where dog waste is present, including front, back, and side yards, plus dog runs and similar spaces.",
  },
  {
    q: "How is the waste disposed of?",
    a: "Waste is bagged and placed in your outdoor trash bin when available. If the bin is not accessible, disposal is handled based on the service arrangement.",
  },
  {
    q: "What happens after each visit?",
    a: "You receive a service confirmation, and we provide a gate photo after the visit so you always know the job was done.",
  },
  {
    q: "Is service available year-round?",
    a: "Yes. We offer dog waste removal service throughout the year, including winter conditions when cleanup is still accessible.",
  },
  {
    q: "What is spring cleanup and how is it different from regular service?",
    a: "Spring cleanup is a one-time deep-clean of your yard to remove the winter buildup of waste. It starts at $60 for the first 30 minutes, then $5 for every additional 5-minute increment. Regular recurring service keeps the yard maintained week after week.",
  },
  {
    q: "How quickly can I get started?",
    a: "Most requests are confirmed within 1 business day. Submit a quote request and our team will follow up to confirm your schedule.",
  },
]

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <SiteHeader locale="en" altHref="/fr/faq" ctaLabel="Check Availability" showAnnouncement />

      <main id="main-content" className="flex-grow pt-16">
        {/* Hero */}
        <section className="bg-[#eef7f0] px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-green">FAQ</p>
            <h1 className="mb-5 text-4xl font-bold text-gray-900 md:text-5xl">
              Questions about our service
            </h1>
            <p className="text-lg text-gray-600">
              Straight answers about pricing, scheduling, service area, and what to expect when you book.
            </p>
          </div>
        </section>

        {/* FAQ list */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#d7e6da] bg-white p-6 shadow-[0_14px_34px_rgba(17,24,39,0.05)]"
              >
                <h2 className="mb-2 text-lg font-bold text-gray-900">{faq.q}</h2>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Still have a question?</h2>
            <p className="mb-6 text-gray-600">
              Reach out directly — we respond quickly.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="rounded-full border-2 border-brand-green px-6 py-3 font-semibold text-brand-green hover:bg-[#eef7f0] transition-colors"
              >
                Contact us
              </Link>
              <Link
                href="/#quote-form"
                className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white hover:bg-brand-green-dark transition-colors"
              >
                Check Availability
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale="en" />
    </div>
  )
}
