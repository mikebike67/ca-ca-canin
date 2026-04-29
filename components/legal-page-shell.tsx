'use client'

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteFooter from "@/components/site-footer";

export default function LegalPageShell({
  children,
  locale = "en",
}: {
  children: React.ReactNode;
  locale?: "en" | "fr";
}) {
  const isFrench = locale === "fr";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const copy = {
    home: isFrench ? "Accueil" : "Home",
    springCleanup: isFrench ? "Nettoyage printanier" : "Spring Cleanup",
    faq: "FAQ",
    contact: "Contact",
    language: isFrench ? "English" : "Francais",
    quote: isFrench ? "Obtenir un devis" : "Get a Quote",
    quoteShort: isFrench ? "Devis" : "Quote",
    navLabel: isFrench ? "Principal" : "Primary",
    promoHref: isFrench ? "/fr/nettoyage-printemps" : "/spring-cleanup",
    promoText: isFrench ? "Nettoyage de printemps a partir de 60 $ ->" : "Spring cleanup starting at $60 ->",
    homeHref: isFrench ? "/fr" : "/",
    springCleanupHref: isFrench ? "/fr/nettoyage-printemps" : "/spring-cleanup",
    faqHref: isFrench ? "/fr/faq" : "/faq",
    contactHref: isFrench ? "/fr/contact" : "/contact",
    languageHref: isFrench ? "/" : "/fr",
    quoteHref: isFrench ? "/fr#quote-form" : "/#quote-form",
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        {isFrench ? "Passer au contenu" : "Skip to content"}
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label={copy.navLabel}>
          <Link href={isFrench ? "/fr" : "/"} className="flex min-w-0 items-center space-x-3" onClick={closeMenu}>
            <Image src="/images/cacacaninlogo.jpg" alt="Ca-Ca Canin logo" width={40} height={40} className="h-10 w-10" />
            <span className="text-lg font-bold text-brand-green sm:text-2xl">CA-CA CANIN</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link href={copy.homeHref} className="text-gray-700 transition-colors hover:text-brand-green">
              {copy.home}
            </Link>
            <Link href={copy.springCleanupHref} className="text-gray-700 transition-colors hover:text-brand-green">
              {copy.springCleanup}
            </Link>
            <Link href={copy.faqHref} className="text-gray-700 transition-colors hover:text-brand-green">
              {copy.faq}
            </Link>
            <Link href={copy.contactHref} className="text-gray-700 transition-colors hover:text-brand-green">
              {copy.contact}
            </Link>
            <Link href={copy.languageHref} className="text-brand-brown transition-colors hover:text-brand-brown-light">
              {copy.language}
            </Link>
            <Button size="lg" className="bg-brand-green text-white hover:bg-brand-green-dark" asChild>
              <Link href={copy.quoteHref}>{copy.quote}</Link>
            </Button>
          </div>

          {/* Mobile: Quote CTA + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Button size="sm" className="bg-brand-green text-white hover:bg-brand-green-dark" asChild>
              <Link href={copy.quoteHref} onClick={closeMenu}>{copy.quoteShort}</Link>
            </Button>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        <Link
          href={copy.promoHref}
          className="block bg-brand-green px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm"
          onClick={closeMenu}
        >
          {copy.promoText}
        </Link>
      </header>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[96px] bottom-0 z-40 overflow-y-auto bg-white md:hidden">
          <nav className="flex flex-col divide-y divide-gray-100 px-4 py-2" aria-label={copy.navLabel}>
            <Link
              href={copy.homeHref}
              className="py-4 text-base font-semibold text-gray-800 hover:text-brand-green"
              onClick={closeMenu}
            >
              {copy.home}
            </Link>
            <Link
              href={copy.springCleanupHref}
              className="py-4 text-base font-semibold text-gray-800 hover:text-brand-green"
              onClick={closeMenu}
            >
              {copy.springCleanup}
            </Link>
            <Link
              href={copy.faqHref}
              className="py-4 text-base font-semibold text-gray-800 hover:text-brand-green"
              onClick={closeMenu}
            >
              {copy.faq}
            </Link>
            <Link
              href={copy.contactHref}
              className="py-4 text-base font-semibold text-gray-800 hover:text-brand-green"
              onClick={closeMenu}
            >
              {copy.contact}
            </Link>
            <Link
              href={copy.languageHref}
              className="py-4 text-base font-semibold text-brand-brown hover:text-brand-brown-light"
              onClick={closeMenu}
            >
              {copy.language}
            </Link>
            <div className="py-4">
              <Button className="w-full bg-brand-green text-white hover:bg-brand-green-dark" asChild>
                <Link href={copy.quoteHref} onClick={closeMenu}>{copy.quote}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}

      <main id="main-content" className="flex-1 bg-white pt-24">{children}</main>

      <SiteFooter locale={locale} />
    </div>
  );
}
