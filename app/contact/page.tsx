import Link from "next/link";
import type { Metadata } from "next";
import LegalPageShell from "@/components/legal-page-shell";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact | Ca-Ca Canin",
  description: "Contact Ca-Ca Canin for dog waste removal, spring cleanup, service-area questions, and quote requests in Laval and select North Shore locations.",
  alternates: {
    canonical: "/contact",
    languages: {
      en: "/contact",
      fr: "/fr/contact",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact | Ca-Ca Canin",
    description: "Contact Ca-Ca Canin for dog waste removal, spring cleanup, service-area questions, and quote requests in Laval and select North Shore locations.",
    url: "https://cacacanin.com/contact",
    siteName: "Ca-Ca Canin",
    locale: "en_CA",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <LegalPageShell locale="en">
      <div className="bg-[#f7faf7] px-4 py-16 text-gray-900 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl rounded-[2rem] border border-[#d7e6da] bg-white p-8 shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#724420]">
            Laval and North Shore, QC
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Contact Ca-Ca Canin
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
            Reach out for quotes, service-area questions, spring cleanup requests, or help with a postal code that falls outside the current booking form.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="tel:+14388808922" className="inline-flex items-center justify-center rounded-full bg-[#307944] px-6 py-3 text-sm font-semibold text-white hover:bg-[#256336]">
              Call 438 880 8922
            </a>
            <a href="mailto:cacacaninqc@gmail.com" className="inline-flex items-center justify-center rounded-full border border-[#307944] px-6 py-3 text-sm font-semibold text-[#307944] hover:bg-[#eef7f0]">
              Email us
            </a>
          </div>
        </section>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          <section className="rounded-[1.75rem] border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
            <h2 className="text-2xl font-bold text-gray-900">Phone</h2>
            <p className="mt-3 text-gray-600">The fastest way to confirm service availability or ask about a quote.</p>
            <p className="mt-4">
              <a href="tel:+14388808922" className="font-semibold text-[#307944] hover:underline">
                438 880 8922
              </a>
            </p>
          </section>

          <section className="rounded-[1.75rem] border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
            <h2 className="text-2xl font-bold text-gray-900">Email</h2>
            <p className="mt-3 text-gray-600">Best for quote details, service-area questions, or follow-up after a form submission.</p>
            <p className="mt-4">
              <a href="mailto:cacacaninqc@gmail.com" className="font-semibold text-[#307944] hover:underline">
                cacacaninqc@gmail.com
              </a>
            </p>
          </section>

          <section className="rounded-[1.75rem] border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
            <h2 className="text-2xl font-bold text-gray-900">Service area</h2>
            <p className="mt-3 text-gray-600">
              Regular dog waste removal is focused on Laval. Spring cleanup also covers select North Shore locations shown on the dedicated service pages.
            </p>
          </section>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-[#d7e6da] bg-white p-8 shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
          <div className="mb-6 border-b border-[#d7e6da] pb-6">
            <Link href="/" className="text-sm font-semibold text-[#307944] hover:underline">
              Back to home
            </Link>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Need help outside the form?
            </h2>
            <p className="mt-3 text-base text-gray-600">
              If your postal code is outside the current service area, or if you want to confirm whether we can help,
              contact us directly and we will review your request.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <ContactForm locale="en" />
        </div>
      </div>
    </LegalPageShell>
  );
}
