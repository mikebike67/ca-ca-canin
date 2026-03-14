import Link from "next/link";
import Image from "next/image";
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
    faqHref: isFrench ? "/fr#faq" : "/#faq",
    contactHref: isFrench ? "/fr/contact" : "/contact",
    languageHref: isFrench ? "/" : "/fr",
    quoteHref: isFrench ? "/fr#quote-form" : "/#quote-form",
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#724420] shadow"
      >
        {isFrench ? "Passer au contenu" : "Skip to content"}
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label={copy.navLabel}>
          <Link href={isFrench ? "/fr" : "/"} className="flex min-w-0 items-center space-x-3">
            <Image src="/images/cacacaninlogo.jpg" alt="Ca-Ca Canin logo" width={40} height={40} className="h-10 w-10" />
            <span className="text-lg font-bold text-[#307944] sm:text-2xl">CA-CA CANIN</span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <Link href={copy.homeHref} className="text-gray-700 transition-colors hover:text-[#307944]">
              {copy.home}
            </Link>
            <Link href={copy.springCleanupHref} className="text-gray-700 transition-colors hover:text-[#307944]">
              {copy.springCleanup}
            </Link>
            <Link href={copy.faqHref} className="text-gray-700 transition-colors hover:text-[#307944]">
              {copy.faq}
            </Link>
            <Link href={copy.contactHref} className="text-gray-700 transition-colors hover:text-[#307944]">
              {copy.contact}
            </Link>
            <Link href={copy.languageHref} className="text-[#724420] transition-colors hover:text-[#8b5a3c]">
              {copy.language}
            </Link>
            <Button size="lg" className="bg-[#307944] text-white hover:bg-[#307944]" asChild>
              <Link href={copy.quoteHref}>{copy.quote}</Link>
            </Button>
          </div>

          <Button size="sm" className="bg-[#307944] text-white hover:bg-[#307944] md:hidden" asChild>
            <Link href={copy.quoteHref}>{copy.quoteShort}</Link>
          </Button>
        </nav>
        <Link
          href={copy.promoHref}
          className="block bg-[#307944] px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm"
        >
          {copy.promoText}
        </Link>
      </header>

      <main id="main-content" className="flex-1 bg-white pt-24">{children}</main>

      <SiteFooter locale={locale} />
    </div>
  );
}
