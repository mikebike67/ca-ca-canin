import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

type SiteFooterProps = {
  locale?: "en" | "fr";
  isHome?: boolean;
};

export default function SiteFooter({ locale = "en", isHome = false }: SiteFooterProps) {
  const copy = {
    en: {
      description: "Dog waste removal in Laval and spring cleanup across Laval plus select North Shore locations.",
      servicesHeading: "Services",
      services: [
        { href: isHome ? "#services" : "/#services", label: "Residential" },
        { href: "/spring-cleanup", label: "Spring Cleanup" },
      ],
      aboutHeading: "About",
      about: [
        { href: isHome ? "#about" : "/#about", label: "About" },
        { href: isHome ? "#faq" : "/#faq", label: "FAQ" },
      ],
      contactHeading: "Contact",
      legalHeading: "Legal",
      legal: [
        { href: "/terms", label: "Terms" },
        { href: "/privacy", label: "Privacy Policy" },
      ],
      logoAlt: "Ca-Ca Canin logo",
    },
    fr: {
      description: "Service de ramassage de déjections canines a Laval et nettoyage printanier a Laval ainsi que dans certaines villes de la Rive-Nord.",
      servicesHeading: "Services",
      services: [
        { href: isHome ? "#services" : "/fr#services", label: "Résidentiel" },
        { href: "/fr/nettoyage-printemps", label: "Nettoyage printanier" },
      ],
      aboutHeading: "À propos",
      about: [
        { href: isHome ? "#about" : "/fr#about", label: "À propos" },
        { href: isHome ? "#faq" : "/fr#faq", label: "FAQ" },
      ],
      contactHeading: "Nous joindre",
      legalHeading: "Mentions légales",
      legal: [
        { href: "/fr/terms", label: "Conditions" },
        { href: "/fr/privacy", label: "Confidentialité" },
      ],
      logoAlt: "Logo Ca-Ca Canin",
    },
  }[locale];

  return (
    <footer className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-8 text-center sm:grid-cols-2 sm:text-left xl:grid-cols-5">
          <div>
            <div className="mb-4 flex items-center justify-center space-x-3 sm:justify-start">
              <Image src="/images/cacacaninlogo.jpg" alt={copy.logoAlt} width={32} height={32} className="h-8 w-8" />
              <span className="text-lg font-bold text-[#307944] sm:text-xl">CA-CA CANIN</span>
            </div>
            <p className="text-gray-400">{copy.description}</p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{copy.servicesHeading}</h3>
            <ul className="space-y-2 text-gray-400">
              {copy.services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{copy.aboutHeading}</h3>
            <ul className="space-y-2 text-gray-400">
              {copy.about.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{copy.contactHeading}</h3>
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
            <h3 className="mb-4 font-semibold">{copy.legalHeading}</h3>
            <ul className="space-y-2 text-gray-400">
              {copy.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2026 Ca-Ca Canin</p>
        </div>
      </div>
    </footer>
  );
}
