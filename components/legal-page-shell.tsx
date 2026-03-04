import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LegalPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary">
          <Link href="/" className="flex min-w-0 items-center space-x-3">
            <img src="/images/cacacaninlogo.jpg" alt="Ca-Ca Canin logo" className="h-10 w-10" />
            <span className="text-lg font-bold text-[#307944] sm:text-2xl">CA-CA CANIN</span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <Link href="/" className="text-gray-700 transition-colors hover:text-[#307944]">
              Home
            </Link>
            <Link href="/#faq" className="text-gray-700 transition-colors hover:text-[#307944]">
              FAQ
            </Link>
            <Button size="lg" className="bg-[#307944] text-white hover:bg-[#307944]" asChild>
              <Link href="/#quote-form">Get a Quote</Link>
            </Button>
          </div>

          <Button size="sm" className="bg-[#307944] text-white hover:bg-[#307944] md:hidden" asChild>
            <Link href="/#quote-form">Quote</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 bg-white pt-16">{children}</main>

      <footer className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-8 text-center sm:grid-cols-2 sm:text-left xl:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center justify-center space-x-3 sm:justify-start">
                <img src="/images/cacacaninlogo.jpg" alt="Ca-Ca Canin logo" className="h-8 w-8" />
                <span className="text-lg font-bold text-[#307944] sm:text-xl">CA-CA CANIN</span>
              </div>
              <p className="text-gray-400">
                Dog waste removal and pooper scooper service for Laval homeowners.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Quick links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#quote-form" className="hover:text-white">
                    Get a Quote
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center justify-center gap-2 sm:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>Laval, QC</span>
                </li>
                <li className="flex items-center justify-center gap-2 sm:justify-start">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+14388808922" className="hover:text-white">
                    438 880 8922
                  </a>
                </li>
                <li className="flex items-center justify-center gap-2 sm:justify-start">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:cacacaninqc@gmail.com" className="break-all hover:text-white">
                    cacacaninqc@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 Ca-Ca Canin</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
