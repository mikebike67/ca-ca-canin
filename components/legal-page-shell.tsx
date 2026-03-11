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

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary">
          <Link href={isFrench ? "/fr" : "/"} className="flex min-w-0 items-center space-x-3">
            <Image src="/images/cacacaninlogo.jpg" alt="Ca-Ca Canin logo" width={40} height={40} className="h-10 w-10" />
            <span className="text-lg font-bold text-[#307944] sm:text-2xl">CA-CA CANIN</span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <Link href={isFrench ? "/fr" : "/"} className="text-gray-700 transition-colors hover:text-[#307944]">
              {isFrench ? "Accueil" : "Home"}
            </Link>
            <Link href={isFrench ? "/fr#faq" : "/#faq"} className="text-gray-700 transition-colors hover:text-[#307944]">
              FAQ
            </Link>
            <Button size="lg" className="bg-[#307944] text-white hover:bg-[#307944]" asChild>
              <Link href={isFrench ? "/fr#quote-form" : "/#quote-form"}>{isFrench ? "Obtenir un devis" : "Get a Quote"}</Link>
            </Button>
          </div>

          <Button size="sm" className="bg-[#307944] text-white hover:bg-[#307944] md:hidden" asChild>
            <Link href={isFrench ? "/fr#quote-form" : "/#quote-form"}>{isFrench ? "Devis" : "Quote"}</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 bg-white pt-16">{children}</main>

      <SiteFooter locale={locale} />
    </div>
  );
}
