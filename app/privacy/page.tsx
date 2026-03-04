import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7faf7] px-4 py-16 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#d7e6da] bg-white p-8 shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
        <div className="mb-10 border-b border-[#d7e6da] pb-6">
          <Link href="/" className="text-sm font-semibold text-[#307944] hover:underline">
            Back to home
          </Link>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-gray-600">Last updated: March 1, 2026</p>
        </div>

        <div className="space-y-10 text-gray-700">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">What we collect</h2>
            <p>
              We may collect your name, email address, phone number, postal code, requested service details,
              and any other information you submit when you contact us or request a quote. If analytics tools
              are enabled, we may also collect basic website usage data such as device type, pages viewed,
              and general visit activity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">How we use your information</h2>
            <p>
              We use your information to provide quotes, schedule and deliver service, send updates,
              respond to questions, support customers, process payments when applicable, and improve the website
              and service operations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Consent and SMS</h2>
            <p>
              When you submit a form and check the consent box, you agree that Ca-Ca Canin may contact you by call,
              text, and email about your request, scheduling, and service updates. If text messaging is used, you may
              opt out by replying <span className="font-semibold">STOP</span>. Message and data rates may apply.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Cookies and analytics</h2>
            <p>
              We may use cookies or similar tools to remember site preferences, understand site usage, and improve
              performance. You can manage cookies through your browser settings, including blocking or deleting them.
              Some site features may not work as expected if cookies are disabled.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">How we share information</h2>
            <p>
              We may share information with service providers that help us operate the website or communication tools,
              including email, SMS, analytics, payment, hosting, or scheduling providers. We may also disclose information
              when required by law or when needed to protect our rights. We do not sell personal information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Retention</h2>
            <p>
              We keep personal information only as long as reasonably necessary for the purposes described in this
              policy, including customer service, legal, accounting, and recordkeeping needs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Security</h2>
            <p>
              We use reasonable administrative, technical, and organizational safeguards to protect personal information.
              No system is completely secure, so absolute security cannot be guaranteed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Privacy Contact</h2>
            <p>
              For Law 25 transparency and privacy questions, contact the person responsible for privacy matters at:
            </p>
            <p>Email: cacacaninqc@gmail.com</p>
            <p>Phone: 438 880 8922</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Your rights</h2>
            <p>
              Subject to applicable law, you may request access to your personal information, ask for corrections,
              or request deletion. To make a request, use the contact details on this page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Children</h2>
            <p>
              Our website and services are not directed to children, and we do not knowingly collect personal
              information from children.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Policy updates</h2>
            <p>
              We may update this Privacy Policy from time to time. Any updates will be posted on this page with
              a revised last updated date.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
