import Link from "next/link";
import LegalPageShell from "@/components/legal-page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Ca-Ca Canin",
  description: "Review the Ca-Ca Canin terms of service for dog waste removal in Laval and spring cleanup across Laval and select North Shore locations.",
  alternates: {
    canonical: "/terms",
    languages: {
      en: "/terms",
      fr: "/fr/terms",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service | Ca-Ca Canin",
    description: "Review the Ca-Ca Canin terms of service for dog waste removal in Laval and spring cleanup across Laval and select North Shore locations.",
    url: "https://cacacanin.com/terms",
    siteName: "Ca-Ca Canin",
    locale: "en_CA",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <LegalPageShell locale="en">
      <main className="bg-[#f7faf7] px-4 py-16 text-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#d7e6da] bg-white p-8 shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
        <div className="mb-10 border-b border-[#d7e6da] pb-6">
          <Link href="/" className="text-sm font-semibold text-[#307944] hover:underline">
            Back to home
          </Link>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-base text-gray-600">Last updated: March 1, 2026</p>
        </div>

        <div className="space-y-10 text-gray-700">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">About Ca-Ca Canin</h2>
            <p>
              Ca-Ca Canin provides dog waste removal in Laval, Quebec and spring cleanup in Laval plus select North Shore locations.
              These terms apply when you use our website, request a quote, or book service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Acceptance of terms</h2>
            <p>
              By using this website, requesting a quote, or booking service, you agree to these terms
              and our Privacy Policy. If you do not agree, do not use the site or submit a request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Service area</h2>
            <p>
              Our regular recurring service area is currently Laval, Quebec only, and those postal codes generally
              begin with <span className="font-semibold">H7</span>. Spring cleanup is also available in select North Shore
              postal code areas shown on the spring cleanup pages. We may refuse or cancel requests outside our listed service areas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Quotes and pricing</h2>
            <p>
              Any pricing calculator or website pricing is an estimate only. Final pricing is confirmed by
              Ca-Ca Canin before service.
            </p>
            <p>
              Spring cleanup pricing starts at <span className="font-semibold">$60 for the first 30 minutes</span>,
              plus <span className="font-semibold">$5 for each additional 5-minute increment</span>. Time is
              rounded down to the previous 5-minute mark. For example, a 54-minute visit is billed as 50 minutes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Access and safety requirements</h2>
            <p>
              You are responsible for providing safe yard access on the day of service. Gates must be
              unlockable or otherwise accessible, pets must be safely secured when needed, and you must
              tell us about any hazards we should know about, including aggressive animals, broken fencing,
              unsafe surfaces, debris, or sharp objects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Scheduling, rescheduling, and weather</h2>
            <p>
              We may adjust visit timing due to route changes, weather, safety conditions, or access issues.
              If a visit needs to be rescheduled, we will make reasonable efforts to notify you and arrange a new time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Cancellations and missed visits</h2>
            <p>
              If you need to cancel or reschedule, contact us as early as possible by phone or email.
              If we cannot access the yard at the scheduled time or conditions are unsafe, we may treat that
              as a missed visit and reschedule or charge for the reserved time, depending on the situation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Payment and recurring service</h2>
            <p>
              Recurring services may be billed on the schedule provided when you sign up. Applicable taxes may
              be added where required. Service is offered without long-term contracts, and you may cancel anytime
              by phone or email. Cancellation requests apply going forward and do not reverse completed services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Communications and SMS</h2>
            <p>
              By submitting a form and checking the consent box, you agree that Ca-Ca Canin may contact you by
              phone, text message, and email about your quote request, scheduling, service updates, and customer support.
              If text messaging is used, you may opt out by replying <span className="font-semibold">STOP</span>.
              Message and data rates may apply. We do not sell your personal information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Satisfaction guarantee</h2>
            <p>
              If you are not satisfied with a service, contact us within a reasonable time and we will review the issue
              and work with you on an appropriate solution.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Limitation of liability</h2>
            <p>
              To the fullest extent allowed by law, Ca-Ca Canin is not liable for indirect, incidental, special, or
              consequential damages. Our total liability for any claim relating to a service or website use will not
              exceed the amount you paid us for the service giving rise to the claim.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Website availability</h2>
            <p>
              This website is provided on an <span className="font-semibold">as is</span> and{" "}
              <span className="font-semibold">as available</span> basis. We do not guarantee uninterrupted access,
              error-free operation, or that all information will always be current.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Governing law</h2>
            <p>
              These terms are governed by the laws of Quebec and the laws of Canada that apply in Quebec.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
            <p>If you have questions about these terms, contact Ca-Ca Canin:</p>
            <p>Phone: 438 880 8922</p>
            <p>Email: cacacaninqc@gmail.com</p>
            <p>Laval, QC</p>
          </section>
        </div>
        </div>
      </main>
    </LegalPageShell>
  );
}
