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
      socialHeading: "Socials",
      servicesHeading: "Services",
      services: [
        { href: isHome ? "#services" : "/#services", label: "Residential" },
        { href: "/spring-cleanup", label: "Spring Cleanup" },
      ],
      aboutHeading: "About",
      about: [
        { href: isHome ? "#about" : "/#about", label: "About" },
        { href: isHome ? "#faq" : "/#faq", label: "FAQ" },
        { href: "/contact", label: "Contact" },
      ],
      contactHeading: "Contact",
      hoursHeading: "Hours",
      hours: [
        { day: "Monday", time: "4:30pm-9pm" },
        { day: "Tuesday", time: "4:30pm-9pm" },
        { day: "Wednesday", time: "7am-9pm" },
        { day: "Thursday", time: "4:30pm-9pm" },
        { day: "Friday", time: "12pm-9pm" },
        { day: "Saturday", time: "7am-9pm" },
        { day: "Sunday", time: "7am-9pm" },
      ],
      legalHeading: "Legal",
      legal: [
        { href: "/terms", label: "Terms" },
        { href: "/privacy", label: "Privacy Policy" },
      ],
      logoAlt: "Ca-Ca Canin logo",
    },
    fr: {
      description: "Service de ramassage de déjections canines a Laval et nettoyage printanier a Laval ainsi que dans certaines villes de la Rive-Nord.",
      socialHeading: "Reseaux sociaux",
      servicesHeading: "Services",
      services: [
        { href: isHome ? "#services" : "/fr#services", label: "Résidentiel" },
        { href: "/fr/nettoyage-printemps", label: "Nettoyage printanier" },
      ],
      aboutHeading: "À propos",
      about: [
        { href: isHome ? "#about" : "/fr#about", label: "À propos" },
        { href: isHome ? "#faq" : "/fr#faq", label: "FAQ" },
        { href: "/fr/contact", label: "Contact" },
      ],
      contactHeading: "Nous joindre",
      hoursHeading: "Heures d'ouverture",
      hours: [
        { day: "Lundi", time: "16h30-21 h" },
        { day: "Mardi", time: "16h30-21 h" },
        { day: "Mercredi", time: "7 h-21 h" },
        { day: "Jeudi", time: "16h30-21 h" },
        { day: "Vendredi", time: "12 h-21 h" },
        { day: "Samedi", time: "7 h-21 h" },
        { day: "Dimanche", time: "7 h-21 h" },
      ],
      legalHeading: "Mentions légales",
      legal: [
        { href: "/fr/terms", label: "Conditions" },
        { href: "/fr/privacy", label: "Confidentialité" },
      ],
      logoAlt: "Logo Ca-Ca Canin",
    },
  }[locale];

  const socialLinks = [
    { href: "https://ca.pinterest.com/cacacanin/", label: "Pinterest" },
    { href: "https://www.tiktok.com/@cacacanin", label: "TikTok" },
    { href: "https://www.youtube.com/@CaCaCanin", label: "YouTube" },
    { href: "https://x.com/cacacanin", label: "X" },
    { href: "https://www.facebook.com/CaCaCanin", label: "Facebook" },
    { href: "https://www.instagram.com/caca.canin/", label: "Instagram" },
  ] as const;

  return (
    <footer className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center sm:text-left">
            <div className="mb-4 flex items-center justify-center space-x-3 sm:justify-start">
              <Image src="/images/cacacaninlogo.jpg" alt={copy.logoAlt} width={40} height={40} className="h-10 w-10 rounded-full" />
              <span className="text-lg font-bold tracking-[0.12em] text-[#7bd18f] sm:text-xl">CA-CA CANIN</span>
            </div>
            <p className="max-w-md text-sm leading-7 text-gray-300">{copy.description}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white/80 sm:text-left">{copy.contactHeading}</h3>
            <ul className="space-y-3 text-sm text-gray-300">
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

            <h3 className="mb-4 mt-6 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white/80 sm:text-left">{copy.socialHeading}</h3>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {socialLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white/80 sm:text-left">{copy.hoursHeading}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {copy.hours.map((item) => (
                <li key={item.day} className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                  <span className="font-medium text-white/90">{item.day}</span>
                  <span className="text-right">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center sm:text-left">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/80">{copy.servicesHeading}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {copy.services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              {copy.about.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
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

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 Ca-Ca Canin</p>
        </div>
      </div>
    </footer>
  );
}
